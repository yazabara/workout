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