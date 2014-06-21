'use strict';

/* Controllers */

angular.module('visualizeApp.controllers', [])
  .controller('InteractionCtrl', ['$scope',  'threeService', 'neo4jService', function($scope, threeService, neo4jService) {
    threeService.clear_scene();
  }])
  .controller('TemporalCtrl', ['$scope',  'threeService', 'neo4jService', function($scope, threeService, neo4jService) {
        threeService.clear_scene();
  }])
  .controller('SpatialCtrl', ['$scope',  'threeService', 'neo4jService', function($scope, threeService, neo4jService) {
        threeService.clear_scene();
        
        threeService.set_frame("spatial");
        var query = $("#query").val();
        
        threeService.set_tracing_template("tweet_node");
        
        neo4jService.cypher_neo4j(query, function(json){ 
            threeService.add_tracing(json);
        });
    
  }]);
