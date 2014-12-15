angular.module('AuthService', ['firebase']).service('AuthCustom', function ($firebaseAuth, FIRE_BASE_URL) {
	var ref = new Firebase(FIRE_BASE_URL);
	var auth = $firebaseAuth(ref);
	return auth;
});