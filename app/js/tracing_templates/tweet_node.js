var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.text;
     var x = (trace_json.lat-22.28)*1000;
     var y = (trace_json.lon-114.15)*1000;
     
    console.log("x: "+x+",y: "+y);
    geometry = new THREE.CubeGeometry(3, 3, 3);
    material = new THREE.MeshBasicMaterial({
            color : 0x00ff00,
            wireframe: true
        });
        
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    
    cube.animate = function(){
        this.rotation.x += 0.001;
		this.rotation.y += 0.003;
    }
    
    cube.get_metadata = function(){
        return  trace_json.text;
    }

    return cube
}