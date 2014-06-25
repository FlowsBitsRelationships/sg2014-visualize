'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality
app_controllers.controller('MenuCtrl', ['$rootScope', 'neo4jREST' , function($rootScope, neo4jREST) {

    
    // Variable for current cypher query
    $rootScope.querystring = { value:"start n = node:points_hk('withinDistance:[22.280893, 114.173035,1.0]') return n"};
    
    // Uses neo4jREST service to make a post request to the sinatra application
    // sends the current  $rootScope.querystring value as a 'querystring' parameter
    $rootScope.query = function(){
        neo4jREST.cypher({ querystring :  $rootScope.querystring.value})
        .$promise.then(function (result) {
            console.log("broadcast!");
           $rootScope.$broadcast('queryresult', result);
        });
    }
        
}]);
  
// InteractionCtrl is a controller for managing all Interaction frame functionality
app_controllers.controller('InteractionCtrl', ['$scope',  'threeService', function($scope, threeService) {

    threeService.clear_scene();
    
}]);
  
// TemporalCtrl is a controller for managing all Temporal frame functionality
app_controllers.controller('TemporalCtrl', ['$scope',  'threeService', function($scope, threeService) {
   
    threeService.clear_scene();
    
}]);
  
// SpatialCtrl is a controller for managing all Spatial frame functionality
app_controllers.controller('SpatialCtrl', ['$scope',  'threeService', function($scope, threeService, neo4jREST) {
   
    
    // Loads the appropriate tracing_template for visualizing a given tracing
    threeService.set_tracing_template("tweet_node");
    
     // When data is received by $rootScope.query, it is broadcast to the controllers
     // SpatialCtrl calls this function when it receives $rootScope.query's broadcast
    $scope.$on('queryresult', function(event, result) {
        threeService.clear_scene();
        threeService.add_tracing(result);
    });
    
}]);
