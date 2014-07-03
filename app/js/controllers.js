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
           $rootScope.loading = false;
        });
    }
    
}]);

// AppCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval', function ($scope, $interval) {
    
    // Class for managing ThreeJS interaction
     var env = new THREE.Env( );
    
    var keyframe_hash = {};
    
    // Triggered when neo4j_result is returned
    $scope.$on('neo4j_result', function(event, result) {
    
        // Reset
        env.clear_scene();
        keyframe_hash = {};
        $scope.endTime = 0;
        
        // Generate a hash that timer can call as needed to trigger events
         result.keyframes.forEach(function(keyframe){
            keyframe_hash[keyframe.start] = keyframe;
        });
  
        // Initialize timer  
        $scope.endTime = $scope.get_endTime(keyframe_hash);
        $scope.resetInterval();
        $scope.startInterval();
     });
     
     // Utility function that sends a keyframe to env 
     $scope.execute_keyframe = function ( keyframe ) {
             keyframe.queries.forEach(function(query){
                env.add_tracing(query, keyframe.duration);
            });
     }
     
    // *****************Timer Functionality****************
    $scope.time =0;
    $scope.startTime = 0;
    $scope.endTime = 240000;
    
    var timer = null;
    
    // Resets timer to beginning
    $scope.resetInterval = function(){
       $interval.cancel(timer);
        $scope.time=0;
        
    }
    
     // Begins/Resumes advancing timer
    $scope.startInterval = function(){
    env.clear_scene();
    timer = $interval(function(){
        // If there is a keyframe set to occur at this time, fire it off
        if ( $scope.time in keyframe_hash ){
            $scope.execute_keyframe(keyframe_hash[$scope.time]);
        }
        var next_time = parseInt($scope.time)+10;
        // If there is time remaining, update
        if (next_time < $scope.endTime+1){
            $scope.time =  parseInt($scope.time)+10;
            $scope.updateSlider();
        }
        else{
        $scope.stopInterval();
        env.clear_scene();
        }
        }, 1);
    }
    
    // Pauses timer
    $scope.stopInterval = function(){
        $interval.cancel(timer);
    }
	
    // Updates millisecond readout on timer
    $scope.updateSlider = function() {
        var timePercentage =  (($scope.time - $scope.startTime)/($scope.endTime - $scope.startTime)*100)+"%"
        $scope.sliderStyle = { 'margin-left' :timePercentage};
    };
	
    $scope.get_endTime = function (keyframe_hash){
        var endTime = 0;
        for ( var key in  keyframe_hash){
            var time = keyframe_hash[key].start+keyframe_hash[key].duration;
            if( time > endTime ){ endTime = time;}
        }
        return endTime
    }
    
  }]);