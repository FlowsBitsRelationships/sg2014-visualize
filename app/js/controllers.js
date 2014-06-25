'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality
app_controllers.controller('MenuCtrl', ['$rootScope', 'neo4jREST' , function($rootScope, neo4jREST) {

    
    // Model variable for current cypher query
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

// MenuCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', function ($scope) {
    
    // Model variables for visualization
    $scope.materialType = 'wireframe1';
    $scope.tracingTemplate = 'tweet_node';
    
  }]);