$(function() {
  //var points = [];
  //var max = 0;
  //var width = 200;
  //var height = 200;
  //var len = 2;

  //while (len--) {
  //  var val = Math.floor(Math.random()*100);
    // now also with custom radius
  //  var radius = Math.floor(Math.random()*70);

   // max = Math.max(max, val);
   // var point = {
   //   lat: ((Math.floor(Math.random()*height))/(height/180)-90)/-1,
    //  lng: Math.floor(Math.random()*width)/(width/360)-180,
   //   value: Math.random(100)
  //  };

  //  points.push(point);
    
//  }

  //override
  function initMap(points) { 
    console.debug(points);
    // heatmap data format
    var testData = { 
      max: max, 
      data: points 
    };

    var baseLayer = L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 100
      }
    );

    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      "radius": 3,
      "opacity": 0.3,
      "maxOpacity": 0.3 ,
      // scales the radius based on map zoom
      "scaleRadius": false, 
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries 
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'value'
    };

    var heatmapLayer = new HeatmapOverlay(cfg);

    var map = new L.Map('map-container', {
      center: new L.LatLng(6.2630636,-75.5931752),
      zoom: 9,
      layers: [baseLayer, heatmapLayer]
    });

    heatmapLayer.setData(testData);


    var hover = null;
    map.on('mousemove', function(e) {
      var p = e.containerPoint;

      var value = heatmapLayer._heatmap.getValueAt({x: p.x, y: p.y});

      console.debug(value);

      if (hover !== null) {
        map.removeLayer(hover);
        hover = null;
      }

      if (value !== null) {
        console.debug(value);
        map._container.style.cursor = 'pointer';
      } else {
        map._container.style.cursor = 'auto';
      }
    });
  }

  var points = [];
  var max = 0;
  $.ajax('/listings/medellin/value').done(function(data) {
    points = JSON.parse(data); 
    points.map(function(obj) {
    });
    max = data.length;
    initMap(points);
  });

});

