//
//  main.js
//
//  A project template for using arbor.js
//

(function($){
  
  var fillStyles = {
    Tweets: "rgb(60,60,255)",
    TwitterUsers: "yellow",
    Place: "orange",
    FlickrPhoto: "red",
    FlickrUser: "green",
    FlickrTag: "rgb(250,100,130)",
    Unknown: "black"
  }
  
  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem
    
    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){

          // draw a rectangle centered at pt
          var w = 5
          ctx.beginPath();
          ctx.fillStyle = ( node.data.type ) ? fillStyles[ node.data.type ] : "black"; // (node.data.alone) ? "orange" : "black"
          ctx.arc( pt.x, pt.y, w, 0, Math.PI * 2, false );
          ctx.fill();
          
          // Add a text label
          ctx.fillStyle = "rgb(180,180,180);"
          ctx.font = "6pt sans-serif";
          ctx.fillText( node.data.type || "unknown", pt.x+(w*2), pt.y+(w*2));
          
        })    			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);
            
            // Ignore clicks far away from nodes.
            var dSP = particleSystem.toScreen(dragged.point )
            if (!dragged || Math.abs( dSP.x - _mouseP.x ) > 20 || Math.abs( dSP.y - _mouseP.y ) > 20 ) {
                return;
            }
            
            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    
  
  
  var sys;
  
  $(document).ready(function(){
    
      // TODO Create a websocket here
      var ws = new WebSocket('ws://' + window.location.host + window.location.pathname );
    
      ws.onopen = function()  { console.log('websocket opened'); };
      ws.onclose   = function()  { console.log('websocket closed'); }
      ws.onmessage = function(m) {
        console.log("Got a message.");
        buildGraph( JSON.parse( m.data ) );
      };
      
      // Set canvas width
      $('#viewport').attr('width', window.outerWidth * 1.1 );
      $('#viewport').attr('height', window.outerHeight * 1.1 );
      
      // And add an event handler to keep it properly sized
      var rsTimer;
      $(window).on('resize', function() {
            clearTimeout( rsTimer );
            rsTimer = setTimeout( function() {
            $('#viewport').attr('width', window.outerWidth );
            $('#viewport').attr('height', window.outerHeight );
            }, 200);
      })
      
      // Setup -- Maybe this only should be done once when the page loads
      sys = arbor.ParticleSystem(900, 300, 0.5) // create the system with sensible repulsion/stiffness/friction
      sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
      sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
    
  })
  
  
  function buildGraph( response ) {
    
    // clear the existing nodes and edges... is this necessary? yes!
    sys.eachNode( function( node, pt ) {
       sys.pruneNode( node );
    });
    sys.eachEdge( function( edge, pt1, pt2 ) {
       sys.pruneEdge( edge );
    })
    
    // grab the useful part of the data
    var data = response.keyframes[0].queries[0].queryresult.data;
    
    if ( data.length < 1 ) {
      console.log( "Got a query that returned no data." )
    }
    
    for ( var i = 0, len = data.length; i < len; i++ ) {
        processDataSet( sys, data[i] );
    }
    
  }
  
  function processDataSet( system, dataSet ) {
      var d;
      for ( var i = 0, len = dataSet.length; i < len; i++ ) {
          d = dataSet[i];
          if ( d.all_relationships ) {
              system.addNode( d.self, { type: getDataType( d ) } );
          } else if ( d.start ) {
              system.addEdge( d.start, d.end, { type: getDataType( d ) } );
          }
      }
  }
  
  
  
  
  function getDataType( item ) {

    // Ugh. This is a kind of hacky trick.
    var data = item.data;
    if ( item.start && item.type ) {
      return item.type;
    } else if ( data.origin === "hk_gov" || data.osmid ) {
      return "Place";
    } else if ( data.content && data.origin === "twitter" ) {
      return "Tweets";
    } else if ( data.username && data.id_str && data.description ) {
      return "TwitterUsers";
    } else if ( data.origin === "flickr" && data.time ) {
      return "FlickrPhoto";
    } else if ( data.text ) {
      return "FlickrTag";
    } else if ( data.is_local ) {
      return "FlickrUser";
    }
    console.log( item );
    return "Unknown";
  }
  
})(this.jQuery);



