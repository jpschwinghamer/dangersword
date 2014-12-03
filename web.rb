require 'sinatra'
require "slim"
require "sass"
require "compass"
require "autoprefixer-rails"

get '/' do
  slim :index
end
