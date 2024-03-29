require './app'

use App
use Rack::Static, urls: [''],
  :root => "public",
  :index => 'index.html'

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    []
  ]
}
