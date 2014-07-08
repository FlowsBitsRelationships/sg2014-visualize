var tracing_template = function(){
    
    var self = this;
    
    this.get_trace = function(trace_json, duration){
    
        var start_neoid_url = trace_json["start"].split("/");
        var start_neoid = start_neoid_url[start_neoid_url.length-1];
        var start = self.object_lookup_table.node[start_neoid];
        
        var end_neoid_url = trace_json['end'].split("/");
        var end_neoid = end_neoid_url[end_neoid_url.length-1];
        var end = self.object_lookup_table.node[end_neoid];
        
        var material = new THREE.LineBasicMaterial({
                color: "rgb(255,0,149)"
            });
        
        var geometry = new THREE.Geometry();
        geometry.vertices.push( start.position );
        geometry.vertices.push( end.position );

        var line = new THREE.Line( geometry, material );
        line.renderDepth = 20000;
        
        // Looking up the position on each frame may get choppy...
        var tween = new TWEEN.Tween()
        .delay(start)
        .onUpdate(function(){ 
            line.geometry.vertices[0] = start.position;
            line.geometry.verticesNeedUpdate = true;
        })
        .repeat( Infinity )
        .yoyo( true )
        .start();
     
        return line;
    }
    
    return this;
}