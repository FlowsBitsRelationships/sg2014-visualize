var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.data.text;
     var x = (trace_json.data.lat-22.28)*1000;
     var y = (trace_json.data.lon-114.15)*1000;

    
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );

	var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
			"c":   { type: "f", value: .1 },
			"p":   { type: "f", value: 6 },
			glowColor: { type: "c", value: new THREE.Color("rgb(255,0,149)") },
			viewVector: { type: "v3", value: new THREE.Vector3( 0, 0, 1 ) } //viewVector: { type: "v3", value: camera.position }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );
    
    var sphere = new THREE.Mesh(geometry, customMaterial);
    sphere.position.set(x, y, -10);
    sphere.renderDepth = 200;
    
    
     // Animation Methods/Tweens
    var tween = new TWEEN.Tween({  c:  .5 }).to({ c:  0 }, 4000)
    .delay(1000)
    .onUpdate(function(){ 
            sphere.material.uniforms.c.value = this.c;
        })
    .start();
     
    // sphere.animate = function(){
    // }
    
    // Interaction Methods
    sphere.get_metadata = function(){
        return  trace_json.data.content;
    }
    
    return sphere
}