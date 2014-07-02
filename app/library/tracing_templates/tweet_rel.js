var template_constructor = function(trace_json, object_lookup_table, start, duration){

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
    
    // var tween = new TWEEN.Tween({  opac:  0.2 }).to({ opac: 0.5 }, duration)
    // .delay(start)
    // .onUpdate(function(){ 
            // line.material.opacity = this.opac;
        // })
    // .start();
 
    // line.animate = function(){
        // this.rotation.x += 0.001;
		// this.rotation.y += 0.003;
    // }
    
    return line
}