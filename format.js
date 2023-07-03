var map = L.map('map').setView([1.14949, 122.2940], 5);
// console.log(map)
// base layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})


let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
let googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

let baseMaps = {
    "Street Map": street,
    // "Topographic Map": topo,
    "googleHybrid": googleHybrid
};

// set streetmap as default layer:
googleHybrid.addTo(map);

function getMarkerRadius(mag) {
    const scalingFactor = 5;

    return (Math.sqrt(mag) * scalingFactor);
}
// #F0A36B
function getColor(mag) {
    if (mag >= 10) {
        return '#800000';
    } else if (mag >= 8) {
        return '#b22222';
    } else if (mag >= 6) {
        return '#DD2555';
    } else if (mag >= 4) {
        return '#ff4500';
    } else if (mag >= 2) {
        return '#ff6347';
    } else if (mag >= 1) {
        return '#f08080';
    } else { return '#ffa07a' };
}



let i = 0
var storedDataString = localStorage.getItem(i);
const storedData = JSON.parse(storedDataString);
console.log(storedData)


function createFeatures() {

    let earthquakes = L.geoJSON(storedData, {
        pointToLayer: function (feature, latlng) {
            //Define  magnitude and place for circleMarker
            const magnitude = feature.properties.magnit;
            const place = feature.properties.region;
            const dateString = feature.properties.date;
            // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeString = feature.properties.time;


            console.log(timeString.toString())
            // console.log(dateString.toLocaleDateString("en-US", options));
            // console.log(dateString.strptime())

            const circleMarkerStyle = {
                radius: getMarkerRadius(magnitude),
                fillColor: getColor(magnitude),
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            };

            const information = `
                    
            <h4>${magnitude} Magnitude </h4><hr/> 
            <p>${place}</p>
            <p>${dateString} ${timeString}</p>`;
            const quakeMarker = L.circleMarker(latlng, circleMarkerStyle);
            quakeMarker.bindPopup(information);
            return quakeMarker;
        }
    });

    // Right Bottom Table
    function createTables() {
        const tableInfo = L.control({ position: 'bottomright' });
        tableInfo.onAdd = function () {
            // Create a div element 
            const div = L.DomUtil.create('div', 'tableInfo');
            div.style.backgroundColor = 'white';
            div.style.padding = '5px';
            div.style.borderRadius = '5px';
            div.style.border = "1px solid black";
            div.style.opacity = '0.9';




            // Table information (colors and ranges)
            div.innerHTML = `
          <div style="background-color: white; padding: 10px; border: 1px solid black;">
            <strong>Magnitude of Earthquake</strong><br>
            <table>
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #ffa07a;"></div></td>
                <td>&lt;1</td>
              </tr>
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #f08080;"></div></td>
                <td>1-2</td>
              </tr>
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #ff6347;"></div></td>
                <td>2-4</td>
              </tr>
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #ff4500;"></div></td>
                <td>4-6</td>
              </tr>
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #DD2555;"></div></td>
                <td>6-8</td>
              </tr>
              <tr>
              <td><div style="width: 20px; height: 20px; background-color: #b22222;"></div></td>
              <td>8-10</td>
            </tr>
              
              <tr>
                <td><div style="width: 20px; height: 20px; background-color: #800000;"></div></td>
                <td> &gt;10</td>
              </tr>
            </table>
          </div>
          `;

            return div;
        };
        tableInfo.addTo(map);
    }

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    earthquakes.addTo(map)
    createTables()

}

createFeatures()