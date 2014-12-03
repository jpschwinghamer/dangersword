require 'sinatra'
require "slim"
require "sass"
require "compass"

get '/' do
  slim :index
end
