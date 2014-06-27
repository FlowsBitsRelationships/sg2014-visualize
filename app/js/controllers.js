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
app_controllers.controller('AppCtrl', ['$scope', function ($scope) {
    
    // Model variables for visualization
    $scope.materialType = 'wireframe';
    $scope.tracingTemplate = 'tweet_node';
    
  }]);