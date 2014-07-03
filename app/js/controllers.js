'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality - Handles requests to API
app_controllers.controller('MenuCtrl', ['$rootScope', 'neo4jREST' , function($rootScope, neo4jREST) {

    $rootScope.loading = false;
    // Model variable for current cypher query
    // $rootScope.querystring = { value:"start n = node:points_hk('withinDistance:[22.280893, 114.173035,1.0]') return n"};
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
    
    // Model variables for visualization
    $scope.tracingTemplate = 'tweet_node';
    
    // Timer Functionality
    $scope.time =0;
    $scope.startTime = 0;
    $scope.endTime = 240000;
    
    var timer = null;
    var stop;
    $scope.resetInterval = function(){
       $interval.cancel(timer);
        $scope.time=0;
    }
    
    $scope.startInterval = function(){
    console.log( $scope.time);
    timer = $interval(function(){
        $scope.time=  parseInt($scope.time)+1;
        $scope.updateSlider();
        }, 1);
    }
    
    $scope.stopInterval = function(){
        $interval.cancel(timer);
    }
	
    $scope.updateSlider = function() {
        var timePercentage =  (($scope.time - $scope.startTime)/($scope.endTime - $scope.startTime)*100)+"%"
        $scope.sliderStyle = { 'margin-left' :timePercentage};
    };
	
    
  }]);