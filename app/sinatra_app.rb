require 'rubygems'
require 'sinatra'
require 'json'
require 'net/http'

set :port, '1111'
set :bind, '0.0.0.0'
set :public_folder, './'

get '/' do
	response.headers['Access-Control-Allow-Origin'] = '*'
	File.open( './index.html') do | f |
		f.read
	end
end

get '/cypher' do
    printf "CALLING NEO4J!**********************************************************************"
    response.headers['Access-Control-Allow-Origin'] = '*'
    uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20141.sb02.stations.graphenedb.com:24789/db/data" )
    
    printf( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20141.sb02.stations.graphenedb.com:24789/db/data")
    req = Net::HTTP::Get.new(uri, initheader = {'Content-Type' =>'application/json'})
    req.basic_auth 'sg2014_1', 's1YKo1Xbm62wn9uIcrR6'
    
    res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        http.request(req)
    }
    
    res.body
end

# post '/cypher' do
    # response.headers['Access-Control-Allow-Origin'] = '*'
    # uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20141.sb02.stations.graphenedb.com:24789/db/data/cypher" )
    
    # req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    # req.basic_auth 'sg2014_1', 's1YKo1Xbm62wn9uIcrR6'
    # req.body = {'query' =>params[:query]}.to_json
    
    # res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        # http.request(req)
    # }
    
    # res.body
# end