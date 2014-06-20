// Class for making calls to Neo4j/Postgres
function db_controller() {
    var self = this;

	var __construct = function (that) {
        // console.log("db_controller.__construct");
    }(this);
    
    // Sends a cypher query to the application
    self.cypher_neo4j = function (query_msg, ext_callback) {
        // var response = $.post("/cypher", { query: query_msg }).done(function(data){
            // cypher_neo4j_callback(data, ext_callback);
        // });
        var response = $.get("../sample.json").done(function(data){
            cypher_neo4j_callback(data, ext_callback);
        });
	};
    
    // Callback for when cypher query returns results, executes external callback with results
    var cypher_neo4j_callback = function (data, ext_callback) {
        // var json = JSON.parse(data);
        var json = data;
        ext_callback(json);
    };
}

// Class for managing ThreeJS methods and interaction with scene
function scene_controller() {

	var self = this;
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
    var objects = [],plane;
    
    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;
    
    // Initializes threeJS stuff
	var __construct = function (that) {
    
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer();
        projector = new THREE.Projector();
        
        container = document.createElement('div');
        
        document.body.appendChild(container);
    
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
		camera.position.z = 100;
        
        
        controls = new THREE.TrackballControls(camera, container);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        
        
        plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
                    color : 0x000000,
                    opacity : 0.25,
                    transparent : true,
                    wireframe : true
                }));
        plane.visible = false;
        scene.add(plane);
    
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

        window.addEventListener('resize', onWindowResize, false);
	}(this);
    
    // TBD: Changes the active frame
	self.set_frame = function (frame_name) {
    
		console.log("set_frame("+frame_name+")");
        
        switch (frame_name) {
        
			case "interaction":
                console.log("interaction");
            break
            
			case "temporal":
                console.log("temporal");
            break
            
			case "spatial":
                console.log("spatial");
            break
            
        };
        
	};
    
    // Changes the active tracing template.
	self.set_tracing_template = function (tracing_template_name) {
    
         // Each template has a constructor function called template_constructor
        $.getScript( "js/tracing_templates/"+tracing_template_name+".js", function(script) {
           tracing_template = template_constructor;
        });
	};
    
    // Adds a tracing to the scene by combining a set of data with a corresponding tracing template
	self.add_tracing = function (json) {
        json.data.forEach(function(trace_json){
            trace_properties = trace_json[0]["data"];
            trace = tracing_template(trace_properties);
            objects.push(trace);
            console.log(trace);
            scene.add(trace);
        });
        self.animate();
	};
    
    // **** Helper Functions***
        
    // Clear the scene geometry
	self.clear_scene = function () {
        objects.forEach(function(object){
            scene.remove(object);
        });
	};

    // Animate the scene
	self.animate = function () {
        controls.update();
		requestAnimationFrame(self.animate);
        
         objects.forEach(function(object){
            object.animate();
        });

		renderer.render(scene, camera);
	};
    
    self.display_tooltip = function(text, location){
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = text;
        tooltip.style.top = location.y + 'px';
        tooltip.style.left = location.x + 'px';
        document.body.appendChild(tooltip);
    }
    
    self.hide_tooltip = function(){
        if (tooltip != undefined){
            document.body.removeChild(tooltip);
            console.log("removed");
        }
    }
    
    // **** ThreeJS Helper Functions***
    // BORROWED FROM: http://mrdoob.github.io/three.js/examples/webgl_interactive_draggablecubes.html
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    function onDocumentMouseMove( event ) {
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
        
        var intersects = raycaster.intersectObjects( objects );

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

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {
            controls.enabled = false;
            SELECTED = intersects[ 0 ].object;
            var intersects = raycaster.intersectObject( plane );
            offset.copy( intersects[ 0 ].point ).sub( plane.position );
            container.style.cursor = 'move';
        }
        
    }

    function onDocumentMouseUp( event ) {

        event.preventDefault();
        controls.enabled = true;

        if ( INTERSECTED ) {
            plane.position.copy( INTERSECTED.position );
            SELECTED = null;
            
            // Find location on canvas and show tweet as overlay
            pos = toXYCoords(INTERSECTED.position);
            text = INTERSECTED.get_metadata();
            console.log(pos);
            console.log( text);
            self.hide_tooltip();
            self.display_tooltip(text, pos);
        }

        container.style.cursor = 'auto';
    }
    
    // Projects 3D position to x,y position on canvas
    var toXYCoords = function (pos) {
        var vector = projector.projectVector(pos.clone(), camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
    }
    
}