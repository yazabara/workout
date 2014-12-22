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