'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.events',
    'myApp.eventDetail',
    'myApp.addEvent',
    'myApp.version',
    'restangular'
]).
    config(['$routeProvider', 'RestangularProvider', function ($routeProvider, RestangularProvider) {
        $routeProvider.otherwise({redirectTo: '/events'});

        RestangularProvider.setBaseUrl('http://localhost:8001') //Prepend for API calls
    }])
