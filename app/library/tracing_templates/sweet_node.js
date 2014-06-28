var template_constructor = function(trace_json){
    var self = this;
    
     self.text = trace_json.text;
     var x = (trace_json.lat-22.28)*1000;
     var y = (trace_json.lon-114.15)*1000;
     
    geometry = new THREE.BoxGeometry(1, 12, 2);
    material = new THREE.MeshLambertMaterial({ 
        color: "rgb(255,112,255)", 
        transparent: true, 
        opacity: 0.2,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
        
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    cube.renderDepth = 200;
    
    cube.animate = function(){
        this.rotation.x += 0.01;
		this.rotation.y += 0.03;
    }
    var tween = new TWEEN.Tween({ opac:  0.2 }).to({ opac: 1 }, 1000)
    .delay(1000)
    .onUpdate(function(){ 
            cube.material.opacity = this.opac;
        })
    .start();
    
    cube.get_metadata = function(){
        return  trace_json.content;
    }

    return cube
}