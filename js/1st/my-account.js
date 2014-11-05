'use strict';

var settings = {
    firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var myAccountApp = angular.module('myAccountApp', ['firebase', 'AuthService'])
    .constant('FIRE_BASE_URL', settings.firebaseUrl);

myAccountApp.controller('AccountController', ["$scope", 'AuthCustom',
    function ($scope, AuthCustom) {
        $scope.facebookAuth = function () {
            AuthCustom.loginRemote('facebook');
        };
        $scope.googleAuth = function () {
            AuthCustom.loginRemote('google');
        };
    }]
);