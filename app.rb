require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"

# helpers do
#   def ds_players
#     {
#       title: "Testing",
#       players: [
#         {
#           name: "Ty",
#           score: 0
#         },
#         {
#           name: "Dave",
#           score: 0
#         },
#         {
#           name: "Justin",
#           score: 0
#         }
#       ]
#     }
#   end
# end

get '/' do
  slim :index
end

get '/update-score' do
  test = params[:name]
  File.open("public/scores.json","w") do |f|
    f.write(test.to_json)
  end
end

get '/get-score' do
  content_type :json
  File.read('public/scores.json')
end
