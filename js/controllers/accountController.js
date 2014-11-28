workoutPortalApp.controller('AccountController', function ($scope, AuthCustom) {
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
	}
});