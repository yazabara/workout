var CalendarModule = angular.module('workout.calendar', ['ui.calendar', 'ui.bootstrap']);

CalendarModule.controller('CalendarCtrl', function ($scope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that contains custom events on the scope */
    $scope.events = [
        {title: 'All Day Event', start: new Date(y, m, 1)},
        {title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
        {id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
        {id: 999, title: 'Repeating Event', start: new Date(y, m, d + 5, 16, 0), allDay: false},
        {title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false}
    ];

    /* config object */
    $scope.uiConfig = {
        calendar: {
            editable: true,
            header: {
                left: 'title',
                center: 'month agendaWeek agendaDay',
                right: 'today prev,next'
            }
        }
    };

    $scope.eventSources = [$scope.events];

});

