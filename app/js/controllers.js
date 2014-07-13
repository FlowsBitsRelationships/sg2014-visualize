'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality - Handles requests to API
app_controllers.controller('MenuCtrl', ['$rootScope', 'visAPI' , function($rootScope, visAPI) {
    
    $rootScope.vis_config = "kowloon_vis_config";
    // Model variable for test json
   $rootScope.testjson = JSON.stringify(
        
         {"description": "This is Kowloon...",
        "start": 1000,
        "duration": 5000,
        "queries": [
             {"querystring" : " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
                "tracing_template_name" : "place_node",
                "tracing_name": "Kowloon"}
            ]
        }

        , undefined, 2);

    // Uses visAPI service to make a get request to the sinatra application
    $rootScope.get_from_neo4j = function(filename_req, json_req){
    
        $rootScope.status = "loading";
        
        visAPI.vis_config.save({ filename : filename_req , json: json_req })
        .$promise.then(function (result) {
        
           $rootScope.$broadcast('vis_config_result', result);
           
           visAPI.neo4j.save({ json : result }) 
            .$promise.then(function (result) {
                $rootScope.$broadcast('neo4j_result', result);
            });
        });
    }
    
}]);

// AppCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval', '$q',  function ($scope, $interval, $q, elevationService) {
    
    var         
        deferred_neo4J = $q.defer(),
        deferred_osmthree = $q.defer(),
        deferred_terraingen = $q.defer(),
        
        env = new THREE.Env( ), // Class for managing ThreeJS interaction
        timer = new Timer($scope, $interval); // Class for timing visualization
        
        $scope.description = "[ Hit run to begin trying things out! ]";
        $scope.status = "ready";
        
    // Triggered when neo4j_result is returned (must be blocking, as it contains bbox and other config info)
    $scope.$on('vis_config_result', function(event, result) {  
        // Reset scene
        env.clear_scene();
        env.add_buildings( result.bbox, deferred_osmthree );
        env.add_terrain( result.bbox , 50, 50, deferred_terraingen );
    });
    
    $scope.$on('neo4j_result', function(event, result) {   
     console.log(deferred_neo4J);
        deferred_neo4J.resolve({ status: "OK", data: result});
     });;

    // When all promises are resolved 
    $q.all({ first: deferred_neo4J.promise , second: deferred_osmthree.promise, third: deferred_terraingen.promise })
      .then(function(results) {
      
        $scope.status = "neo4j : "+results.first.status+" | osm3 : "+results.second.status+" | mq : "+results.third.status;
        
        // Reset promises (is there a better way to do this?):
        deferred_neo4J = $q.defer();
        deferred_osmthree = $q.defer();
        deferred_terraingen = $q.defer();
        
        $scope.begin_keyframes(  results.first.data.keyframes );  // Start!
      });
          
     // Starts visualization
     $scope.begin_keyframes = function( keyframes ){
         // Callback called by Timer when a keyframe occurs
        var keyframe_callback = function ( keyframe ) {
            $scope.description = "[ "+keyframe.description+" ]";
             keyframe.queries.forEach(function(query){
                env.add_tracing(query, keyframe.duration);
            });
        }
        timer.start( keyframes, keyframe_callback );// Run visualization
     }
      
  }]);