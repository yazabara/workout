workoutPortalApp.controller('NewTrainingController', ['$scope', 'AuthCustom', '$route', function ($scope, AuthCustom, $route) {
    $scope.logout = function() {
        AuthCustom.$unauth();
        $route.reload();
    };
}]);