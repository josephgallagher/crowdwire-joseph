'use strict';

angular.module('myApp.addEvent', ['ngRoute'])


    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/add-event', {
                templateUrl: 'add-event/add-event.html',
                controller: 'AddEventCtrl'
            })
            .when('/add-event', {
                templateUrl: 'add-event/add-event.html',
                controller: 'EventsCtrl'
            });
    }])


    .controller('EventsCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {


        //i.e http://localhost:8001/events
        Restangular.all('events').getList()
            .then(function (events) {
                $scope.events = events;
            });
    }])


    .controller('AddEventCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

        $scope.event = {
            tags: []
        };


        //This function keeps $scope.$apply from being run if a digest is still open
        function CheckScopeBeforeApply() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }


        $scope.addLocation = function () {
            alert("Location set at " + $scope.latitude + ', ' + $scope.longitude);
            $scope.event.latitude = $scope.latitude;
            $scope.event.longitude = $scope.longitude;
        };


        $scope.addAddress = function () {
            $scope.event.address = $scope.address;
        };


        $scope.addTag = function (tagText) {
            if (tagText != null) {
                var hashtag = {name: tagText};
                $scope.event.tags.push(hashtag);
                $scope.tagText = null;
                CheckScopeBeforeApply();
            }
        };


        $scope.addPhoto = function () {
            var file = document.getElementById('file').files[0],
                reader = new FileReader();
            reader.onload = function (e) {
                $scope.event.picture = 'data:image/png;base64,' + btoa(e.target.result);
                CheckScopeBeforeApply();
            };
            reader.readAsBinaryString(file);
        };


        $scope.addEvent = function () {
            $scope.addLocation();
            $scope.addAddress();
            Restangular.all('add-event').customPOST($scope.event).then(function () {
                alert("You successfully added the event" + " at " + $scope.event.latitude + ", " + $scope.event.longitude);
                document.getElementById('file').value = null;
                $scope.event.picture = null;
                $scope.event = {tags: []}
            }, function () {
                alert("There was a problem submitting the event...")
            });
        };

    }])


    .directive('myMap', ['Restangular', function (Restangular) {
        // directive link function

        var link = function ($scope) {

            function initialize() {

                var myLatlng = new google.maps.LatLng(40.7841809093, -73.9640808105);
                var mapOptions = {
                    zoom: 7,
                    center: myLatlng
                };
                //Create a new map with .css div id=gmaps and the mapOptions above
                var map = new google.maps.Map(document.getElementById('gmaps'), mapOptions);


                // setMarker function to create the marker for existing events
                function setMarker(map, position, content) {
                    var infoWindow;
                    var markersExisting = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                    });

                    //FYI, "event" here in the google.maps.event method call is javascript speak!
                    //This listener will wait for the user to click an existing marker and popup an info window
                    google.maps.event.addListener(markersExisting, 'click', function () {
                        // close window if not undefined
                        if (infoWindow !== void 0) {
                            infoWindow.close();
                        }
                        // create new window
                        var infoWindowOptions = {
                            content: content
                        };
                        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                        infoWindow.open(map, markersExisting);
                    });
                }

                // Restangular call to grab the location data for all existing events
                Restangular.all('events').getList()
                    .then(function (events) {
                        events.forEach(function (ev) {
                            setMarker(map, new google.maps.LatLng(ev.latitude, ev.longitude), ev.caption);
                        })
                    });


                // When the map is clicked on, call the placeMarker function (to add a new marker, of course)
                google.maps.event.addListenerOnce(map, 'click', function (e) {
                    scopeLatLng(e);
                    placeMarker(e.latLng, map);
                });
            }//End the initialize function for map

            function scopeLatLng(e) {
                var latitude = e.latLng.lat();
                var longitude = e.latLng.lng();
                $scope.latitude = latitude;
                $scope.longitude = longitude;
            }


            //Create the pin marker itself, and set its characteristics
            function placeMarker(position, map) {
                var addEventMarker = new google.maps.Marker({
                    position: position,
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });

                //Add an event listener on the pin marker.  When dragged, spit out the lat and lng data
                //Also, the dragend is an alternative to click...the event occurs where the pin drops!!!
                google.maps.event.addListener(addEventMarker, "dragend", function (e) {
                    scopeLatLng(e);
                    var centerPoint = addEventMarker.getPosition();
                    map.panTo(centerPoint);
                    getAddress(centerPoint);
                });
                getAddress(addEventMarker.getPosition());
                map.panTo(position);
            }

            //Geocoder function to take latitude and longitude and get formatted address
            function getAddress(centerPoint) {
                var lat, lng, address;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({'latLng': centerPoint}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        lat = centerPoint.lat();
                        lng = centerPoint.lng();
                        address = results[0].formatted_address;
                        $scope.address = address;
                        alert("Latitude: " + lat + "\nLongitude: " + lng + "\nAddress: " + address);
                    }
                });
            }


            //Listen on the DOM... when window loads, initalize the map
            google.maps.event.addDomListener(window, 'load', initialize);

        };
        //Return the map and set the css id selector to #gmaps.
        //Don't know what restrict and replace are doing here. Something DOM related
        return {
            //restrict: 'A',
            //this... (div id "gmaps) is what needs to be called for the CSS.
            template: '<div id="gmaps"></div>',
            //replace: true,
            link: link
        };
    }]);
