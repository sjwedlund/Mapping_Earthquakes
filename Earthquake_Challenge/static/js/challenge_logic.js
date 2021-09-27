// Add console.log to see if our code is working.
console.log("Console is working");

// Tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', { //We assign the tileLayer() method, as shown in the Quick Start Guide’s “Setting up the map” section to the variable streets. Leaflet doesn't provide a tile layer. Instead, it offers various tile layer APIs.
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	// id: 'mapbox.streets', //We add the id attribute and assign it mapbox.streets, which will show the streets on the map.
	accessToken: API_KEY
});

// Dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Satellite view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Base layer that holds both maps.
let baseMaps = {
    'Streets': streets,
    'Dark': dark,
    'Satellite': satelliteStreets
  };

  // Earthquake layer for our map.
let earthquakes = new L.layerGroup();

// Tectonic plate lines layer for our map:
let tectonic = new L.layerGroup();

// Add a 3rd layer group for the major earthquake data.
let majorEarthquakes = new L.LayerGroup();

// Define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    'Earthquakes': earthquakes,
    'Tectonic Plates': tectonic,
    'Major Earthquakes': majorEarthquakes
  };

  // Map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
})

// Add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing past 7 days earthquake data:
let last7EQ = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let tectonicplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
        return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
        };
    }

    // This function determines the color of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
        return "#ea2c2c";
        }
        if (magnitude > 4) {
        return "#ea822c";
        }
        if (magnitude > 3) {
        return "#ee9c00";
        }
        if (magnitude > 2) {
        return "#eecc00";
        }
        if (magnitude > 1) {
        return "#d4ee00";
        }
        return "#98ee00";
    }

    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }
   
d3.json(last7EQ).then(function(data) {
    console.log(data);  

    L.geoJson(data, {
        // Turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
          },
        // Set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
        // Popup for each circleMarker to display the magnitude and
        //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(earthquakes);

    // Legend control object.
    let legend = L.control({
      position: "bottomright"
    });

    // Details for legend.
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");

      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];

      // Looping through our intervals to generate a label with a colored square for each interval.
      for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
      }
      return div;
};

legend.addTo(map);

    earthquakes.addTo(map);

}); // ends D3 call for earthquake data

d3.json(tectonicplates).then(function(data) {

  L.geoJson(data).addTo(tectonic);

  tectonic.addTo(map);

}); // ends D3 call for tectonic plates