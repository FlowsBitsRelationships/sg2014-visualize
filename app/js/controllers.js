'use strict';

/* Controllers */

angular.module('visualizeApp.controllers', [])
  .controller('MenuCtrl', ['$scope', 'neo4jREST' , function($scope, neo4jREST) {
        
        $scope.query = function(){
            var foo = neo4jREST.get();
            console.log(foo)
        }
  }])
  .controller('InteractionCtrl', ['$scope',  'threeService', function($scope, threeService) {
    threeService.clear_scene();
  }])
  .controller('TemporalCtrl', ['$scope',  'threeService', function($scope, threeService) {
        threeService.clear_scene();
  }])
  .controller('SpatialCtrl', ['$scope',  'threeService', function($scope, threeService, neo4jService) {
        // FIXME: MenuCtrl and neo4jREST service need to replace this code for loading data 
        // Need to work out how to only update the currently active controller (the angular way) 
        // when a query is executed from the menu
        threeService.clear_scene();
        
        threeService.set_frame("spatial");
        var query = $("#query").val();
        
        threeService.set_tracing_template("tweet_node");
        
        neo4jService.cypher_neo4j(query, function(json){ 
            threeService.add_tracing(json);
        });
    
  }]);
