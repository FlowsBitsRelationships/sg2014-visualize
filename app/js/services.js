'use strict';

/* Services */

var services = angular.module('visualizeApp.services', [])

// Service for querying neo4j
services.factory('visAPI', ['$resource', function($resource) {
   return  {
        vis_config: $resource("/vis_config"),
        neo4j: $resource("/neo4j")
    };
}]);