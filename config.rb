require 'compass/import-once/activate'
require 'autoprefixer-rails'

http_path = "/"
css_dir = "public/stylesheets"
sass_dir = "sass"
images_dir = "public/images"
javascripts_dir = "public/javascripts"

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    io << AutoprefixerRails.process(css)
  end
end
