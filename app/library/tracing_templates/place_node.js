var tracing_template = function( ){
    
    var self = this;
    
    this.customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: 
            { 
                "c":   { type: "f", value: .5 },
                "p":   { type: "f", value: 4.5 },
                glowColor: { type: "c", value: new THREE.Color("rgb(255,0,149)") },
                viewVector: { type: "v3", value: new THREE.Vector3( 0, -1, 0 ) } //viewVector: { type: "v3", value: camera.position }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }   );
        
    this.get_trace = function(trace_json, duration){
        var lon = Number(trace_json.data.lon);
        var lat = Number(trace_json.data.lat);
        
        var location = self.lonLatToScene( lon, lat );
         var x = location.x;
         var z = location.y;

        
        var geometry = new THREE.SphereGeometry( 780, 32, 32 );
        
        sphere = new THREE.Mesh(geometry, self.customMaterial);
        sphere.position.set(x, 0, z);
        sphere.renderDepth = 200;
        
        return sphere;
    }
    
    return this
}