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