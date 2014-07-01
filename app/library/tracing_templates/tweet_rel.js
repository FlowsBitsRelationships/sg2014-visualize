var template_constructor = function(trace_json, object_lookup_table){
    console.log( trace_json);
    // TODO: If node doesn't exist, create it.
    var start_id_url = trace_json["start"].split("/");
    var start_id = start_id_url[start_id_url.length-1];
    var start = object_lookup_table.node[start_id];
    
     // TODO: If node doesn't exist, create it.
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
    
    line.animate = function(){
    }
    
    var tween = new TWEEN.Tween({  opac:  0.2 }).to({ opac: 0.5 }, 4000)
    .delay(1000)
    .onUpdate(function(){ 
            line.material.opacity = this.opac;
        })
    .start();
    
    return line
}