var tracing_template = function(){
    
    var self = this;
    
    var lon,
    lat,
    location,
    x,
    z,
    geometry,
    material;
    
    geometry = new THREE.SphereGeometry(50,50,50 );

    material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: 1,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
        
    this.get_trace = function(trace_json, duration, idx){
            
        lon = Number(trace_json.data.lon);
        lat = Number(trace_json.data.lat);
        
        location = self.lonLatToScene( lon, lat );
        x = location.x;
        z = location.y;
        
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, 0, z);
        sphere.renderDepth = 20000;

         // Animation Methods/Tweens
         
        var tweenHead = new TWEEN.Tween({  y:  0 }).to({ y:  80 }, 2000)
         .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function(){ 
                sphere.position.y = this.y;
            })
        .onComplete(function() {
           this.y = 0; // reset tweening variable
        });

        var tweenBack = new TWEEN.Tween({ y:  80 }).to({ y:  -160 }, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function(){ 
               sphere.position.y = this.y;
            })
         .onComplete(function() {
           this.y = 80; // reset tweening variable
        });
        
        var tweenLast = new TWEEN.Tween({ y:  -160 }).to({ y:  0 }, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function(){ 
               sphere.position.y = this.y;
            })
         .onComplete(function() {
           this.y = -160; // reset tweening variable
        });
            
        tweenHead.chain(tweenBack);
        tweenBack.chain(tweenLast);
        tweenLast.chain(tweenHead);
        tweenHead.start();
        
        return sphere;
    }
    
    return this;
}