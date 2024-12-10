// Initialize the map
var map = L.map('map').setView([0, 0], 2); // Centered globally

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch the GeoJSON data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
        // Create a GeoJSON layer
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Determine the size and color based on magnitude and depth
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];
                var radius = magnitude * 3; // Adjust size as needed
                var color = depth > 50 ? 'red' : depth > 20 ? 'orange' : 'green'; // Example color scale

                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
                    color: color,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                // Bind a popup to each marker with additional information
                layer.bindPopup(`
                    <h3>${feature.properties.place}</h3>
                    <hr>
                    <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
                    <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>
                    <p><strong>Time:</strong> ${new Date(feature.properties.time).toLocaleString()}</p>
                `);
            }
        }).addTo(map);

        // Create a legend
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<i style="background: green"></i> 0-20<br>';
            div.innerHTML += '<i style="background: orange"></i> 20-50<br>';
            div.innerHTML += '<i style="background: red"></i> >50<br>';
            return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching the GeoJSON data:', error));