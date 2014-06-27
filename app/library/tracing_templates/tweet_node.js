var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.text;
     var x = (trace_json.lat-22.28)*1000;
     var y = (trace_json.lon-114.15)*1000;
     
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: .5,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
        
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    
    cube.animate = function(){
        this.rotation.x += 0.001;
		this.rotation.y += 0.003;
    }
    
    cube.get_metadata = function(){
        return  trace_json.content;
    }

    return cube
}