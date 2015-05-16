'use strict';

angular.module('myApp.eventDetail', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        //The below puts eventId as a variable on routeParams, and loads the page with the controller
        $routeProvider.when('/events/:eventId', {
            templateUrl: 'event-detail/event-detail.html',
            controller: 'EventDetailCtrl'
        });
    }])

    .controller('EventDetailCtrl', ['$scope', '$routeParams', 'Restangular', function ($scope, $routeParams, Restangular) {
        $scope.eventId = $routeParams.eventId;

        //Fetch one event, with the ID taken from $routeParams. Put that event on scope
        Restangular.one('events', $scope.eventId).customGET()
            .then(function (event) {
                $scope.event = event;
            }, function () {
                alert("Something has gone horribly wrong...")
            });
    }]);