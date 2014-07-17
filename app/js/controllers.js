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

        console.log($scope.bbox);

        env.clear_scene();
        env.add_context($scope.bbox, 30, 30, function() {
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

        $scope.status = "loading";

        visAPI.neo4j.save({
            json: vis_config
        }).$promise.then(function(result) {
            env.add_tracings(result, $scope, function() {   // how do i pass the scope variable here
     
// console.log(result);


//- we should change this in the API to make the data response cleaner
var baseData=result.keyframes[0].queries[0].queryresult.data;

function parseTwitterDate(text) {
    return new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
}

var rawObjects = [];
for (var i=0;i<baseData.length;i++){
    var time = baseData[i][0].data.time;
    var epochTime = parseTwitterDate(time);
    var nodeID = baseData[i][0].self.split("/")[baseData[i][0].self.split("/").length-1];
    var object = {
        id:nodeID,
        epoch:epochTime.getTime()/1000
    }
    rawObjects.push(object);
}
console.log(rawObjects);

// scott's deep clone trick
var sortObjects = JSON.parse(JSON.stringify(rawObjects));

// sort the array by the epoch element here
sortObjects.sort(function(a,b) {return a.epoch - b.epoch});

console.log(sortObjects);


// now that we have the sorted epoch times and node ids, we can bin into hours

var minTime=sortObjects[0].epoch;
var maxTime=sortObjects[sortObjects.length-1].epoch;

var binStep=3600*24;  // should be global var - set binning timestep in seconds - adjustable

console.log(minTime);
console.log(maxTime);
console.log(binStep);

// I can probably readjust the scope timeline variables here
    $scope.time =minTime;
    $scope.startTime = minTime;
    $scope.endTime = Math.floor((maxTime-minTime)/binStep)*binStep+minTime;
    
    /*$scope.time=0;
    $scope.startTime=0;
    $scope.endTime=maxTime-minTime;*/
    
    $scope.step = binStep;


    /*
    $scope.time =0;
    $scope.startTime = 0;
    $scope.endTime = 240000;
    
    $scope.step = 1000;
    */


/*
var test =  $scope.get_endTime();
console.log(test);
*/

/*
$scope.Timer.resetTimer;

$scope.Timer.time=minTime

  $scope.time =minTime;
    $scope.startTime = minTime;
    $scope.endTime = maxTime;
    
    $scope.step = binStep;
*/
  
        



var binnedObjects=[];

for (var j=0;j<(maxTime-minTime)/binStep;j++){
    
    console.log(j);
    
    var binCollect=[];
    
    for (var k=0;k<sortObjects.length;k++){
    
        if (sortObjects[k].epoch<(binStep*(j+1))+minTime && sortObjects[k].epoch>=(binStep*j)+minTime){
            binCollect.push(sortObjects[k]);
        }
    
    }
    
    binnedObjects.push(binCollect);
    
}

console.log(binnedObjects);


result.keyframes[0].viz_config={
     configType:["sphere","point"],
     configColR:[255,255],
     configColG:[255,195],
     configColB:[255,100],
     configSize:[600,150],
     configTime :[false,true]
}

result.keyframes[0].time=binnedObjects;

console.log(result.keyframes);

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
    $rootScope.template = "generic";
    
    $scope.list = [{
      "id": 1,
      "label": "Supermarket",
      "items": []
    }, {
      "id": 2,
      "label": "Suburb",
      "items": [{
        "id": 21,
        "label": "Tweets",
        "items": [{
          "id": 211,
          "label": "Users",
          "items": []
        }],
      }],
    }, {
      "id": 3,
      "label": "City",
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
                if ( (next_key in  $rootScope.node_rels[key]) ){
                    return $rootScope.node_rels[key][next_key]
                }
                
                }
            }
            else {
                return "–->"
            }
        } // Should I return empty strings or nulls if the rel doesn't exist?

    $rootScope.run = function() {
        $rootScope.$broadcast('run', $rootScope.vis_config);
    }
    
    $rootScope.make_query = function(item){
        var root_id = parseInt(item.id.toString()[0]-1);
        $rootScope.get_query_pieces($scope.list[root_id], []);
    }
    // TODO: add type as well, and then access this in add_query
    $rootScope.get_query_pieces = function(item, array){
        if (item.label){
            array.push({label: item.label});
        }else{
            array.push({label: "*"}) // If no node is defined, match all nodes
        }
        
         if (item.items) {
             if (item.items.length >0){
                 array.push($rootScope.get_query_pieces( item.items[0], array ));
             }
         }

        $rootScope.add_query(array);

    }
    
    // Generate a query from the UI query_pieces
    $rootScope.add_query = function(query_pieces) {
    
    // console.log(query_pieces);
    // Generate query
     if (query_pieces.length==1){
    
         var a = query_pieces[0].label;
          var query = String.format("START a=node(*) WHERE (a:{0}) RETURN a LIMIT 100", a);
    
    }else{
        var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        var return_ids = ['path', 'a'];
    
        var a = query_pieces[0].label;
        var query = String.format("START a=node(*) WHERE (a:{0}) MATCH path = a ", a);
    
        for (var i = 1; i < query_pieces.length-1; i++) {
    
            var rel = $rootScope.get_relationship(query_pieces[i].label);
            var id = alphabet[i];
            var b = query_pieces[i].label;
    
            return_ids.push(id);
            query += String.format(" {0} {1}  WHERE ({1}:{2})", rel, id, b);
        }
        query += (" RETURN [" + return_ids.join(",") + "]");
    }
        
    // console.log(query);

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
        // console.log(item);
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
    
    
}

    
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
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