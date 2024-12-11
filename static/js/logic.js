// Initialize the map centered around the United States
var map = L.map('map').setView([50, -120], 4); // Centered on the continental US

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
                var color;

                // Adjust color based on depth intervals
            if (depth <= 10) {
                color = 'green';
            } else if (depth <= 30) {
                color = 'limegreen'; // Adjusted to lime green
            } else if (depth <= 50) {
                color = 'lightorange'; // Adjusted to light orange
            } else if (depth <= 70) {
                color = 'orange';
            } else if (depth <= 90) {
                color = 'peach'; // Adjusted to peach
            } else {
                color = 'red';
            }

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
            div.style.backgroundColor = 'white'; // Set background color to white
            div.style.padding = '10px'; // Add some padding
            div.style.borderRadius = '5px'; // Optional: add rounded corners
        div.innerHTML += '<strong>Depth (km)</strong><br>';
        div.innerHTML += '<i style="background: green; width: 20px; height: 20px; display: inline-block;"></i> -10-10<br>';
        div.innerHTML += '<i style="background: limegreen; width: 20px; height: 20px; display: inline-block;"></i> 10-30<br>';
        div.innerHTML += '<i style="background: #FFA07A; width: 20px; height: 20px; display: inline-block;"></i> 30-50<br>'; // Light orange
        div.innerHTML += '<i style="background: orange; width: 20px; height: 20px; display: inline-block;"></i> 50-70<br>';
        div.innerHTML += '<i style="background: #FFDAB9; width: 20px; height: 20px; display: inline-block;"></i> 70-90<br>'; // Peach
        div.innerHTML += '<i style="background: red; width: 20px; height: 20px; display: inline-block;"></i> >90+<br>';
        return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching the GeoJSON data:', error));