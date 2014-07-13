var TerrainGen = function(){

    var self = this;
    
    this.origin = new THREE.Vector2( 0, 0 );
    
    this.material = new THREE.MeshBasicMaterial({
            color : 0xffffff,
            opacity : 0.75,
            transparent : true,
            wireframe : true,
            side: THREE.BackSide,
            shading: THREE.FlatShading
        });
    
    this.generate = function(  bbox, x_step, z_step,  promise, scene ){
             
         var min,
            max,
            geometry;
            
        // Get the origin XY coordinates
        self.origin = self.lonLatToScene(bbox[0], bbox[1]);
            
        // Get the bounds XY coordinates    
        min = self.lonLatToScene(bbox[0], bbox[1]);
        max = self.lonLatToScene(bbox[2], bbox[3]);

        geometry = new THREE.PlaneGeometry(max.x, max.y, x_step, z_step);
        
        // Add plane
        plane = new THREE.Mesh( geometry,  this.material );
        plane.visible = true;
        plane.position.x = -max.y/2;
        plane.position.z = -max.x /2;
        plane.rotation.x = -Math.PI / 2;
        plane.rotation.z= -Math.PI / 2;
        
        self.set_Elevations( plane, scene, promise );
    }
    
    //  ******************** Helpers ********************
    
    // Calls the elevation API to get heights of terrain vertices, sets them and adds the object to the scene
    this.set_Elevations = function( plane, scene, promise ){

        var vertex_latLons = [];  

        // Convert all geometry vertices to longitude and latitude
        for (var i = 0; i < plane.geometry.vertices.length; i++) { 
            var lonLat = self.sceneToLonLat(plane.geometry.vertices[i]);
            vertex_latLons.push(lonLat[1],lonLat[0]);
        }
         
         // Call elevation API via sinatra app, modify mesh when heights are returned
         $.when(  $.ajax('/elevation',{
            'data': JSON.stringify({latLngCollection: vertex_latLons.join(",")}), //{action:'x',params:['a','b','c']}
            'type': 'POST',
            'processData': false,
            'contentType': 'application/json' 
            }) )
        .then(function( data, textStatus, jqXHR ) {
            elevationJSON = JSON.parse(data);
            
            elevationJSON = self.lintElevations(elevationJSON, 80);
            
            for (var i = 0; i < plane.geometry.vertices.length; i++) { 
                var elevation = elevationJSON[i];
                plane.geometry.vertices[i].setZ(elevation);
            }
            
            scene.add(plane);
            
            // Cleanup
            self.origin = new THREE.Vector2( 0, 0 );
            promise.resolve( { status: "OK"} );
        })
        .fail(function( data, textStatus, jqXHR ){
            promise.resolve( { status: "failed" } ); // Resolve, but report the failure
        });
        
    }
    // Remove unreasonable outliers and patch up holes in the elevation data
    this.lintElevations = function(elevationJSON, tol){
        var lintedJSON = elevationJSON;
        
       // for (var i = 1; i < elevationJSON.length-1; i++) { 
            // var avg = (elevationJSON[i-1]+elevationJSON[i+1])/2
            // if (elevationJSON[i] - avg > tol){
                // lintedJSON[i] = avg;
            // }
        // } 
        
        return lintedJSON
    }
    
     // Vector2 is transformed by origin and passed to worldToLonLat
    this.sceneToLonLat = function( vector ) {
        var world_vector = new THREE.Vector2( vector.x + self.origin.x,  vector.y + self.origin.y );
        var lonLat = self.worldToLonLat( world_vector )
        return lonLat
    }
    
    // Vector2 is de-projected and converted lon lat
    this.worldToLonLat = function ( vector ) {
        var x = vector.x
        var y = vector.y
        var latRad, mercN,
        worldWidth = 40075000,
        worldHeight = 40008000;

        lon = (360*x / worldWidth) - 180;
        mercN = Math.PI - (2*Math.PI*y) / worldHeight;
        latRad = 2*Math.atan(Math.pow(Math.E, mercN)) - (Math.PI/2);
        lat = latRad*180/Math.PI;
        
        return [ lon, lat ]
	}
    
     // lon, lat are mercator projected
	this.lonLatToWorld = function ( lon, lat ) {
		var x, y, pointX, pointY, latRad, mercN,
			worldWidth = 40075000,
			worldHeight = 40008000;

		x = ( lon + 180 ) * ( worldWidth / 360);
		latRad = lat*Math.PI/180;
		mercN = Math.log( Math.tan((Math.PI/4)+(latRad/2)));
		y = (worldHeight/2)-(worldHeight*mercN/(2*Math.PI));

		return [ x, y ]
	}
    
    // lon, lat are transformed by origin
    this.lonLatToScene = function( lon, lat ) {
		var point = self.lonLatToWorld( lon, lat );
		return new THREE.Vector2( point[0] - self.origin.x, point[1] - self.origin.y );
	}
    
    return this
}