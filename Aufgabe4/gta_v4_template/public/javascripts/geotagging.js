// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
const searchButton = document.getElementById('submitGeoTag');


function parseTags() {
    var taglist = [];
    const imageElement = document.getElementById('mapView');
    const taglist_json = imageElement.getAttribute('data-tags');
    return JSON.parse(taglist_json);
}

function callback(position) {
    console.log("Loading callback(position)");


    document.getElementById('latitude').value = position.latitude;
    document.getElementById('longitude').value = position.longitude;
    document.getElementById('latitudesearch').value = position.latitude;
    document.getElementById('longitudesearch').value = position.longitude;

    const taglist = parseTags();
    const mapView = document.getElementById('mapView');
    const mapurl = mapM.getMapUrl(position.latitude, position.longitude, taglist, 16);
    mapView.setAttribute("src", mapurl);

}


function updateLocation(){


    console.log("Loading updateLocation()");


    var lat = document.getElementById('latitude').value;
    var long = document.getElementById('longitude').value;

    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Locating Device")
        LocationHelper.findLocation(callback);
    }

    const taglist = parseTags();
    const mapView = document.getElementById('mapView');
    const mapurl = mapM.getMapUrl(lat, long, taglist, 16);
    mapView.setAttribute("src", mapurl);
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
