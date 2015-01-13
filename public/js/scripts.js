'use strict';

var settings = {
	firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', [
	'ngRoute',
	'firebase',
	'AuthService',
    'workout.calendar'
], function($routeProvider, $locationProvider) {

	$routeProvider.when("/workout/login", {
		controller: "LoginController",
		templateUrl: "/login.jade",
		resolve: {
			"currentAuth": ["AuthCustom", function(AuthCustom) {
				return AuthCustom.$waitForAuth();
			}]
		}
	});
    $routeProvider.when("/workout/trainings/new", {
        controller: "NewTrainingController",
        templateUrl: "/new-training.jade",
        resolve: {
            "currentAuth": ["AuthCustom", function(AuthCustom) {
                return AuthCustom.$waitForAuth();
            }]
        }
    });
	$routeProvider.when("/workout/profile", {
		controller: "ProfileController",
		templateUrl: "/profile.jade",
		resolve: {
			"currentAuth": ["AuthCustom", function(AuthCustom) {
				return AuthCustom.$requireAuth();
			}]
		}
	});

	$routeProvider.otherwise({redirectTo: "/workout/profile"});
	$locationProvider.html5Mode(true);


}).constant('FIRE_BASE_URL', settings.firebaseUrl);

workoutPortalApp.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") {
			$location.path("/workout/login");
		}
	});
}]);
workoutPortalApp.controller('LoginController', ['$scope', 'AuthCustom', '$location', function ($scope, AuthCustom, $location) {
	$scope.userEmail = null;
	$scope.userPassword = null;

	$scope.authWithPassword = function() {
		AuthCustom.$authWithPassword({
			email: $scope.userEmail,
			password: $scope.userPassword
		}).then(function(authData) {
			$location.path("/workout/profile");
		});
	};

	$scope.googleAuth = function () {
		AuthCustom.$authWithOAuthPopup('google').then(function(authData) {
			$location.path("/workout/profile");
		});
	};

	$scope.facebookAuth = function () {
		AuthCustom.$authWithOAuthPopup('facebook').then(function(authData) {
			$location.path("/workout/profile");
		});
	};

	$scope.githubAuth = function () {
		AuthCustom.$authWithOAuthPopup('github').then(function(authData) {
			$location.path("/workout/profile");
		});
	};
}]);
workoutPortalApp.controller('NewTrainingController', ['$scope', 'AuthCustom', '$route', function ($scope, AuthCustom, $route) {
    $scope.logout = function() {
        AuthCustom.$unauth();
        $route.reload();
    };
}]);
workoutPortalApp.controller('ProfileController', ['$scope', 'AuthCustom', '$route', function ($scope, AuthCustom, $route) {
    $scope.logout = function() {
        AuthCustom.$unauth();
        $route.reload();
    };
}]);
var CalendarModule = angular.module('workout.calendar', ['ui.calendar', 'ui.bootstrap']);

CalendarModule.controller('CalendarCtrl', function ($scope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that contains custom events on the scope */
    $scope.events = [
        {title: 'All Day Event', start: new Date(y, m, 1)},
        {title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
        {id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
        {id: 999, title: 'Repeating Event', start: new Date(y, m, d + 5, 16, 0), allDay: false},
        {title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false}
    ];

    /* config object */
    $scope.uiConfig = {
        calendar: {
            editable: true,
            header: {
                left: 'title',
                center: 'month agendaWeek agendaDay',
                right: 'today prev,next'
            }
        }
    };

    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index, 1);
    };

    $scope.eventSources = [$scope.events];

});


angular.module('AuthService', ['firebase']).service('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL) {
	var ref = new Firebase(FIRE_BASE_URL);
    return $firebaseAuth(ref);
});
/*
 *  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
 *  API @ http://arshaw.com/fullcalendar/
 *
 *  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
 *       Can also take in multiple event urls as a source object(s) and feed the events per view.
 *       The calendar will watch any eventSource array and update itself when a change is made.
 *
 */

angular.module('ui.calendar', [])
    .constant('uiCalendarConfig', {calendars: {}})
    .controller('uiCalendarCtrl', ['$scope',
        '$timeout',
        '$locale', function(
            $scope,
            $timeout,
            $locale){

            var sourceSerialId = 1,
                eventSerialId = 1,
                sources = $scope.eventSources,
                extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

                wrapFunctionWithScopeApply = function(functionToWrap){
                    var wrapper;

                    if (functionToWrap){
                        wrapper = function(){
                            // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                            // In this way the function will be safely executed on the next digest.

                            var args = arguments;
                            var _this = this;
                            $timeout(function(){
                                functionToWrap.apply(_this, args);
                            });
                        };
                    }

                    return wrapper;
                };

            this.eventsFingerprint = function(e) {
                if (!e._id) {
                    e._id = eventSerialId++;
                }
                // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
                return "" + e._id + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
                    (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
            };

            this.sourcesFingerprint = function(source) {
                return source.__id || (source.__id = sourceSerialId++);
            };

            this.allEvents = function() {
                // return sources.flatten(); but we don't have flatten
                var arraySources = [];
                for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
                    var source = sources[i];
                    if (angular.isArray(source)) {
                        // event source as array
                        arraySources.push(source);
                    } else if(angular.isObject(source) && angular.isArray(source.events)){
                        // event source as object, ie extended form
                        var extEvent = {};
                        for(var key in source){
                            if(key !== '_uiCalId' && key !== 'events'){
                                extEvent[key] = source[key];
                            }
                        }
                        for(var eI = 0;eI < source.events.length;eI++){
                            angular.extend(source.events[eI],extEvent);
                        }
                        arraySources.push(source.events);
                    }
                }

                return Array.prototype.concat.apply([], arraySources);
            };

            // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
            // arguments:
            //  arraySource array of function that returns array of objects to watch
            //  tokenFn function(object) that returns the token for a given object
            this.changeWatcher = function(arraySource, tokenFn) {
                var self;
                var getTokens = function() {
                    var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
                    var result = [], token, el;
                    for (var i = 0, n = array.length; i < n; i++) {
                        el = array[i];
                        token = tokenFn(el);
                        map[token] = el;
                        result.push(token);
                    }
                    return result;
                };
                // returns elements in that are in a but not in b
                // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
                var subtractAsSets = function(a, b) {
                    var result = [], inB = {}, i, n;
                    for (i = 0, n = b.length; i < n; i++) {
                        inB[b[i]] = true;
                    }
                    for (i = 0, n = a.length; i < n; i++) {
                        if (!inB[a[i]]) {
                            result.push(a[i]);
                        }
                    }
                    return result;
                };

                // Map objects to tokens and vice-versa
                var map = {};

                var applyChanges = function(newTokens, oldTokens) {
                    var i, n, el, token;
                    var replacedTokens = {};
                    var removedTokens = subtractAsSets(oldTokens, newTokens);
                    for (i = 0, n = removedTokens.length; i < n; i++) {
                        var removedToken = removedTokens[i];
                        el = map[removedToken];
                        delete map[removedToken];
                        var newToken = tokenFn(el);
                        // if the element wasn't removed but simply got a new token, its old token will be different from the current one
                        if (newToken === removedToken) {
                            self.onRemoved(el);
                        } else {
                            replacedTokens[newToken] = removedToken;
                            self.onChanged(el);
                        }
                    }

                    var addedTokens = subtractAsSets(newTokens, oldTokens);
                    for (i = 0, n = addedTokens.length; i < n; i++) {
                        token = addedTokens[i];
                        el = map[token];
                        if (!replacedTokens[token]) {
                            self.onAdded(el);
                        }
                    }
                };
                return self = {
                    subscribe: function(scope, onChanged) {
                        scope.$watch(getTokens, function(newTokens, oldTokens) {
                            if (!onChanged || onChanged(newTokens, oldTokens) !== false) {
                                applyChanges(newTokens, oldTokens);
                            }
                        }, true);
                    },
                    onAdded: angular.noop,
                    onChanged: angular.noop,
                    onRemoved: angular.noop
                };
            };

            this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
                var config = {};

                angular.extend(config, uiCalendarConfig);
                angular.extend(config, calendarSettings);

                angular.forEach(config, function(value,key){
                    if (typeof value === 'function'){
                        config[key] = wrapFunctionWithScopeApply(config[key]);
                    }
                });

                return config;
            };

            this.getLocaleConfig = function(fullCalendarConfig) {
                if (!fullCalendarConfig.lang || fullCalendarConfig.useNgLocale) {
                    // Configure to use locale names by default
                    var tValues = function(data) {
                        // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
                        var r, k;
                        r = [];
                        for (k in data) {
                            r[k] = data[k];
                        }
                        return r;
                    };
                    var dtf = $locale.DATETIME_FORMATS;
                    return {
                        monthNames: tValues(dtf.MONTH),
                        monthNamesShort: tValues(dtf.SHORTMONTH),
                        dayNames: tValues(dtf.DAY),
                        dayNamesShort: tValues(dtf.SHORTDAY)
                    };
                }
                return {};
            };
        }])
    .directive('uiCalendar', ['uiCalendarConfig', function(uiCalendarConfig) {
        return {
            restrict: 'A',
            scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
            controller: 'uiCalendarCtrl',
            link: function(scope, elm, attrs, controller) {

                var sources = scope.eventSources,
                    sourcesChanged = false,
                    calendar,
                    eventSourcesWatcher = controller.changeWatcher(sources, controller.sourcesFingerprint),
                    eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
                    options = null;

                function getOptions(){
                    var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
                        fullCalendarConfig;

                    fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);

                    var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
                    angular.extend(localeFullCalendarConfig, fullCalendarConfig);
                    options = { eventSources: sources };
                    angular.extend(options, localeFullCalendarConfig);
                    //remove calendars from options
                    options.calendars = null;

                    var options2 = {};
                    for(var o in options){
                        if(o !== 'eventSources'){
                            options2[o] = options[o];
                        }
                    }
                    return JSON.stringify(options2);
                }

                scope.destroy = function(){
                    if(calendar && calendar.fullCalendar){
                        calendar.fullCalendar('destroy');
                    }
                    if(attrs.calendar) {
                        calendar = uiCalendarConfig.calendars[attrs.calendar] = $(elm).html('');
                    } else {
                        calendar = $(elm).html('');
                    }
                };

                scope.init = function(){
                    calendar.fullCalendar(options);
                };

                eventSourcesWatcher.onAdded = function(source) {
                    calendar.fullCalendar('addEventSource', source);
                    sourcesChanged = true;
                };

                eventSourcesWatcher.onRemoved = function(source) {
                    calendar.fullCalendar('removeEventSource', source);
                    sourcesChanged = true;
                };

                eventsWatcher.onAdded = function(event) {
                    calendar.fullCalendar('renderEvent', event);
                };

                eventsWatcher.onRemoved = function(event) {
                    calendar.fullCalendar('removeEvents', function(e) {
                        return e._id === event._id;
                    });
                };

                eventsWatcher.onChanged = function(event) {
                    event._start = $.fullCalendar.moment(event.start);
                    event._end = $.fullCalendar.moment(event.end);
                    calendar.fullCalendar('updateEvent', event);
                };

                eventSourcesWatcher.subscribe(scope);
                eventsWatcher.subscribe(scope, function(newTokens, oldTokens) {
                    if (sourcesChanged === true) {
                        sourcesChanged = false;
                        // prevent incremental updates in this case
                        return false;
                    }
                });

                scope.$watch(getOptions, function(newO,oldO){
                    scope.destroy();
                    scope.init();
                });
            }
        };
    }]);