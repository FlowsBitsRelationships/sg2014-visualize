var TerrainGen = function($scope, $interval){
    var self = this;
    
    this.origin = new THREE.Vector2( 0, 0 );
    
    this.set_origin = function(lon, lat){
        self.origin = self.lonLatToScene(lon, lat);
    }
    
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


    this.lonLatToScene = function( lon, lat ) {
		var point = self.lonLatToWorld( lon, lat );
		return new THREE.Vector2( point[0] - self.origin.x, point[1] - self.origin.y );
	}
    
    this.worldToLonLat = function ( lon, lat ) {

	}
    
    this.sceneToLonLat = function( lon, lat ) {

    }
    
    this.generate = function( x, z, x_step, z_step ){
    
        // >>PSEUDOCODE:
        
        // p = new plane( x,z,x_step,z_step);
        
        // lonLats = [];
        // for each vert in plane.vertices:
            // lonLats.push(sceneToLonLat( vert ))
        
        // heights = elevationService.get({args: lonLats})
        
        // for each vert in plane.vertices, i ++:
          // plane.vertices[0].z = heights.z
        
        // <<PSEUDOCODE
    }
    
    // Elevation demo - Started implementing this, then realized it belonged on the backend
    // var set_elevation = function (result){
        // var heights = [];
        // for (var key in result.elevationProfile){
           // heights.push(result.elevationProfile[key]["height"]);
        // }
        // console.log(heights);
    // }
    // var latLngs = [39.74012,-104.9849,39.7995,-105.7237,39.6404,-106.3736]
    // elevationService.get({latLngCollection: latLngs.join(",")}).$promise.then(set_elevation);
    
}