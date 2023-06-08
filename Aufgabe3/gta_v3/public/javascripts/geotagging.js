// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var taglist = [];
var taglist_json = JSON.stringify(document.getElementsByName('data-tags'));
taglist.push(JSON.parse(taglist_json));
var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


function callback(position) {
    console.log("Loading callback(position)");
    // var testTags = [{latitude:49.01027, longitude:8.42080, name:"Pub"}];
    // var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


    document.getElementById('latitude').value = position.latitude;
    document.getElementById('longitude').value = position.longitude;
    document.getElementById('latitudesearch').value = position.latitude;
    document.getElementById('longitudesearch').value = position.longitude;

    var mapView = document.querySelector("#mapView");
    var mapurl = mapM.getMapUrl(position.latitude, position.longitude, taglist, 16);
    mapView.setAttribute("src", mapurl);

}


function updateLocation(){


    console.log("Loading updateLocation()");
    // var testTags = [{latitude:49.01027, longitude:8.42080, name:"Pub"}];
    // var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


    var lat = document.getElementById('latitude').value;
    var long = document.getElementById('longitude').value;

    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Locating Device")
        LocationHelper.findLocation(callback);
    }

    var mapView = document.querySelector("#mapView");
    var mapurl = mapM.getMapUrl(lat, long, taglist, 16);
    mapView.setAttribute("src", mapurl);
}


function search() {
    var searchterm = document.getElementById("searchterm");
    for (var i = 0; i < taglist.length; i++) {
        if (taglist[i].getAttribute("name") == searchterm) {
            var mapurl = mapM.getMapUrl(taglist[i].getAttribute("latitude"), taglist[i].getAttribute("longitude"), searchterm, 16);
            mapview.setAttribute("src", mapurl);
        }
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});