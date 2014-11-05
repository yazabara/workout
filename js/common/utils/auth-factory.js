'use strict';

var authModule = angular.module('AuthService', ['firebase'])
    .constant('FIRE_BASE_URL', settings.firebaseUrl);

/**
 * Old implementation:
 * FIREBASE WARNING: FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.
 *
 * https://auth.firebase.com/auth/google/callback
 * https://auth.firebase.com/auth/facebook/callback
 */
authModule.factory('AuthCustom', function ($firebaseSimpleLogin, FIRE_BASE_URL, $rootScope, $log) {
    var ref = new Firebase(FIRE_BASE_URL);
    var auth = $firebaseSimpleLogin(ref);

    var AuthCustom = {
        register: function (user) {
            return auth.$createUser(user.email, user.password);
        },
        login: function (user) {
            return auth.$login('password', user);
        },
        logout: function () {
            auth.$logout();
        },
        resolveUser: function () {
            return auth.$getCurrentUser();
        },
        signedIn: function () {
            return !!AuthCustom.user.provider;
        },
        loginRemote: function (remote) {
            auth.$login(remote);
        },
        user: {}
    };

    $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
        angular.copy(user, AuthCustom.user);
        $log.info(AuthCustom.user + " logged in");

        //лог пользователей.
        user.lastAuth = new Date().toString();
        ref.child('log/users').child(user.uid).set(user);
    });
    $rootScope.$on('$firebaseSimpleLogin:logout', function () {
        angular.copy({}, AuthCustom.user);
        $log.info(AuthCustom.user + " logged out");
    });

    return AuthCustom;
});