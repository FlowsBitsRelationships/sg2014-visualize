var tracing_template = function(trace_json, object_lookup_table, duration){
    
    var start_id_url = trace_json["start"].split("/");
    var start_id = start_id_url[start_id_url.length-1];
    var start = object_lookup_table.node[start_id];
    
    var end_id_url = trace_json['end'].split("/");
    var end_id = end_id_url[end_id_url.length-1];
    var end = object_lookup_table.node[end_id];
    
    var material = new THREE.LineBasicMaterial({
            color: "rgb(255,0,149)"
        });
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push( start.position );
    geometry.vertices.push( end.position );

    var line = new THREE.Line( geometry, material );
    line.renderDepth = 200;
    
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
 
    console.log(line);
    return line
}