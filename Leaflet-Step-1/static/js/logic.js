var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>" + feature.properties.mag + " Magnitude</p>");  
  }
  
  function getColor(d) {
    return d > 4    ? '#800026' :
           d > 3    ? '#BD0026' :
           d > 2.5    ? '#E31A1C' :
           d > 2    ? '#FC4E2A' :
           d > 1.5    ? '#FD8D3C' :
           d > 1  ? '#FEB24C' :
           d > 0.5 ? '#FED976' :
                      'FFEDA0';
};

  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData,  {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 5,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
          });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Create our map, giving it the map and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  function getColor(d) {
    return d > 4    ? '#800026' :
           d > 3    ? '#BD0026' :
           d > 2.5  ? '#E31A1C' :
           d > 2    ? '#FC4E2A' :
           d > 1.5  ? '#FD8D3C' :
           d > 1    ? '#FEB24C' :
           d > 0.5  ? '#FED976' :
                      'FFEDA0';
};

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}