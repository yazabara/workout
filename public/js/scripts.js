'use strict';

var settings = {
	firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', [
	'ngRoute',
	'firebase',
	'AuthService'
], function($routeProvider, $locationProvider) {
	$routeProvider.when("/workout/login", { controller: "AccountController", templateUrl: "/login.jade" });
	$routeProvider.otherwise({redirectTo: "/workout/login"});
	$locationProvider.html5Mode(true);
}).constant('FIRE_BASE_URL', settings.firebaseUrl);

/*workoutPortalApp.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") {
			$location.path("/login");
		}
	});
}]);*/
/*workoutPortalApp.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/login", {
		controller: "AccountController",
		templateUrl: "login.jade",
		resolve: {
			"currentAuth": ["Auth", function(Auth) {
				return Auth.$waitForAuth();
			}]
		}
	});
}]);*/

workoutPortalApp.controller('AccountController', function ($scope, AuthCustom) {
	$scope.userEmail = null;
	$scope.userPassword = null;

	$scope.authWithPassword = function() {
		AuthCustom.authWithPassword($scope.userEmail, $scope.userPassword);
	}

	$scope.googleAuth = function () {
		AuthCustom.authRemote('google');
	};

	$scope.facebookAuth = function () {
		AuthCustom.authRemote('facebook');
	};

	$scope.githubAuth = function () {
		AuthCustom.authRemote('github');
	};

	$scope.unauth = function() {
		AuthCustom.unauth();
	};

	$scope.createUser = function() {
		AuthCustom.createUser();
	};
});
/**
 * WordMagic модуль - для преобразования текста. Каждая буква будет выведенена с определенным делэем.
 * magic-word.scss(css) - обязательно @keyframes magic.
 * #красивость
 */

angular.module('yazabara.MagicWord', []).directive('magicWord', ['$window', function ($window) {
    return {
        restrict: 'A',
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {
            wordDelay: '@',
            wordStart: '@'
        },
        link: function ($scope, elem) {

            var setPosition = function () {
                var text = $(elem).text();
                elem.text("").addClass('magic-word-container');

                var delay = ($scope.wordDelay ? $scope.wordDelay : 1 );
                var start = ($scope.wordStart ? $scope.wordStart : 1 );

                for (var i = 0; i < text.length; i++) {
                    var step = start + (delay * i);
                    $(elem).append('<span class="chr' + i + '" style="-webkit-animation-delay: ' + step + 's; -moz-animation-delay: ' + step + 's; -ms-animation-delay: ' + step + 's; animation-delay: ' + step + 's;">' + text[i] + '</span>')
                }
            };
            angular.element($window).bind('load', setPosition);
        }
    };
}]);
angular.module('yazabara.ScrollToItem', []).directive('scrollToItem', function () {
	return {
		restrict: 'A',
		scope: {
			scrollTo: "@",
			scrollEffect: "@"
		},
		link: function ($scope, $elm) {
			$elm.on('click', function () {
				$('html,body').animate({
					scrollTop: $($scope.scrollTo).offset().top
				}, $scope.scrollEffect ? $scope.scrollEffect : "slow");
			});
		}
	}
});
angular.module('AuthService', ['firebase']).factory('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL, $rootScope, $log) {
	var ref = new Firebase(FIRE_BASE_URL);
	var auth = $firebaseAuth(ref);

	var AuthCustom = {
		authRemote: function(remote) {
			auth.$authWithOAuthPopup(remote);
		},
		authWithPassword: function(email, password) {
			auth.$authWithPassword({
				email: email,
				password: password
			});
		},
		unauth: function() {
			auth.$unauth();
		},
		createUser: function(email, password) {
			auth.$createUser(email, password);
		},
		user: {}
	};

	auth.$onAuth(function(authData) {
		if (authData) {
			console.log(authData);
		}
	});
	return AuthCustom;
});