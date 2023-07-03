
fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json')
    .then(response => response.json())
    .then(data => {

        var geojsonData = convertToGeoJSON(data.Infogempa.gempa);
        // console.log(geojsonData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


function convertToGeoJSON(data) {
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };

    // Assuming the data is an array of objects, each representing a geographic feature
    data.forEach(item => {
        let Time = item.Jam
        let region = item.Wilayah
        let magnitude = item.Magnitude
        let lati = JSON.parse((item.Lintang).slice(0, 5))
        let longi = JSON.parse((item.Bujur).slice(0, 5))
        // localStorage.setItem(lati)
        const feature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [longi, lati] // Assuming your data has latitude and longitude properties
            },
            properties: {
                // Add additional properties as needed
                DateTime: item.DateTime,
                date: item.Tanggal,
                time: item.Jam,
                region: item.Wilayah,
                address: item.Wilayah,
                description: item.Dirasakan,
                title: item.Dirasakan,
                magnit: magnitude,
            }

        };

        geojson.features.push(feature);
    });
    const geojsonString = JSON.stringify(geojson);
    // console.log(geojsonString)
    let i = 0;
    localStorage.setItem(i, geojsonString)
    return geojson;
}

// (module.exports = convertToGeoJSON)



