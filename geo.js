/* 
# Instructions

### The boilerplate introduces a few working chunks:

- fork of a demo repo demonstrating a simple mapbox map.
- the source is intended to get you up and running quickly for the code challenge
- you shouldn't need to be a mapping expert to complete the challenge
- files loaded at runtime contain geometries for the dronedeploy logo and the points of interest
- both files are in the common geojson format that DroneDeploy works with frequently
- both files are simple 2d polygonal geometry represented as geojson in the shape of the DroneDeploy logo, and a set of points of interest.

### Your assignment is to:
- write some code that differentiates between POI's that are "inside" the logo (meaning they are located in a blue region) and points that are outside
- both should be displayed on the map, but they should be displayed in different colors.
- your code needs to differentiate between "inside" and "outside" for arbitrary points.
- write out any comments if you are unable to complete this challenge
- show off your ability in quickly orienting yourself in unfamiliar code and documentation
- implement solution in modern Javascript

To evaluate the challenge we'll trade out the POIs for a different file, you can use third party libraries.  

You are welcome to improve the code of the challenge in any way that you like, but we hope that this exercise will be a reasonable 1hr to 2hr challenge or so. 

Please let us know if you have any questions!

*/
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
      // Check if the point is inside the logo polygon
      const isInsideLogo = turf.booleanPointInPolygon(point.geometry.coordinates, logo.features[0]);

      // Change the color based on whether the point is inside or outside the logo
      map.setPaintProperty('points', 'text-color', isInsideLogo ? '#00f' : '#f00');
    });
  });
