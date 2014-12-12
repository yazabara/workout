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
