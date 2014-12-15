'use strict';

var settings = {
	firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', [
	'ngRoute',
	'firebase',
	'AuthService'
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
	}

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
workoutPortalApp.controller('ProfileController', ['$scope', 'AuthCustom', '$route', function ($scope, AuthCustom, $route) {
    $scope.logout = function() {
        AuthCustom.$unauth();
        $route.reload();
    }
}]);
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
angular.module('AuthService', ['firebase']).service('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL) {
	var ref = new Firebase(FIRE_BASE_URL);
	var auth = $firebaseAuth(ref);
	return auth;
});