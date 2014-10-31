'use strict';

var settings = {
    firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var myAccountApp = angular.module('myAccountApp', ['firebase', 'AuthService'])
    .constant('FIRE_BASE_URL', settings.firebaseUrl);

myAccountApp.controller('AccountController', ["$scope", "$firebase", '$firebaseSimpleLogin', 'FIRE_BASE_URL' , 'AuthCustom',
    function ($scope, $firebase, $firebaseSimpleLogin, FIRE_BASE_URL, AuthCustom) {

        AuthCustom.loginRemote('facebook');
        //AuthCustom.loginRemote('google');
//    console.log('tru log: ' + AuthCustom.login({email:'Yaroslav_Zabara@epam.com', password: '123Qwe'}));
//
//        var ref = new Firebase(FIRE_BASE_URL);
//        // prefer pop-ups, so we don't navigate away from the page
//        ref.authWithOAuthPopup("google", function(err, authData) {
//            if (err) {
//                if (err.code === "TRANSPORT_UNAVAILABLE") {
//                    // fall-back to browser redirects, and pick up the session
//                    // automatically when we come back to the origin page
//                    ref.authWithOAuthRedirect("google", function(err, authData) {
//
//                    });
//                }
//            } else if (authData) {
//                // user authenticated with Firebase
//            }
//        });
}]);