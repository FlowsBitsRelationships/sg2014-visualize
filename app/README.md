app
================

### Organization

- **/css** styles (and angular css animations)                                        
- **/img** not used
- **/js** standard angular js files (some not used)
- **/js/utils** various scripts used by the controllers
- **/library** contains vis_config files
- **/library/tracing_templates** contains tracing_templates

### TODO: 

- most business logic is in 'controllers.js' and some of this should probably be moved to a directive
- the packages in utils should probably be externalized into node modules that are installed with bower

### Usage

This is a framework for keyframed, interactive urban visualization. It is also intended to provide a straightforward mechanism for modifying the geometry, sequencing, and interactivity of the visualization that abstracts any of the complexity of events/api interaction in javascript.

Workshop participants will develop vis_config .JSON files, which define keyframes and include some additional general info about the visualization (including the geographical scope of the visualization).
Workshop participants will also develop tracing_templates, short .JS scripts that generate and animate threejs geometry, and also include methods for interaction.

A vis_config file is mostly a list of keyframes. Each keyframe tells the app to take the ouput of a given neo4j query and visualize each entry using the specified tracing_template.
 it looks like this:

```javascript
 {
     "title": "SG2014 Sample Visualization",
     "author": "Capt. James T. Kirk",
     "frame": "Spatial",
     "bbox": [114.150659, 22.293765, 114.214688, 22.344105],

     "keyframes": [

         {
             "description": "Twitter users",
             "start": 1000,
             "duration": 29000,
             "queries": [{
                 "querystring": " MATCH (n:Place) WHERE n.name = 'Kowloon' return n",
                 "tracing_template_name": "place_node",
                 "tracing_name": "Kowloon"
             }, {
                 "querystring": "MATCH (n:Social)-[r]->(m:Place{name:'Kowloon'}) return n as nodes",
                 "tracing_template_name": "user_node",
                 "tracing_name": "Kowloon tweeters"
             }]
         }, {
             "description": "who mentioned Kowloon.",
             "start": 4000,
             "duration": 4000,
             "queries": [{
                 "querystring": "MATCH (n:Social)-[r]->(m:Place{name:'Kowloon'}) return r as rels",
                 "tracing_template_name": "tweet_rel",
                 "tracing_name": "Kowloon tweets"
             }]
         }
     ]
 }
```
In the UI, when the user hits 'run', the keyframe displayed in the console will be inserted into an empty vis_config file and then visualized. When the user hits 'load', the vis_config file named in the text box is visualized.
