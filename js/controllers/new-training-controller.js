workoutPortalApp.controller('NewTrainingController', ['$scope', 'AuthService', '$route', function ($scope, AuthService, $route) {
    $scope.logout = function() {
        AuthService.unauth();
        $route.reload();
    };
}]);