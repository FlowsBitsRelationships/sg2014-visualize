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
                "tracing_template_name" : "place_node_slick",
                "tracing_name": "Kowloon"}
            ]
        }

        , undefined, 2);

    // Uses visAPI service to make get the vis_config, then to get the neo4j data
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


app_controllers.controller('MapCtrl', ['$rootScope', 'visAPI' , function($rootScope, visAPI) {
  
  
  /*  
     var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
*/

    
    $rootScope.vis_config = "kowloon_vis_config";
    // Model variable for test json
   $rootScope.testjson = JSON.stringify(
        
         {"description": "This is Kowloon...",
        "start": 1000,
        "duration": 5000,
        "queries": [
             {"querystring" : " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
                "tracing_template_name" : "place_node_slick",
                "tracing_name": "Kowloon"}
            ]
        }

        , undefined, 2);

    // Uses visAPI service to make get the vis_config, then to get the neo4j data
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

app_controllers.controller('SearchCtrl', ['$rootScope', function($rootScope) {
    
    $rootScope.status_search = "ready";
    
    $rootScope.search_pieces = [
        { type: "Place", label: "City" }, 
        { type: "Tweets", label: "Social" },
        { type: "Users", label: "TwitterUsers"}
        ];
    
    $rootScope.node_types = 
        [
        "Place",
        "Users",
        "Tweets"
        ];

    $rootScope.node_rels = 
        {
            "Place":{
                "Users" : "",
                "Tweets" : "<– [ : MENTIONED ] - "
            },
            "Users":{
                "Place":"",
                "Tweets": "TWEETED"
            },
            "Tweets":{
                "Place": "MENTIONED",
                "Users": "TWEETED"
            }
        };
        
    $rootScope.node_labels = 
        {
            "Place":[
                "City",
                "Suburb",
                "Mall",
                "Supermarket"
            ],
            "Users":[
                "TwitterUsers",
                "FoursquareUsers"
            ],
            "Tweets":[
                "Social"
            ]
        };
        
     $rootScope.get_relationship = function(i){
         if (i<$rootScope.search_pieces.length-1){
             var key = $rootScope.search_pieces[i].type;
             var next_key = $rootScope.search_pieces[i+1].type;
             return $rootScope.node_rels[key][next_key]
         }
         else{
             return ""
         }
    }
    
    $rootScope.addItem = function(){
         $rootScope.search_pieces[i]
    }
    
    $rootScope.search = function(search_pieces){
        // Make 
        // search_pieces.forEach
        // String.format("MATCH (n:{0}) RETURN DISTINCT n", search_pieces.label);
        // String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
        // Update 
        
    }
    
    if (!String.format) {
      String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number] 
            : match
          ;
        });
      };
    }
    
}]);

// AppCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval', '$q',  function ($scope, $interval, $q, elevationService) {
    
    var         
        deferred_neo4J = $q.defer(),
        deferred_context = $q.defer(),
        
        env = new THREE.Env( ); // Class for managing ThreeJS interaction
        
        $scope.description = "[ Hit run to begin trying things out! ]";
        $scope.status = "ready";
        
    // Triggered when neo4j_result is returned (must be blocking, as it contains bbox and other config info)
    $scope.$on('vis_config_result', function(event, result) {  
        // Reset scene
        env.clear_scene();
        env.add_context( result.bbox , 30, 30, function(){deferred_context.resolve({ status: "OK", data: result});} );
    });
    
    $scope.$on('neo4j_result', function(event, result) {   
        deferred_neo4J.resolve({ status: "OK", data: result});
     });;

    // When all promises are resolved 
    $q.all({ first: deferred_neo4J.promise , second: deferred_context.promise })
      .then(function(results) {
      
        $scope.status = "neo4j : "+results.first.status+" | context : "+results.second.status;
        
        // Reset promises (is there a better way to do this?):
        deferred_neo4J = $q.defer();
        deferred_context = $q.defer();
        
        env.add_tracings(results.first.data,function(){
            
            $scope.begin_keyframes(  results.first.data.keyframes );  // Start!
            
        });
        

      });
          
     // Starts visualization
     $scope.begin_keyframes = function( keyframes ){
     
             
        var update_callback = function( current_state ) {
            
            env.update_state(current_state);
            
        }
     
        var timer = new Timer($scope, $interval, function(){ env.clear_traces();},update_callback); // Class for timing visualization
         
         // Callback called by Timer when a keyframe occurs
      /*  var keyframe_callback = function ( keyframe ) {
            console.log(keyframe);
            $scope.description = "[ "+keyframe.description+" ]";
             keyframe.queries.forEach(function(query){
                 env.show_tracings(query);
               // env.add_tracing(query, keyframe.duration);
            });
        } */

        
        
        timer.start( keyframes );// Run visualization
     }
      
  }]);