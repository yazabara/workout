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
    $routeProvider.when("/workout/trainings/new", {
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
workoutPortalApp.controller('ProfileController', ['$scope', 'AuthCustom', '$route', function ($scope, AuthCustom, $route) {
    $scope.logout = function() {
        AuthCustom.$unauth();
        $route.reload();
    };
}]);
angular.module('AuthService', ['firebase']).service('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL) {
	var ref = new Firebase(FIRE_BASE_URL);
    return $firebaseAuth(ref);
});