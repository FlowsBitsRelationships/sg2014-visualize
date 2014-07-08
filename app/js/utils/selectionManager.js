var SelectionManager = function(){

    var self = this;
    
    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;
    
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
    
    return this
}