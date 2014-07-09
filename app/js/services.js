'use strict';

/* Services */

var services = angular.module('visualizeApp.services', [])

// Service for querying neo4j
services.factory('neo4jREST', ['$resource', function($resource) {
   return  {
        vis_config: $resource("/vis_config"),
        neo4j: $resource("/neo4j")
    };
}]);

// Service for querying mapquest elevation api
services.factory('elevationService', ['$resource', function($resource) {
   return $resource("/elevation",  { latLngCollection: '@latLngCollection' });
}]);