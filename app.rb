require 'sinatra'


class App < Sinatra::Base
  set :listings_world_density,    File.open('./world_density.json').read
  set :listings_world_value,      File.open('./world_value.json').read
  set :listing_medellin_density,  File.open('./medellin_density.json').read
  set :listings_medellin_value,   File.open('./medellin_value.json').read

  # /listings/world/density
  # /listings/word/value
  # /listings/medellin/density
  # /listings/method/value
  get '/listings/:place/:type' do
    method = "listings_#{params[:place]}_#{params[:type]}"
    if settings.respond_to?(method)
      settings.send(method.to_sym)
    else
      status 404
      "Not found"
    end
  end
end
