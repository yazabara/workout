angular.module('AuthService', ['firebase']).factory('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL, $rootScope, $log) {
	var ref = new Firebase(FIRE_BASE_URL);
	var auth = $firebaseAuth(ref);

	var AuthCustom = {
		authRemote: function(remote) {
			auth.$authWithOAuthPopup(remote).then(function(authData) {
				console.log("Logged in as:", authData.uid);
			}).catch(function(error) {
				console.error("Authentication failed:", error);
			});
		},
		unauth: function() {
			auth.$unauth();
		},
		user: {}
	};
	return AuthCustom;
});