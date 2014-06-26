'use strict';

/* Services */

var services = angular.module('visualizeApp.services', [])

// Service for Querying Neo4j
services.factory('neo4jREST', ['$resource', function($resource) {
   return $resource("/cypher",  
        { querystring: '@querystring' },
       {
          cypher: {method:'post', params:{ querystring: '@querystring' } }
       });
    }]);
    
services.factory('vis_config', ['$resource', function($resource) {
   return $resource("/vis_config",  { filename: '@filename' });
    }]);