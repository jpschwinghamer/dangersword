require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"

get '/' do
  slim :index
end

post '/update.json' do
  scores = params[:data]
  File.open("public/scores.json","w") do |f|
    f.write(scores)
  end
end

get '/scores' do
    content_type :json
    File.read('public/scores.json')
end
