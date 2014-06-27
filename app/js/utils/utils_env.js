THREE.Env = function (  ) {
    var self = this;
    
    self.objects = {};
    self.materials = {};
    
    var container;
    var tooltip;
    
    var controls,
    scene,
    camera,
    renderer,
    projector,
    geometry,
    material,
    cube;
    
    var tracing_template;
    var plane;
    var color = new THREE.Color("rgb(42,42,42)");
    
    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;
            
    // Initializes threeJS stuff
    this.init = function ( ) {
    
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer( {alpha: true,  antialias: true});
        projector = new THREE.Projector();
        
        container = document.createElement('div');
        
        document.body.appendChild(container);
    
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor( color, 1);
        container.appendChild(renderer.domElement);
        camera.position.z = 50;
        
        
        controls = new THREE.TrackballControls(camera, container);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        
        self.materials.lambert = new THREE.MeshLambertMaterial({ 
            color:"rgb(255,112,255)", 
            transparent: true, 
            opacity: 0.5,
            shading: THREE.FlatShading, 
            vertexColors: THREE.VertexColors 
        });

        self.materials.phong = new THREE.MeshPhongMaterial({ 
            ambient: 0x030303, 
            color: "rgb(255,112,255)", 
            specular: 0x009900, 
            shininess: 30, 
            transparent: true, 
            opacity: 0.5,
            shading: THREE.FlatShading, 
            vertexColors: THREE.VertexColors  
        });

        self.materials.wireframe = new THREE.MeshBasicMaterial({ 
            color: "rgb(255,112,255)", 
            shading: THREE.FlatShading, 
            wireframe: true, 
            transparent: true 
        });
        
        plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
                    color : 0x000000,
                    opacity : 0.25,
                    transparent : true,
                    wireframe : true
                }));
        plane.visible = false;
        scene.add(plane);
        
        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        scene.add(pointLight);

        renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);

        window.addEventListener('resize', this.onWindowResize, false);
    }
    
    // Changes the active tracing template.
    this.set_tracing_template = function (tracing_template_name) {
    
         // Each template has a constructor function called template_constructor
        $.getScript( "library/tracing_templates/"+tracing_template_name+".js", function(script) {
           tracing_template = template_constructor;
        });
    };
    
    // Called externally, turns a query_response into threeJS geometry
    this.add_tracing = function (query, start, duration) {
        var trace_objects = [];
        
        $.getScript( "library/tracing_templates/"+query.tracing_template_name+".js", function(script) {
            
           tracing_template = template_constructor;
           
            query.queryresult.data.forEach(function(result_chunk){
                result_chunk.forEach(function(trace_chunk){
                
                    trace_objects.push(tracing_template( trace_chunk.data ));
                
                });
            });
        });
        
        self.add_tracing_objects( trace_objects, query.tracing_name, start, duration)
    };
    
    // Called by add_tracing. Adds threeJS geometry at the appointed time and removes it
    this.add_tracing_objects = function( trace_objects, tracing_name, start, duration){
        
        window.setTimeout(function(){
                
            self.objects[tracing_name] = trace_objects;
            console.log(self.objects);
            trace_objects.forEach(function(obj){ scene.add(obj); });
            
            window.setTimeout(function(){ 
                self.objects[tracing_name].forEach(function(obj){ scene.remove(obj);});
            }, duration);
            
        }, start);
        
    }

    // **** Helper Functions***
        
    // Clear the scene geometry
    this.clear_scene = function () {
        for (var tracing_name in self.objects) {
            self.objects[tracing_name].forEach(function(obj){
                 scene.remove(obj);
            });
        }
    };

    // Animate the scene
    this.animate = function ( ) {
        controls.update();
        requestAnimationFrame(self.animate);
        
        for (var tracing_name in self.objects) {
            self.objects[tracing_name].forEach(function(obj){
                obj.animate();
            });
        }
        
        TWEEN.update(  );
        renderer.render(scene, camera);
    }
    
    this.display_tooltip = function(text, location){
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = text;
        tooltip.style.top = location.y + 'px';
        tooltip.style.left = location.x + 'px';
        document.body.appendChild(tooltip);
    }
    
    this.hide_tooltip = function(){
        if (tooltip != undefined){
            document.body.removeChild(tooltip);
            console.log("removed");
        }
    }
    
    // **** ThreeJS Helper Functions***
    
    // BORROWED FROM: http://mrdoob.github.io/three.js/examples/webgl_interactive_draggablecubes.html
    
    this.onWindowResize = function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    // TODO: FIXME to iterate over all tracings, generalize to take a callback    
     this.onDocumentMouseMove = function( event ) {
        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        if ( SELECTED ) {

            var intersects = raycaster.intersectObject( plane );
            SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
            return;
        }

        var intersects = raycaster.intersectObjects( self.objects );

        if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                plane.position.copy( INTERSECTED.position );
                plane.lookAt( camera.position );
            }

            container.style.cursor = 'pointer';
        } else {

            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
            container.style.cursor = 'auto';
        }
    }
    
    // TODO: FIXME to iterate over all tracings, generalize to take a callback
    this.onDocumentMouseDown = function( event ) {

        event.preventDefault();

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        
        var intersects = raycaster.intersectObjects( self.objects );

        if ( intersects.length > 0 ) {
            controls.enabled = false;
            SELECTED = intersects[ 0 ].object;
            var intersects = raycaster.intersectObject( plane );
            offset.copy( intersects[ 0 ].point ).sub( plane.position );
            container.style.cursor = 'move';
        }
        
    }

    this.onDocumentMouseUp = function( event ) {

        event.preventDefault();
        controls.enabled = true;

        if ( INTERSECTED ) {
            plane.position.copy( INTERSECTED.position );
            SELECTED = null;
            
            // Find location on canvas and show tweet as overlay
            var pos = this.toXYCoords(INTERSECTED.position);
            var text = INTERSECTED.get_metadata();
            this.hide_tooltip();
            this.display_tooltip(text, pos);
        }

        container.style.cursor = 'auto';
    }
    
    // Projects 3D position to x,y position on canvas
    this.toXYCoords = function (pos) {
        var vector = projector.projectVector(pos.clone(), camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
    }
    
    this.init();
    this.animate( );
}

THREE.Env.prototype = Object.create( THREE.EventDispatcher.prototype );