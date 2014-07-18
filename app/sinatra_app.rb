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

post '/elevation' do
   req_chunks = params[:latLngCollection].split(",").each_slice(300).to_a
    elevations = []
    
    req_chunks.each do | chunk |
        
        uri = URI(  "http://open.mapquestapi.com/elevation/v1/profile?key=#{ENV['MQ_PASSWORD']}&shapeFormat=raw&latLngCollection=#{chunk.join(",")}" )
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


#get '/viz/' do
#    File.open( './index.html') do | f |
#	    f.read
#	end
#end


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

    url = "https://sg2014_prod:L0qLQBOqr87W0iQ53zi9@db-qtursgrzj61yznnzc8ny.graphenedb.com:24780/db/data/cypher/"
    uri = URI.parse( url )
    
    p "it works"
    
    # https request
    https = Net::HTTP.new(uri.host,uri.port)
    https.use_ssl = true
    req = Net::HTTP::Post.new(uri.path, initheader = {'Content-Type' =>'application/json'})
    req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
    req.body = {'query' =>q}.to_json

    p req

    res = https.request(req)
    
    return  res.body
    
    
    
    # this has a timeout issue and cannot fix it
    #neo = Neography::Rest.new( url )
    #neo.execute_query(q).to_json
    #return neo.execute_query(q).to_json
    

    # THIS WILL NOT WORK
    # newQ = q + " SKIP 100 LIMIT 10"
    # printf("%s\n",newQ)
    # neo = Neography::Rest.new( url )
    # neo.execute_query(newQ).to_json
    # return neo.execute_query(newQ).to_json

    # Neography.configure do |config|
    #     config.http_send_timeout    = 10000
    #     config.http_receive_timeout = 10000
    # end

    # @neo = Neography::Rest.new({:http_send_timeout=10000})
    

    # neo = Neography::Rest.new( url )

    # # get the max elements first to figure out the number of calls needed
    #     # split q by RETURN and inject count( --- ) between the return variables
    # qCount = q  # THIS IS INCORRECT NOW
    # qSplit = q.split("RETURN ")[0]+"RETURN count("+q.split("RETURN ")[1]+")"
    
    # p qSplit
    
    # # run the query to get the count
    # numelements = neo.execute_query(qSplit).to_json

    # p numelements

    # chunk = 100
    
    # numelements = 1000
    # calls = numelements/chunk
    
    
    # req_chunks = 
    # elevations = []
    
    # req_chunks.each do | chunk |

    #     uri = URI(  )
    #     req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})

    #     res = Net::HTTP.start(uri.hostname, uri.port) {|http|
    #         http.request(req)
    #     }

    #     res_chunk = JSON.parse(res.body)["elevationProfile"].each do | record |
    #         elevations<<record["height"]
    #     end

    # end
    
    
end


def execute_query_OLD(q)
    return status 403 if !verify_querystring(q) # Check for naughty query words...
    
    uri = URI( "https://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@db-qtursgrzj61yznnzc8ny.graphenedb.com:24780/db/data/cypher/" )

    #req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    #req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
    #req.body = {'query' =>q}.to_json
        
    https = Net::HTTP.new(uri.host,uri.port)
    https.use_ssl = true
    req = Net::HTTP::Post.new(uri.path, initheader = {'Content-Type' =>'application/json'})
    req.body = {'query' =>q}.to_json

    res = https.request(req)
    
    return  res.body
    
    
    return  res.body
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

