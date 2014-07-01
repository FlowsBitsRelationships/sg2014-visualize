var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.data.text;
     var x = (trace_json.data.lat-22.28)*1000;
     var y = (trace_json.data.lon-114.15)*1000;

    
    var geometry = new THREE.BoxGeometry(1,1,1 );
    
    var material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: 0.2,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
    
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    cube.renderDepth = 200;
    
    // console.log (cube);
     // Animation Methods/Tweens
    var tween = new TWEEN.Tween({ x_size: 0.2, opac:  0.2 }).to({ x_size: 4, opac: 1 }, 4000)
    .delay(1000)
    .onUpdate(function(){ 
            cube.scale.x = this.x_size;
            cube.material.opacity = this.opac;
        })
    .start();
     
    cube.animate = function(){
        this.rotation.x += 0.001;
		this.rotation.y += 0.003;
    }
    
    // Interaction Methods
    cube.get_metadata = function(){
        return  trace_json.data.content;
    }
    
    return cube
}