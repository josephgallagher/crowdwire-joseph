'use strict';

angular.module('myApp.events', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            templateUrl: 'events/events.html',
            controller: 'EventsCtrl'
        });
    }])

    .controller('EventsCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {


        //i.e http://localhost:8001/events
        Restangular.all('events').getList()
            .then(function (events) {
                $scope.events = events;
            });
    }]);