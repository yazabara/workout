'use strict';

var settings = {
	firebaseUrl: 'https://blinding-inferno-9356.firebaseio.com/'
};

var workoutPortalApp = angular.module('workoutPortalApp', [
	'firebase',
	'AuthService'
]).constant('FIRE_BASE_URL', settings.firebaseUrl);
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
/**
 * WordMagic модуль - для преобразования текста. Каждая буква будет выведенена с определенным делэем.
 * magic-word.scss(css) - обязательно @keyframes magic.
 * #красивость
 */

angular.module('yazabara.MagicWord', []).directive('magicWord', ['$window', function ($window) {
    return {
        restrict: 'A',
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {
            wordDelay: '@',
            wordStart: '@'
        },
        link: function ($scope, elem) {

            var setPosition = function () {
                var text = $(elem).text();
                elem.text("").addClass('magic-word-container');

                var delay = ($scope.wordDelay ? $scope.wordDelay : 1 );
                var start = ($scope.wordStart ? $scope.wordStart : 1 );

                for (var i = 0; i < text.length; i++) {
                    var step = start + (delay * i);
                    $(elem).append('<span class="chr' + i + '" style="-webkit-animation-delay: ' + step + 's; -moz-animation-delay: ' + step + 's; -ms-animation-delay: ' + step + 's; animation-delay: ' + step + 's;">' + text[i] + '</span>')
                }
            };
            angular.element($window).bind('load', setPosition);
        }
    };
}]);
angular.module('yazabara.ScrollToItem', []).directive('scrollToItem', function () {
	return {
		restrict: 'A',
		scope: {
			scrollTo: "@",
			scrollEffect: "@"
		},
		link: function ($scope, $elm) {
			$elm.on('click', function () {
				$('html,body').animate({
					scrollTop: $($scope.scrollTo).offset().top
				}, $scope.scrollEffect ? $scope.scrollEffect : "slow");
			});
		}
	}
});
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