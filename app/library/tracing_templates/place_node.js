var tracing_template = function( ){
    
    var self = this;
    
    var lon,
    lat,
    location,
    x,
    z,
    geometry;
    
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
        });
        
    this.get_trace = function(trace_json, duration){
        lon = Number(trace_json.data.lon);
        lat = Number(trace_json.data.lat);
        
        location = self.lonLatToScene( lon, lat );
        x = location.x;
        z = location.y;

        
        geometry = new THREE.SphereGeometry( 380, 32, 32 );
        
        sphere = new THREE.Mesh(geometry, self.customMaterial);
        sphere.position.set(x, 0, z);
        sphere.renderDepth = 200;
        
        return sphere;
    }
    
    return this;
}