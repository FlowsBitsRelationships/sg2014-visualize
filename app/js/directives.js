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
            
            // When a vis_config returns, the application inserts the database responses
            // for each query. Preloading ensures that the visualization has no timing hiccups.
            // We then loop through the json and add tracings, timed out to fire as specified
            scope.$on('vis_config_result', function(event, result) {
                 result.keyframes.forEach(function(keyframe){
                    keyframe.queries.forEach(function(query){
                        env.add_tracing(query, keyframe.start, keyframe.duration);
                       
                        });
                    });
                 });
            
            // When the user executes a preview query in the UI, this method fires.
            scope.$on('queryresult', function(event, queryresult) {
                var preview_query = {"queryresult": queryresult, "tracing_template_name" : scope.tracingTemplate, "tracing_name":  "preview visualization" }
                env.add_tracing( preview_query, 1000, 5000);
            });         

            // scope.$watch('materialType', function () {
                // env.objects.forEach(function(obj){
                    // obj.material = env.materials[scope.materialType];
                // });
            // });

        }
    }
});