'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality - Handles requests to API
app_controllers.controller('MenuCtrl', ['$rootScope', 'neo4jREST' , function($rootScope, neo4jREST) {
    
    $rootScope.loading = false;
    $rootScope.vis_config = "kowloon_vis_config";
    // Model variable for test json
   $rootScope.testjson = JSON.stringify(
        
         {"description": "Show Kowloon",
        "start": 1000,
        "duration": 5000,
        "queries": [
             {"querystring" : " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
                "tracing_template_name" : "place_node",
                "tracing_name": "Kowloon"}
            ]
        }

        , undefined, 2);

    // Uses neo4jREST service to make a get request to the sinatra application
    $rootScope.get_from_neo4j = function(filename_req, testjson_req){
    
        $rootScope.loading = true;
        neo4jREST.get({ filename : filename_req , testjson: testjson_req })
        .$promise.then(function (result) {
           $rootScope.$broadcast('neo4j_result', result);
           // $rootScope.loading = false;
        });
    }
    
}]);

// AppCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval',  'elevationService', function ($scope, $interval, elevationService) {
     
    var env = new THREE.Env( ); // Class for managing ThreeJS interaction
    var timer = new Timer($scope, $interval); // Class for timing visualization
    $scope.time =0;
    $scope.startTime = 0;
    $scope.endTime = 240000;
    
    // Elevation demo - Started implementing this, then realized it belonged on the backend
    // var set_elevation = function (result){
        // var heights = [];
        // for (var key in result.elevationProfile){
           // heights.push(result.elevationProfile[key]["height"]);
        // }
        // console.log(heights);
    // }
    // var latLngs = [39.74012,-104.9849,39.7995,-105.7237,39.6404,-106.3736]
    // elevationService.get({latLngCollection: latLngs.join(",")}).$promise.then(set_elevation);
    
    // Triggered when neo4j_result is returned
    $scope.$on('neo4j_result', function(event, result) {
    
        // Reset scene, clear keyframes
        env.clear_scene();
        // Generate context buildings and set origin, then call callback:
        env.add_context(result.bbox,  function(){$scope.begin_keyframes(  result.keyframes );} );
        
     });
     
     // Starts visualization
     $scope.begin_keyframes = function( keyframes ){
        
         // Callback called by Timer when a keyframe occurs
         // TODO: Add a separate keyframe for the removal of the objects.
        var keyframe_callback = function ( keyframe ) {
             keyframe.queries.forEach(function(query){
                env.add_tracing(query, keyframe.duration);
            });
        }
        
        $scope.loading = false; // Hide 'loading'' text
        timer.start( keyframes, keyframe_callback );// Run visualization
        
     }
    
  }]);