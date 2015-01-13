workoutPortalApp.controller('LoginController', ['$scope', 'AuthCustom', '$location', '$log', 'FIRE_BASE_URL', function ($scope, AuthCustom, $location, $log, FIRE_BASE_URL) {
	var ref = new Firebase(FIRE_BASE_URL);
	$scope.userEmail = null;
	$scope.userPassword = null;

	$scope.authWithPassword = function() {
		AuthCustom.$authWithPassword({
			email: $scope.userEmail,
			password: $scope.userPassword
		}).then(function(authData) {
			$log.log(authData.uid + " logged in");
			$location.path("/workout/profile");
		});
	};

	$scope.createUser = function() {
		AuthCustom.$createUser($scope.userEmail, $scope.userPassword).then(function() {
			AuthCustom.$authWithPassword({
				email: $scope.userEmail,
				password: $scope.userPassword
			}).then(function(authData) {
				$log.log("Create user: " + authData.uid);
				ref.child('users').child(authData.uid).set({ email: $scope.userEmail });
				$location.path("/workout/profile");
			}).catch(function(error) {
				$log.error(error);
			});
		}).catch(function(error) {
			$log.error(error);
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