'use strict';

/* Directives */


var app_directives = angular.module('visualizeApp.directives', []);//.

// ngWebgl is a directive that updates the visualization in response to events
// scope.$on('queryresult'... is the main callback it responds to
app_directives.directive('ngWebgl', function (neo4jREST) {
    return {
      restrict: 'A',
      scope: { 
        'materialType': '=',
        'tracingTemplate': '='
      },
        link: function (scope, element, attrs) {
            // Class to handle all threeJS scene transactions
            var env = new THREE.Env( );

            // When a the API returns a populated JSON result, this function gets called
            scope.$on('neo4j_result', function(event, result) {
                 result.keyframes.forEach(function(keyframe){
                    keyframe.queries.forEach(function(query){
                    
                        env.add_tracing(query, keyframe.start, keyframe.duration);
                       
                    });
                });
             });
         
        }
    }
});