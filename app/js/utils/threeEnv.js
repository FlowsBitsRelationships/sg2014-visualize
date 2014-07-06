THREE.Env = function ( ) {
    var self = this;
    
    self.objects = {};
    object_lookup_table = { node: {}, relationship: {} };
    self.materials = {};
    
    var cur_tracing_template;
    
    var container;
    var tooltip;
    
    var controls,
    origin,
    scene,
    camera,
    renderer,
    projector,
    geometry,
    material,
    cube;
    
    // var cur_tracing_template;
    var plane;
    var color = new THREE.Color("rgb(42,42,42)");
    
    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;
            
    // Initializes threeJS stuff
    this.init = function ( ) {
    
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
        
        renderer = new THREE.WebGLRenderer( {alpha: true,  antialias: true});
        projector = new THREE.Projector();
        
        container = document.createElement('div');
        
        document.body.appendChild(container);
    
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor( color, 1);
        container.appendChild(renderer.domElement);
        
		camera.position.z = 400;
		camera.position.x = -400;
		camera.position.y = 800;
       
        
        controls = new THREE.OrbitControls(camera, container);
        controls.target = new THREE.Vector3(2500,0,-2500);
        
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
        
        plane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000, 100, 100), new THREE.MeshBasicMaterial({
                    color : 0x000000,
                    opacity : 0.25,
                    transparent : true,
                    wireframe : true
                }));
        plane.visible = true;
        plane.position.x = 5000/2;
        plane.position.z = -5000/2;
        plane.rotation.x = Math.PI / 2;
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
    
    // Called externally, adds context buildings and sets origin
    this.add_context = function(bbox, callback){
        origin = [bbox[0] , bbox[1] ];
        OSM3.makeBuildings( scene, bbox, { scale: 1, onComplete: callback } );
        // TODO: Keep track of building objects + clear them when a new visualization starts
    }
    
    // Called externally, turns a query_response into threeJS geometry
    this.add_tracing = function (query, duration) {
        var trace_objects = [];
        
        $.getScript( "library/tracing_templates/"+query.tracing_template_name+".js", function(script) {
            
            // 'tracing_template' is the name of the main function in each tracing template that gets loaded
            // 'as_tracing_template' is a mixin of functionality shared by multiple templates
            as_tracing_template.call(tracing_template.prototype); 
           cur_tracing_template = new tracing_template( );
           
           //  Set 'class variables'
            cur_tracing_template.set_origin(origin[0], origin[1]); //  Set the origin
            cur_tracing_template.object_lookup_table = object_lookup_table; //  Set lookup table
            

           var idx = 0;
            query.queryresult.data.forEach(function(result_chunk){
                result_chunk.forEach(function(trace_chunk){

                    // Generate the object from the template
                    var trace_object = cur_tracing_template.get_trace( trace_chunk, duration, idx);
                    
                    // split up id property into 'type' and 'id'
                    var id_url = trace_chunk.self.split("/");
                    var type = id_url[id_url.length-2]; // node or relationship
                    var id = id_url[id_url.length-1]; // id
                    
                    // Add the object to the lookup table to future reference by other tracings,
                    object_lookup_table[type][id] = trace_object; 
                     // Keep track of this tracing's objects, for removal later
                    trace_objects.push(trace_object);
                    idx++
                });
            });
        });
        
       self.add_tracing_objects( trace_objects, query.tracing_name, duration);
        
    };
    
    // Called by add_tracing. Adds threeJS geometry at the appointed time and removes it
    this.add_tracing_objects = function( trace_objects, tracing_name, duration){
        
        window.setTimeout(function(){

            self.objects[tracing_name] = trace_objects;

            trace_objects.forEach(function(obj){ scene.add(obj); });

            window.setTimeout(function(){ 
                self.objects[tracing_name].forEach(function(obj){ scene.remove(obj);});
            }, duration);
            
        }, 100);
        
    }
    
    // **** Helper Functions***

    // Animate the scene
    this.animate = function () {
        controls.update();
        requestAnimationFrame(self.animate);
        
        TWEEN.update();

        renderer.render(scene, camera);
    }
    
    // Clear the scene geometry
    this.clear_scene = function () {
        for (var tracing_name in self.objects) {
            self.objects[tracing_name].forEach(function(obj){
                 scene.remove(obj);
            });
        }
        var children = scene.children;
        for(var i = children.length-1;i>=0;i--){
            var child = children[i];
            if (child.geometry instanceof  THREE.PlaneGeometry || child instanceof THREE.PointLight){
            }
            else{
                    scene.remove(child);
                } 
            };
        // object_lookup_table = {};
    }
    
    
    // FIXME: Onclick functionality should be defined by each tracing_template - NOT USED
    this.display_tooltip = function(text, location){
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = text;
        tooltip.style.top = location.y + 'px';
        tooltip.style.left = location.x + 'px';
        document.body.appendChild(tooltip);
    }
    
    // FIXME: Onclick functionality should be defined by each tracing_template - NOT USED
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
    
    // TODO: FIXME to iterate over all tracings, generalize to take a callback - NOT USED
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
    
    // TODO: FIXME to iterate over all tracings, generalize to take a callback - NOT USED
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