require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"
require 'open-uri'

SCORES_PATH = File.expand_path("public/scores.json", File.dirname(__FILE__))

if development?
  url = "http://www.dangersword.com/scores.json"
  open(url, 'rb') do |feed|
    File.open(SCORES_PATH, 'wb') do |file|
      file.write(feed.read)
    end
  end
end


get '/' do
  slim :index
end

post '/update.json' do
  scores = params[:data]
  return if scores.empty?
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
