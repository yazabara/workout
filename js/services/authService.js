angular.module('AuthService', ['firebase']).factory('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL, $rootScope, $log) {
	var ref = new Firebase(FIRE_BASE_URL);
	var auth = $firebaseAuth(ref);

	var AuthCustom = {
		authRemote: function(remote) {
			auth.$authWithOAuthPopup(remote);
		},
		authWithPassword: function(email, password) {
			auth.$authWithPassword({
				email: email,
				password: password
			});
		},
		unauth: function() {
			auth.$unauth();
		},
		createUser: function(email, password) {
			auth.$createUser(email, password);
		},
		user: {}
	};

	auth.$onAuth(function(authData) {
		if (authData) {
			console.log(authData);
		}
	});
	return AuthCustom;
});