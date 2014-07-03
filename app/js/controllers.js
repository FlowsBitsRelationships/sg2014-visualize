'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality
app_controllers.controller('MenuCtrl', ['$rootScope', 'neo4jREST' , 'vis_config', function($rootScope, neo4jREST, vis_config) {

    
    // Model variable for current cypher query
    $rootScope.querystring = { value:"start n = node:points_hk('withinDistance:[22.280893, 114.173035,1.0]') return n"};
    
    // Uses neo4jREST service to make a post request to the sinatra application
    // sends the current  $rootScope.querystring value as a 'querystring' parameter
    // TODO: FIXME: Is this still needed? Doesn't the directive handle this now? 
    $rootScope.query = function(){
        neo4jREST.cypher({ querystring :  $rootScope.querystring.value})
        .$promise.then(function (result) {
           $rootScope.$broadcast('queryresult', result);
        });
    }
   
    $rootScope.get_vis_config = function(){
        vis_config.get()
        .$promise.then(function (result) {
           $rootScope.$broadcast('vis_config_result', result);
        });
    }

}]);

// MenuCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval', function ($scope, $interval) {
    
    // Model variables for visualization
    $scope.vis_config
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