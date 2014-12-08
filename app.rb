require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"

SCORES_PATH = File.expand_path("public/scores.json", File.dirname(__FILE__))

def initialize
  FileUtils.cp("public/default_scores.json", 'public/scores.json') unless File.exist?(SCORES_PATH)
  @scores = File.read(SCORES_PATH)
end

get '/' do
  slim :index
end

post '/update.json' do
  scores = params[:data]
  @scores = scores
  file = Tempfile.new('scores.json')
  begin
    file.write(scores)
    file.rewind
    file.read
    src = file.path
    dest = SCORES_PATH
    FileUtils.cp(src, dest)
  ensure
    file.close
    file.unlink
  end
end

get '/scores' do
  content_type :json
  @scores
end
