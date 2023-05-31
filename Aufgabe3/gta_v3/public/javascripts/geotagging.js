console.log("The geoTagging script is going to start...");
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

//Import von location-helper.js und map-manager.js notwendig!!!!

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
var testTags = [{latitude:49.014949, longitude:8.391252, name:"P"}, 
                {latitude:49.014566, longitude:8.393976, name:"Mensa"}, 
                {latitude:49.015020, longitude:8.388938, name:"LI"}];

function updateLocation(){
    
    //Element im html Dokument suchen
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const latitudesearchElement = document.getElementById('latitudesearch');
    const longitudesearchElement = document.getElementById('longitudesearch');

    LocationHelper.findLocation(function callback(position) {
        //code der aufgerufen wird nachdem die location api gelaufen ist

        //aus dem position element den wert auslesen und anschliesend in das html element eintragen
        latitudeElement.setAttribute('value', position.latitude);
        longitudeElement.setAttribute('value', position.longitude);
        latitudesearchElement.setAttribute('value', position.latitude);
        longitudesearchElement.setAttribute('value', position.longitude);
        var lat = position.latitude;
        var long = position.longitude;
        var mapurl = mapM.getMapUrl(lat, long, testTags, 16);
        var mapView = document.querySelector("#mapView");
        mapView.setAttribute("src", mapurl);

    });

}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});