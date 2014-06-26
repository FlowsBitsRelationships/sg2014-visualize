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
            var env = new THREE.Env( );
            
            // loop through keyframes and add_tracings.
            // FIXME: As timing is important, we may want to preload the data...
            scope.$on('vis_config', function(event, result) {
                 result.keyframes.forEach(function(keyframe){
                     // Currently, queries are run sequentially and data is lazy loaded
                    // This may throw off visualization timing. Alternatively, the sinatra application
                    // could run all of the queries at once and return fully loaded JSON .
                    // this would eliminate keyframe timing inaccuracies due to load time but add long wait time at the start
                    keyframe.queries.forEach(function(query){
                         neo4jREST.cypher({ querystring :  query.querystring})
                        .$promise.then(function (queryresult) {
                            
                           env.add_tracing(queryresult, query.tracing_template_name, query.tracing_name, keyframe.start, keyframe.duration);
                       
                        });
                    });
                    
                 });
            });
            
            scope.$on('queryresult', function(event, result) {
                 env.add_tracing(result, scope.tracingTemplate, 'preview visualization', 2000, 5000);
            });         

            // FIXME; These methods to be deprecated in favor of add_tracing
            // scope.$watch('tracingTemplate', function () {
                // env.set_tracing_template(scope.tracingTemplate);
            // });
            
            // scope.$watch('materialType', function () {
                // env.objects.forEach(function(obj){
                    // obj.material = env.materials[scope.materialType];
                // });
            // });
            

        }
    }
});