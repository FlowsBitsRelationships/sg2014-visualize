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

get '/vis_config' do
	response.headers['Access-Control-Allow-Origin'] = '*'
	File.open( './library/sample_vis_config.json') do | f |
		f.read
	end
end

post '/cypher' do
    response.headers['Access-Control-Allow-Origin'] = '*'
    uri = URI( "http://#{ENV['DB_USERNAME']}:#{ENV['DB_PASSWORD']}@sg20142.sb02.stations.graphenedb.com:24789/db/data/cypher/" )
    
    req = Net::HTTP::Post.new(uri, initheader = {'Content-Type' =>'application/json'})
    req.basic_auth ENV['DB_USERNAME'],ENV['DB_PASSWORD']
    req.body = {'query' =>params[:querystring]}.to_json
    
    res = Net::HTTP.start(uri.hostname, uri.port) {|http|
        http.request(req)
    }
    
    res.body
end