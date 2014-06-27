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


get '/vis_config' do
	response.headers['Access-Control-Allow-Origin'] = '*'
    contents = JSON.parse(File.read( './library/sample_vis_config.json' ))
    
    # Requests and insert the database responses for each query in the vis_config file. 
    # Preloading ensures that the visualization has no timing hiccups
    contents["keyframes"].each_with_index do | keyframe, i |
        keyframe["queries"].each_with_index do |query, j|
                
                queryresult = execute_query(query["querystring"])
                # uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20142.sb02.stations.graphenedb.com:24789/db/data/cypher/" )
    
                # req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
                # req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
                # req.body = {'query' =>query["querystring"]}.to_json
                
                # res = Net::HTTP.start(uri.hostname, uri.port) {|http|
                    # http.request(req)
                # }
                
                contents["keyframes"][i]["queries"][j]["queryresult"] = JSON.parse(queryresult)
        end
    end
    contents.to_json
end

post '/cypher' do
    response.headers['Access-Control-Allow-Origin'] = '*'
    status 403 if !verify_querystring(params[:querystring]) 
    
    queryresult = execute_query(params[:querystring])
    # uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20142.sb02.stations.graphenedb.com:24789/db/data/cypher/" )
    
    # req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    # req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
    # req.body = {'query' =>params[:querystring]}.to_json
    
    # res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        # http.request(req)
    # }
    # res.body
    queryresult
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

