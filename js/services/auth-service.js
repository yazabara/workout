workoutPortalApp.factory('AuthService', ['$firebaseAuth', 'FIRE_BASE_URL', '$log', '$q', function ($firebaseAuth, FIRE_BASE_URL, $log, $q) {
    var ref = new Firebase(FIRE_BASE_URL);
    var auth = $firebaseAuth(ref);

    var authWithPassword = function (email, password) {
        var deferred = $q.defer();
        auth.$authWithPassword({
            email: email,
            password: password
        }).then(function (authData) {
            $log.log(authData.uid + " logged in");
            deferred.resolve();
        }).catch(function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var createUser = function (email, password) {
        var deferred = $q.defer();
        auth.$createUser(email, password).then(function () {
            auth.$authWithPassword({
                email: email,
                password: password
            }).then(function (authData) {
                $log.log("Create user: " + authData.uid);
                ref.child('users').child(authData.uid).set({email: $scope.userEmail});
                deferred.resolve();
            }).catch(function (error) {
                $log.error(error);
                deferred.reject(error);
            });
        }).catch(function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var authWithOAuthPopup = function (provider) {
        var deferred = $q.defer();
        auth.$authWithOAuthPopup(provider).then(function (authData) {
            $log.log(authData.uid + " logged in");
            deferred.resolve();
        }).catch(function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var waitForAuth = auth.$waitForAuth;

    var requireAuth = auth.$requireAuth;

    var getAuth = auth.$getAuth;

    var unauth = function() {
        $log.log(getAuth().uid + " logged out");
        auth.$unauth();
    };

    return {
        authWithPassword: authWithPassword,
        createUser: createUser,
        authWithOAuthPopup: authWithOAuthPopup,
        waitForAuth: waitForAuth,
        requireAuth: requireAuth,
        getAuth: getAuth,
        unauth: unauth
    }
}]);