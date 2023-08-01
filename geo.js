
const turf = require('@turf/turf');   // I imported the Turf library by using npm install @turf/turf


const m = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-121.9120314, 37.3554002], // starting position [lng, lat]
  zoom: 13 // starting zoom
});

const mapPromise = new Promise((resolve, reject) => {
  m.on('load', function() {
    resolve(m);
      });
    })
    
    const ddlogo = fetch('https://gistcdn.githack.com/DronePhil/d70544e59f7e1fb2a61d7c5f27cc1b81/raw/88d038924d1a4740d1b11f714c78426ea46bc085/dd-logo.geo.json')
      .then((resp) => resp.json()) // Transform the data into json
    
    const poi = fetch('https://gistcdn.githack.com/DronePhil/d70544e59f7e1fb2a61d7c5f27cc1b81/raw/88d038924d1a4740d1b11f714c78426ea46bc085/poi.geo.json')
      .then((resp) => resp.json())
    
    Promise.all([ddlogo, poi, mapPromise])
      .then((datas) => {
    const [logo, points, map] = datas;
    console.log(logo);
    console.log(points);
    
    // mapbox has trouble with the output of the geojson conversion
    logo.features[0].geometry.coordinates.reverse();
    
    map.addLayer({
      "id": "dd-logo",
      "type": "fill",
      "source": {
        "type": "geojson",
        "data": logo
      },
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });
    
    
    map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": points
      },
      "layout": {
        "text-field": "*",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0],
        "text-anchor": "top"
      }
    });
    
  

      // Differentiate points that are inside and outside the logo
      
    points.features.forEach((point) => {
      // Code to check if the point is inside the logo polygon

      const isInsideLogo = turf.booleanPointInPolygon(point.geometry.coordinates, logo.features[0]);

      // Points  inside logo have code blue, and points outside have color code red
      
      map.setPaintProperty('points', 'text-color', isInsideLogo ? '#00f' : '#f00');
    });
  });
