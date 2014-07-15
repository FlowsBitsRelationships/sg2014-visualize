var tracing_template = function( ){
    
    var self = this;
    
    var lon,
    lat,
    location,
    x,
    z,
    geometry;
    
    material = new THREE.MeshLambertMaterial({ 
        color:  "rgb(255,112,255)", 
        transparent: true, 
        opacity: 0.2,
        shading: THREE.FlatShading, 
        vertexColors: THREE.VertexColors 
    });
        
    this.get_trace = function(queryresult, duration){
        
        console.log(queryresult);
      
      /*
            lon = Number(trace_json.data.lon);
        lat = Number(trace_json.data.lat);
        
        location = self.lonLatToScene( lon, lat );
        x = location.x;
        z = location.y;
      */
        
        
        /*
        for (var p = 0; p < data.features.length; p++) { //each twitter point
   
  //   data1.forEach(function(d, p_i) {

 var pGeo = new THREE.Geometry();
          var cA = data.features[p].properties;

              var c = {
                  0: parseFloat(data.features[p].geometry.coordinates[0]),
                  1: parseFloat(data.features[p].geometry.coordinates[1])
              };
              
              // if location is outside of city bounding box, dont visualize - adjust the datathrottle for this
              

          pos = getWorldPosition(c[1], c[0], 0, "MERCATOR");

          vec3 = createVector3(pos, c, dotSize, 0xff0000);

          vec3.x = -(vec3.x - test.x) * -scaleMaster;
          vec3.y = 0;
          vec3.z = -(vec3.z - test.z) * -scaleMaster;
          //				console.log(vec3);
          pGeo.vertices.push(vec3);


     // var dotSize = 0.025 * scaleMaster;
      var dotSize = 0.25 * scaleMaster;

      var color = new THREE.Color(0xffffff);

// assign color based on category
if (cA.Type=="Sale Comp"){
   var color = new THREE.Color(twitterColor);
}else if (cA.Type=="Lease Comp"){
    var color = new THREE.Color("rgb(255,195,100)");
}else{
    var color = new THREE.Color("rgb(100,100,100)");
}
 
      pMaterial = new THREE.ParticleBasicMaterial({
          color: color,
          size: dotSize,
          sizeAttenuation: true,
          map: THREE.ImageUtils.loadTexture(
          //  "resources/images/particle_white.png"
          "resources/images/spark_static.png"),
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true
      });
      
      pointData = new THREE.ParticleSystem(pGeo, pMaterial);
     // pointData.data=cA;
      pointData.position.x += panObjects[0].position.x;
      pointData.position.z += panObjects[0].position.z;
      pointData.scale.set(scaleMaster, scaleMaster, scaleMaster);
      mathbox._world._scene.add(pointData);
      panObjects.push(pointData);
      
      var geometry = new THREE.SphereGeometry( 5, 10, 10 );
      var material = new THREE.MeshBasicMaterial( );
      var clicksphere = new THREE.Mesh(geometry,material);
      
    clicksphere.data=cA;
            
      clicksphere.position.x = vec3.x* scaleMaster;
      clicksphere.position.z = vec3.z* scaleMaster;
      
      clicksphere.position.x += panObjects[0].position.x;
      clicksphere.position.z += panObjects[0].position.z;
      mathbox._world._scene.add(clicksphere);
      panObjects.push(clicksphere);
      
selectObjects.push(clicksphere);

      //$("#feedback").text("adding  "+iter*meshSize+"/"+maxElements+" datapoints ");     
    

                }
    
    */
        
        
        
        /*
        
        lon = Number(trace_json.data.lon);
        lat = Number(trace_json.data.lat);
        
        location = self.lonLatToScene( lon, lat );
        x = location.x;
        z = location.y;

        
        geometry = new THREE.SphereGeometry( 380, 32, 32 );
        
        sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, 0, z);
        sphere.renderDepth = 20000;
            
        sphere.callback = function( screenpos ){
            tooltip = self.display_tooltip(trace_json.data.raw_tags, screenpos);
        }
        
        // Animation Methods/Tweens
                 
        var tweenHead = new TWEEN.Tween({  o:  0.2 }).to({ o:  1.0 }, duration/2)
         .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function(){ 
                sphere.material.opacity = this.o;
            })
        .onComplete(function() {
           this.o = 0.2; // reset tweening variable
        });

        var tweenBack= new TWEEN.Tween({  o:  1.0 }).to({ o:  0.2 }, duration/2)
         .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function(){ 
                sphere.material.opacity = this.o;
            })
        .onComplete(function() {
           this.o = 1.0; // reset tweening variable
        });
                    
        tweenHead.chain(tweenBack);
        tweenHead.start();
        
        return sphere;
        
        
    */
    }
        
    return this;
}