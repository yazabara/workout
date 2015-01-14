workoutPortalApp.controller('LoginController', ['$scope', 'AuthService', '$location', function ($scope, AuthService, $location) {
	$scope.userEmail = null;
	$scope.userPassword = null;

	$scope.authWithPassword = function() {
		AuthService.authWithPassword($scope.userEmail, $scope.userPassword).then(function() {
			$location.path("/workout/profile");
		});
	};

	$scope.createUser = function() {
		AuthService.createUser($scope.userEmail, $scope.userPassword).then(function() {
			$location.path("/workout/profile");
		});
	};

	$scope.googleAuth = function () {
		AuthService.authWithOAuthPopup('google').then(function() {
			$location.path("/workout/profile");
		});
	};

	$scope.facebookAuth = function () {
		AuthService.authWithOAuthPopup('facebook').then(function() {
			$location.path("/workout/profile");
		});
	};

	$scope.githubAuth = function () {
		AuthService.authWithOAuthPopup('github').then(function() {
			$location.path("/workout/profile");
		});
	};
}]);