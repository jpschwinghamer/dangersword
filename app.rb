require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"
require "json"

SCORES_PATH = "public/scores.json"

get '/' do
  slim :index
end

post '/update.json' do
  scores = params[:data]
  file = Tempfile.new('scores.json')
  begin
    file.write(scores)
    file.rewind
    file.read
    src = file.path
    dest = File.expand_path(SCORES_PATH, File.dirname(__FILE__))
    FileUtils.cp(src, dest)
  ensure
    file.close
    file.unlink
  end
end

  # File.open("public/scores.json","w") do |f|
  #   f.write(scores)
  # end
# end

get '/scores' do
    content_type :json
    File.read(SCORES_PATH)

end
