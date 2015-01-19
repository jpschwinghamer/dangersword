require "sinatra"
require "sinatra/activerecord"
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"
require "open-uri"
require "chronic"
require './environments'
require './models'

set :bind, '0.0.0.0'

get '/' do
  slim :index
end

post '/' do
  @score = Score.create(params[:data])
end

post '/players/create' do
  @player = Player.create(params[:data])
end

get '/scores' do
  scoreboard = []
  players = Player.all
  players.each do |player|
    player_stats = {}
    this_player = Score.joins(:player).where("players.name = ? AND scores.created_at > ?", "#{player.name}", Chronic.parse('last sunday').to_s)
    player_stats["id"] = player.id
    player_stats["name"] = player.name
    player_stats["scores"] = this_player.order(created_at: :desc).pluck(:points)
    player_stats["average"] = this_player.average(:points).to_f.round(2)
    player_stats["count"] = this_player.count.to_i
    scoreboard << player_stats
  end
  sorted = scoreboard.sort_by{ |k| k["average"] }.reverse
  sorted.to_json
end

get '/scores/:id' do
  scores = Score.joins(:player).where("players.id = '#{params[:id]}'").order(created_at: :desc)
  scores.to_json
end

post '/scores/delete/:id' do
  @score = Score.find(params[:id]).destroy
end

