var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.text;
     var x = (trace_json.lat-22.28)*1000;
     var y = (trace_json.lon-114.15)*1000;
    var a = new THREE.Vector3( 1, 1, 1 );
    
    var geometry = new THREE.BoxGeometry(1,1,1 );
    
    var material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: 0.5,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
    
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    
     // Animation Methods/Tweens
    var tween = new TWEEN.Tween({ x_size: 0.2 }).to({ x_size: 4 }, 5000)
    .onUpdate(function(){ 
            cube.scale.x = this.x_size;
            console.log(cube.scale.x);
        })
    .start();
     
    cube.animate = function(){
        this.rotation.x += 0.001;
		this.rotation.y += 0.003;
    }
    
    // Interaction Methods
    cube.get_metadata = function(){
        return  trace_json.content;
    }
    
    return cube
}