// Create the map object
var myMap = L.map('map', {
  center: [40.7, -94.5],
  zoom: 5,
  // layers: [street, mortality]
});

// Add the tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//read in data from api link
//const url = "http://127.0.0.1:5000/topcause";
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the JSON data and console log it
d3.json(earthquakesURL).then(function(earthquakeData) {
  // Determine the marker size by magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  };

  // Determine the marker color by depth
  function chooseColor(depth) {
    switch (true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "lightgreen";
    }
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,
        // Set the style of the markers based on properties.mag
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
        + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(myMap);

  // Create and add legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});