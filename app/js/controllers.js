'use strict';

/* Controllers */

var app_controllers = angular.module('visualizeApp.controllers', [])

// MenuCtrl is a controller for managing all Menu functionality - Handles requests to API
app_controllers.controller('MenuCtrl', ['$rootScope', 'visAPI', function($rootScope, visAPI) {
    
    // Model variable for test json
    $rootScope.testjson = JSON.stringify(

    {
        "description": "This is Kowloon...",
        "start": 1000,
        "duration": 5000,
        "queries": [{
            "querystring": " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
            "tracing_template_name": "place_node_slick",
            "tracing_name": "Kowloon"
        }]
    }

    , undefined, 2);

    // Uses visAPI service to make get the vis_config, then to get the neo4j data
    $rootScope.get_from_neo4j = function(filename_req, json_req) {

        $rootScope.status = "loading";

        visAPI.vis_config.save({
            filename: filename_req,
            json: json_req
        }).$promise.then(function(result) {

            $rootScope.$broadcast('vis_config_result', result);

            visAPI.neo4j.save({
                json: result
            }).$promise.then(function(result) {
                $rootScope.$broadcast('neo4j_result', result);
            });
        });
    }

}]);


app_controllers.controller('MapCtrl', ['$rootScope', 'visAPI', function($rootScope, visAPI) {


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

    {
        "description": "This is Kowloon...",
        "start": 1000,
        "duration": 5000,
        "queries": [{
            "querystring": " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
            "tracing_template_name": "place_node_slick",
            "tracing_name": "Kowloon"
        }]
    }

    , undefined, 2);

    // Uses visAPI service to make get the vis_config, then to get the neo4j data
    $rootScope.get_from_neo4j = function(filename_req, json_req) {

        $rootScope.status = "loading";

        visAPI.vis_config.save({
            filename: filename_req,
            json: json_req
        }).$promise.then(function(result) {

            $rootScope.$broadcast('vis_config_result', result);

            visAPI.neo4j.save({
                json: result
            }).$promise.then(function(result) {
                $rootScope.$broadcast('neo4j_result', result);
            });
        });
    }

}]);

app_controllers.controller('SearchCtrl_deprecated', ['$rootScope', function($rootScope) {

//     $rootScope.status_search = "ready";

//     $rootScope.vis_config = {
//         "title": "SG2014 Sample Visualization",
//         "author": "Capt. James T. Kirk",
//         "keyframes": []
//     };

//     $rootScope.start = 0;
//     $rootScope.duration = 5000;
//     $rootScope.template = "generic";

//     $rootScope.query_pieces = [{
//         type: "Place",
//         label: "City"
//     }];

//     $rootScope.node_types = ["Place", "Users", "Tweets", "Traffic"];

//     $rootScope.node_rels = {
//         "Place": {
//             "Users": "",
//             "Tweets": "<– [ : MENTIONED ] -"
//         },
//         "Users": {
//             "Place": "",
//             "Tweets": "– [ : TWEETED ] ->"
//         },
//         "Tweets": {
//             "Place": "– [ : MENTIONED ] ->",
//             "Users": "<– [ : TWEETED ] -"
//         },
//         "Traffic": {
//             "Traffic": "–->"
//         }
//     };

//     $rootScope.node_labels = {
//         "Place": ["City", "Suburb", "Mall", "Supermarket"],
//         "Users": ["TwitterUsers", "FoursquareUsers"],
//         "Tweets": ["Social"],
//         "Traffic": ["Traffic"]
//     };

//     $rootScope.get_relationship = function(i) {
//         if (i < $rootScope.query_pieces.length - 1) {
//             var key = $rootScope.query_pieces[i].type;
//             var next_key = $rootScope.query_pieces[i + 1].type;
//             console.log($rootScope.node_rels[key][next_key]);
//             return $rootScope.node_rels[key][next_key]
//         }
//         else {
//             return ""
//         }
//     }

//     $rootScope.addItem = function() {
//         $rootScope.query_pieces[i]
//     }

//     $rootScope.run = function() {
//         $rootScope.$broadcast('run', $rootScope.vis_config);
//     }

//     // Generate a query from the UI query_pieces
//     $rootScope.add = function(query_pieces) {

// if (query_pieces.length==1){
    
//      var a = query_pieces[0].label;
//           var query = String.format("START a=node(*) WHERE (a:{0}) RETURN a LIMIT 100", a);
    
// }else{
//     var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
//         var return_ids = ['path', 'a'];

//         var a = query_pieces[0].label;
//         var query = String.format("START a=node(*) WHERE (a:{0}) MATCH path = a ", a);

//         for (var i = 1; i < query_pieces.length; i++) {

//             var rel = $rootScope.get_relationship(i - 1);
//             var id = alphabet[i];
//             var b = query_pieces[i].label;

//             return_ids.push(id);
//             query += String.format(" {0} {1}  WHERE ({1}:{2})", rel, id, b);
//         }
//         query += (" RETURN [" + return_ids.join(",") + "]");
// }

// console.log(query);

//         // TODO: Right now, name is just the query 
//         // .... provide a better way of generating descriptive name
//         var name = query;

//         var keyframe = {
//             "description": "Test Query Displaying",
//             "start": $rootScope.start,
//             "duration": $rootScope.duration,
//             "queries": [{
//                 "querystring": query,
//                 "tracing_template_name": $rootScope.template,
//                 "tracing_name": name
//             }]
//         }
//         $rootScope.start += $rootScope.duration
//         $rootScope.vis_config["keyframes"].push(keyframe);
//     }

//     if (!String.format) {
//         String.format = function(format) {
//             var args = Array.prototype.slice.call(arguments, 1);
//             return format.replace(/{(\d+)}/g, function(match, number) {
//                 return typeof args[number] != 'undefined' ? args[number] : match;
//             });
//         };
//     }

}]);


// AppCtrl is a controller for managing visualization functionality
app_controllers.controller('AppCtrl', ['$scope', '$interval', '$q', 'visAPI', function($scope, $interval, $q, visAPI) {

    
    keyDrag($scope);

    $scope.bbox = [114.16, 22.30, 114.20, 22.36];



    // function to generate OSM geometry based on the currently set bounding box    
    $scope.generateContext = function() {

 document.getElementById('loadingText').innerText="loading geometry...";
document.getElementById('spinner').style.display="block";

        console.log($scope.bbox);

        env.clear_scene();
        env.add_context($scope.bbox, 30, 30, function() {
            
           
            
             document.getElementById('spinner').style.display="none";
            
            deferred_context.resolve({
                status: "OK",
                data: ''
            });
        })

    }

    var
    deferred_neo4J = $q.defer(),
        deferred_context = $q.defer(),

        env = new THREE.Env(); // Class for managing ThreeJS interaction

    $scope.description = "";
    //  $scope.description = "[ Hit run to begin trying things out! ]";
    $scope.status = "ready";

    // Triggered when neo4j_result is returned (must be blocking, as it contains bbox and other config info)
    $scope.$on('vis_config_result', function(event, result) {
        // Reset scene
        //     env.clear_scene();
        //    env.add_context( result.bbox , 30, 30, function(){deferred_context.resolve({ status: "OK", data: result});} );
    });

    // $scope.$on('neo4j_result', function(event, result) {   
    //     deferred_neo4J.resolve({ status: "OK", data: result});
    //  });

    $scope.$on('run', function(event, vis_config) {
        console.log("RUNNING!");

 document.getElementById('loadingText').innerText="loading data...";
document.getElementById('spinner').style.display="block";

        $scope.status = "loading";

        visAPI.neo4j.save({
            json: vis_config
        }).$promise.then(function(result) {
            env.add_tracings(result, $scope, function() {   // how do i pass the scope variable here
     
            console.log(result);

                $scope.begin_keyframes(result.keyframes); // Start!

            });
        });
    });

    // When all promises are resolved 
    $q.all({
        first: deferred_neo4J.promise,
        second: deferred_context.promise
    }).then(function(results) {

        $scope.status = "neo4j : " + results.first.status + " | context : " + results.second.status;

        // Reset promises (is there a better way to do this?):
        deferred_neo4J = $q.defer();
        deferred_context = $q.defer();

        env.add_tracings(results.first.data, function() {

            $scope.begin_keyframes(results.first.data.keyframes); // Start!

        });


    });


  $scope.update_callback = function(current_state) {

            env.update_state(current_state);
 
           var tick = ($scope.time-$scope.startTime)/$scope.step;
        
            for (var i=0;i<viewObjects.length;i++){
                
                if (viewObjects[i].time == tick){
                    viewObjects[i].visible=true;
                }else{
                      viewObjects[i].visible=false;
                }
                
            }
            

        }

    // Starts visualization
    $scope.begin_keyframes = function(keyframes) {


      

        var timer = new Timer($scope, $interval, function() {
            env.clear_traces();
        }, $scope.update_callback); // Class for timing visualization



        // Callback called by Timer when a keyframe occurs
        /*  var keyframe_callback = function ( keyframe ) {
            console.log(keyframe);
            $scope.description = "[ "+keyframe.description+" ]";
             keyframe.queries.forEach(function(query){
                 env.show_tracings(query);
               // env.add_tracing(query, keyframe.duration);
            });
        } */


console.log('trace down');
console.log(keyframes);

        timer.start(keyframes); // Run visualization
        
        
    }

}]);

app_controllers.controller('SearchCtrl', ['$scope', '$rootScope', '$http', 'limitToFilter',  function($scope, $rootScope, $http, limitToFilter) {
    
    $rootScope.status_search = "ready";
    
    $rootScope.vis_config = {
        "title": "SG2014 Sample Visualization",
        "author": "Capt. James T. Kirk",
        "keyframes": []
    };

    $rootScope.start = 0;
    $rootScope.duration = 5000;
    $rootScope.template = "cleaner";
    
    // *** ACTUAL SCOPE.LIST ***
    // $scope.list = [{
    //   "id": 1,
    //   "label": "Supermarket",
    //   "items": []
    // }, {
    //   "id": 2,
    //   "label": "Suburb",
    //   "items": [{
    //     "id": 21,
    //     "label": "Tweets",
    //     "items": [{
    //       "id": 211,
    //       "label": "Users",
    //       "items": []
    //     }],
    //   }],
    // }, {
    //   "id": 3,
    //   "label": "City",
    //   "items": []
    // }];
    
    // *** PRESENTATION SCOPE.LIST ***
    $scope.list = [{
      "id": 1,
      "label": "Mentioned Regions",
      "query": "START a=node(*) WHERE (a:Suburb) MATCH path = a  <– [ : MENTIONED ] - b  WHERE (b:Social) RETURN [path,a,b] LIMIT 1000",
      "qconfig": {configKeyframeID : 1, 
                configType : ["sphere","point"], 
                configNode : ["Suburb","Twitter"] , 
                configColR : [255,255] , 
                configColG : [255,195] , 
                configColB : [255,100], 
                configSize : [600,150]},
      "items": [{
          "id": 11,
          "label": "Unmentionables",
           "query":  'MATCH (t:Tweets) WHERE t.content=~".*dinner.*" OR t.content=~".*food.*" OR t.content=~".*restaurant.*" OR t.content=~".*delicious.*" OR t.content=~".*yum.*" OR t.content=~".*dim sum.*" OR t.content=~".*noodle.*" OR t.content=~".*congee.*" OR t.content=~".*dumpling.*" OR t.content=~".*canteen.*" OR t.content=~".*餐廳.*" OR t.content=~".*飯堂.*" OR t.content=~".*野食.*" OR t.content=~".*餸.*" OR t.content=~".*好味.*" OR t.content=~".*好食.*" OR t.content=~".*飲茶.*" OR t.content=~".*西餐.*" OR t.content=~".*中餐.*" OR t.content=~".*茶餐廳.*" OR t.content=~".*大排檔.*" OR t.content=~".*掃街.*"  RETURN DISTINCT t LIMIT 1000',
          "qconfig": {configKeyframeID : 1, 
                    configType : ["sphere","point"], 
                    configNode : ["Suburb","Twitter"] , 
                    configColR : [255,255] , 
                    configColG : [255,195] , 
                    configColB : [255,100], 
                    configSize : [600,150]},
           
          "items": []
        }]
    }, {
      "id": 2,
      "label": "Confetti",
       "query":  "MATCH (n) RETURN n LIMIT 250",
      "qconfig": {configKeyframeID : 1, 
                configType : ["sphere","point"], 
                configNode : ["Suburb","Twitter"] , 
                configColR : [255,255] , 
                configColG : [255,195] , 
                configColB : [255,100], 
                configSize : [600,150]},
      "items": [{
        "id": 21,
        "label": "Confetti2",
         "query":  "MATCH (n) RETURN n LIMIT 350",
         "qconfig": {configKeyframeID : 1, 
                configType : ["sphere","point"], 
                configNode : ["Suburb","Twitter"] , 
                configColR : [255,255] , 
                configColG : [255,195] , 
                configColB : [255,100], 
                configSize : [600,150]},
        "items": [],
      }],
    }, {
      "id": 3,
      "label": "Routes",
      "query":  "MATCH (n) RETURN n LIMIT 450",
      "qconfig": {configKeyframeID : 1, 
                configType : ["sphere","point"], 
                configNode : ["Suburb","Twitter"] , 
                configColR : [255,255] , 
                configColG : [255,195] , 
                configColB : [255,100], 
                configSize : [600,150]},
      "items": []
    }];
    
    $rootScope.query_pieces = [{
        type: "Place",
        label: "City"
    }];
    
    // TODO - Get from neo4j and store statically
    $rootScope.node_types = ["Place", "Users", "Tweets", "Traffic"];
    
    $scope.selectedItem = {}; // TODO: 

    $scope.options = {}; // TODO: Pass object params
    
    // TODO - Get from neo4j and store statically
    $rootScope.node_rels = {
        "Place": {
            "Users": "",
            "Tweets": "<– [ : MENTIONED ] -"
        },
        "Users": {
            "Place": "",
            "Tweets": "– [ : TWEETED ] ->"
        },
        "Tweets": {
            "Place": "– [ : MENTIONED ] ->",
            "Users": "<– [ : TWEETED ] -"
        },
        "Traffic": {
            "Traffic": "–->"
        }
    };

    $rootScope.get_relationship = function(item) {
        var key = item.label;
        if (item.items && $rootScope.node_rels[key] ) {
            if (item.items.length>0) {
                var next_key = item.items[0].label;
                if ( !(next_key in  $rootScope.node_rels[key]) ){
                    return ""
                }
                else {
                    return $rootScope.node_rels[key][next_key]
                }
            }
        } // Should I return empty strings or nulls if the rel doesn't exist?
    }
    
    // TEMPORARILY COMMENTED OUT FOR DEMO
    // $rootScope.run = function() {
    //     $rootScope.$broadcast('run', $rootScope.vis_config);
    // }
    
    // FOR PRESENTATION
    
        // var configKeyframeID = 1;
        // var configType = ["sphere","point"];
        // var configNode = ["Suburb","Twitter"];
        // var configColR = [255,255];
        // var configColG = [255,195];
        // var configColB = [255,100];
        // var configSize = [600,150];
        

    
    $rootScope.run = function(query, qconfig) {
        // console.log(query);
         var keyframe = {
        "description": "Test Query Displaying",
        "start": $rootScope.start,
        "duration": $rootScope.duration,
        "qconfig": qconfig,
        "queries": [{
            "querystring": query,
            "tracing_template_name": $rootScope.template,
            "tracing_name": name
        }]
        }
        
        $rootScope.vis_config["keyframes"].push(keyframe);
        $rootScope.$broadcast('run', $rootScope.vis_config);
        
        $rootScope.menu_open=false;
    
        
        console.log($rootScope.menu_open);
        
    }
    
    $rootScope.get_nodes = function(item, array, callback){
        console.log(item.label)
        array.push(item.label)
         if (item.items) {
             if (item.items.length >0){
                 array.push(get_nodes( item.items[0], array, callback ));
             }
         }
         else{
           callback.call(this, array)  ;
         }
    }
    
    // Generate a query from the UI query_pieces
    $rootScope.add_query = function(query_pieces) {
    
    console.log(query_pieces);
    // Generate query
     if (query_pieces.length==1){
    
         var a = query_pieces[0].label;
          var query = String.format("START a=node(*) WHERE (a:{0}) RETURN a LIMIT 100", a);
    
    }else{
        var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        var return_ids = ['path', 'a'];
    
        var a = query_pieces[0].label;
        var query = String.format("START a=node(*) WHERE (a:{0}) MATCH path = a ", a);
    
        for (var i = 1; i < query_pieces.length; i++) {
    
            var rel = $rootScope.get_relationship(i - 1);
            var id = alphabet[i];
            var b = query_pieces[i].label;
    
            return_ids.push(id);
            query += String.format(" {0} {1}  WHERE ({1}:{2})", rel, id, b);
        }
        query += (" RETURN [" + return_ids.join(",") + "]");
    }
        
    console.log(query);

    // TODO: Right now, name is just the query 
    // .... provide a better way of generating descriptive name
    var name = query;

    var keyframe = {
        "description": "Test Query Displaying",
        "start": $rootScope.start,
        "duration": $rootScope.duration,
        "queries": [{
            "querystring": query,
            "tracing_template_name": $rootScope.template,
            "tracing_name": name
        }]
        }
        $rootScope.start += $rootScope.duration
        $rootScope.vis_config["keyframes"].push(keyframe);
    }
    

    
     // TODO: Remove query in real time when it is removed from UI
    $rootScope.remove_query = function(params) {
        
    }
    
    // BEGIN UI-TREE
    
    $scope.is_first = function(item){
        console.log(item);
        return item.id.toString().length<2;
    }
    
    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };
    
    
    // Syntactic sugar....
    Array.prototype.getUnique = function(){
       var u = {}, a = [];
       for(var i = 0, l = this.length; i < l; ++i){
          if(u.hasOwnProperty(this[i])) {
             continue;
          }
          a.push(this[i]);
          u[this[i]] = 1;
       }
       return a;
    }
    
   var flatten = function(arr) {
    return arr.reduce(function flatten(res, a) { 
        Array.isArray(a) ? a.reduce(flatten, res) : res.push(a);
        return res;
    }, []);
    
    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
    
    
}
    
  //http://www.geobytes.com/free-ajax-cities-jsonp-api.htm

  $scope.labels = function(labelName) {
    // TODO: Create a sinatra regex search function for labels and get the labels dynamically from a cypher query
    // Pass an argument to regex only the relevant ones
    return $http.get("/public/labels.json").then(function(response){
        
        

        var flatter= response.data.data.reduce(function(a, b){
            return a.concat(b);
        });
        var flattened= flatter.reduce(function(a, b){
            return a.concat(b);
        });
        var uniq = flattened.getUnique();


      return limitToFilter(uniq, 10);
    });
  };
  
  }]);