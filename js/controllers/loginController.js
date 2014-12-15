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