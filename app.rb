require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"

get '/' do
  slim :index
end

get '/scores.json' do
  content_type :json
  { :key1 => 'value1', :key2 => 'value2' }.to_json
end
