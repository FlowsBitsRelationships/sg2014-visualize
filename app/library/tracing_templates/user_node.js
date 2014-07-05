var tracing_template = function(trace_json, object_lookup_table, duration, idx){

    var self = this;
    
     self.text = trace_json.data.text;
     var x = (trace_json.data.lat-22.28)*1000;
     var y = (trace_json.data.lon-114.15)*1000;
    
    var geometry = new THREE.SphereGeometry(1,1,1 );
    
    var material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: 0.2,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
    
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, 0);
    sphere.renderDepth = 200;

     // Animation Methods/Tweens
     
    var tweenHead = new TWEEN.Tween({  z:  0 }).to({ z:  8 }, 3000)
     .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function(){ 
            sphere.position.z = this.z;
        })
    .onComplete(function() {
       this.z = 0; // reset tweening variable
    });

    var tweenBack = new TWEEN.Tween({ z:  8 }).to({ z:  -16 }, 3000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function(){ 
           sphere.position.z = this.z;
        })
     .onComplete(function() {
       this.z = 8; // reset tweening variable
    });
    
    var tweenLast = new TWEEN.Tween({ z:  -16 }).to({ z:  0 }, 3000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function(){ 
           sphere.position.z = this.z;
        })
     .onComplete(function() {
       this.z = -16; // reset tweening variable
    });
        
    tweenHead.chain(tweenBack);
    tweenBack.chain(tweenLast);
    tweenLast.chain(tweenHead);
    tweenHead.start();
    
    // Interaction Methods
    sphere.get_metadata = function(){
        return  trace_json.data.content;
    }
    
    return sphere
}