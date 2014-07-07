require 'rubygems'
require 'sinatra'
require 'json'
require 'net/http'
require 'pp'

set :port, '1111'
set :bind, '0.0.0.0'
set :public_folder, './'

get '/' do
	response.headers['Access-Control-Allow-Origin'] = '*'
	File.open( './index.html') do | f |
		f.read
	end
end

post '/elevation' do
    uri = URI(  "http://open.mapquestapi.com/elevation/v1/profile?key=#{ENV['MQ_PASSWORD']}&shapeFormat=raw&latLngCollection=#{params[:latLngCollection]}" )
    req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    
    res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        http.request(req)
    }
    
    return  res.body
end

get '/neo4jGET' do
	response.headers['Access-Control-Allow-Origin'] = '*'
    
    # If a filename parameter is sent, load the corresponding vis_config file
    # If a JSON is sent, insert it as keyframe[0] of an empty vis_config
    if params[:filename] != nil && params[:filename] != ""
        contents = JSON.parse(File.read( "./library/#{params[:filename]}.json" ))
    elsif params[:testjson] != nil && params[:testjson] != ""
        contents = JSON.parse(File.read( './library/empty_vis_config.json' ))
        contents["keyframes"][0] = JSON.parse(params[:testjson])
    else
        return status 400 
    end
    
    # Requests and insert the database responses for each query in the vis_config file. 
    # Preloading ensures that the visualization has no timing hiccups
    contents["keyframes"].each_with_index do | keyframe, i |
        keyframe["queries"].each_with_index do |query, j|
                
                queryresult = execute_query(query["querystring"])
                
                contents["keyframes"][i]["queries"][j]["queryresult"] = JSON.parse(queryresult)
        end
    end
    
    contents.to_json
end

def execute_query(q)
    return status 403 if !verify_querystring(q) # Check for naughty query words...
    
    uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20142.sb02.stations.graphenedb.com:24789/db/data/cypher/" )
    
    req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
    req.body = {'query' =>q}.to_json
    
    res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        http.request(req)
    }
    
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

