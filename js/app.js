'use strict';

var settings = {
	firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', [
	'ngRoute',
	'firebase',
    'workout.calendar'
], function($routeProvider, $locationProvider) {

	$routeProvider.when("/workout/login", {
		controller: "LoginController",
		templateUrl: "/login.jade",
		resolve: {
			"currentAuth": ["AuthService", function(AuthService) {
				return AuthService.waitForAuth();
			}]
		}
	});
    $routeProvider.when("/workout/trainings/new", {
        controller: "NewTrainingController",
        templateUrl: "/new-training.jade",
        resolve: {
            "currentAuth": ["AuthService", function(AuthService) {
                return AuthService.waitForAuth();
            }]
        }
    });
	$routeProvider.when("/workout/profile", {
		controller: "ProfileController",
		templateUrl: "/profile.jade",
		resolve: {
			"currentAuth": ["AuthService", function(AuthService) {
				return AuthService.requireAuth();
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