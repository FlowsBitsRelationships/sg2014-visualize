require 'rubygems'
require 'sinatra'
require 'json'
require 'net/http'
require 'net/https'
require 'pp'
require 'neography'
require 'sinatra-websocket'
require 'rack/rewrite'

set :port, '3010'
set :bind, '0.0.0.0'
set :public_folder, './'
set :server, 'thin' 

set :sockets, []

GRAPHENEDB_URL = ENV['GRAPHENEDB_URL'] ? ENV['GRAPHENEDB_URL'].gsub("/db/data", "") : nil
MAPQUEST_KEY = ENV['MAPQUEST_KEY']

# Staticserve the index page
get '/' do
	response.headers['Access-Control-Allow-Origin'] = '*'
	File.open( './index.html') do | f |
		f.read
	end
end

# Workaround because post request body isn't immediately accessible in Sinatra routes...
before do
  if request.request_method == "POST"
    body_parameters = request.body.read
    params.merge!(JSON.parse(body_parameters))
  end
end

# Create a new elevation resource, return it
post '/elevation' do
   req_chunks = params[:latLngCollection].split(",").each_slice(300).to_a
    elevations = []
    
    req_chunks.each do | chunk |
        
        uri = URI(  "http://open.mapquestapi.com/elevation/v1/profile?key=#{ MAPQUEST_KEY }&shapeFormat=raw&latLngCollection=#{chunk.join(",")}" )
        req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
        
        res = Net::HTTP.start(uri.hostname, uri.port) {|http|
            http.request(req)
        }
        
        res_chunk = JSON.parse(res.body)["elevationProfile"].each do | record |
            elevations<<record["height"]
        end
        
    end
    
    return  elevations.to_json
end

# Create a new visualization config resource
post '/vis_config' do
	response.headers['Access-Control-Allow-Origin'] = '*'
    
    # If a filename parameter is sent, load the corresponding vis_config file
    # If a JSON is sent, insert it as keyframe[0] of an empty vis_config
    if params[:filename] != nil && params[:filename] != ""
        contents = JSON.parse(File.read( "./library/#{params[:filename]}.json" ))
    elsif params[:json] != nil && params[:json] != ""
        contents = JSON.parse(File.read( './library/empty_vis_config.json' ))
        contents["keyframes"][0] = JSON.parse(params[:json])
    else
        return status 400 
    end
    
    contents.to_json
end

# Send a new neo4j request
post '/neo4j' do
	response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"

    contents = params[:json]
    
    return status 400 if contents.nil? || contents == ""

    # Requests and insert the database responses for each query in the vis_config file. 
    # Preloading ensures that the visualization has no timing hiccups
    contents["keyframes"].each_with_index do | keyframe, i |
        keyframe["queries"].each_with_index do |query, j|
                queryresult = execute_query(query["querystring"])
                contents["keyframes"][i]["queries"][j]["queryresult"] = JSON.parse(queryresult)
        end
    end
    settings.sockets.each do | ws |
       ws.send( contents.to_json ) 
    end
    return contents.to_json
end

get '/graph' do
    if !request.websocket?
        File.open( './index_graph.html') do | f |
		    f.read
	    end
	else
	  request.websocket do |ws|
      ws.onopen do
        #ws.send("Hello World!")
        settings.sockets << ws
      end
      ws.onmessage do | msg |
        # Not really needed here...
        EM.next_tick { 
            settings.sockets.each do |s| 
                s.send( msg )
            end
        }
      end
      ws.onclose do
        warn("websocket closed")
        settings.sockets.delete(ws)
      end
    end 
	end
end


def execute_query(q)
    return status 403 if !verify_querystring(q) # Check for naughty query words...
    neo = Neography::Rest.new( GRAPHENEDB_URL )
    neo.execute_query(q).to_json
end


def verify_querystring(q)
    case q
    when /DELETE/
      return false
    when /REMOVE/
      return false
    when /CREATE/
      return false
    when /SET/
      return false
   when /MERGE/
      return false
    when /DROP/
      return false
    else
     printf( "\nQuery Accepted: #{q} \n")
      return true
    end

end

