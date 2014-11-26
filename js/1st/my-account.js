'use strict';

var settings = {
    firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', ['firebase', 'AuthService'])
    .constant('FIRE_BASE_URL', settings.firebaseUrl);

workoutPortalApp.controller('AccountController', ["$scope", 'AuthCustom',
    function ($scope, AuthCustom) {
        $scope.facebookAuth = function () {
            AuthCustom.loginRemote('facebook');
        };
        $scope.googleAuth = function () {
            AuthCustom.loginRemote('google');
        };
    }]
);