'use strict';

/* Services */

var services = angular.module('visualizeApp.services', [])

// Service for querying neo4j
services.factory('neo4jREST', ['$resource', function($resource) {
   return $resource("/neo4jGET",  { filename: '@filename', testjson: '@testjson' });
    }]);

// Service for querying mapquest elevation api
services.factory('elevationService', ['$resource', function($resource) {
   return $resource("/elevation",  { latLngCollection: '@latLngCollection' });
    }]);