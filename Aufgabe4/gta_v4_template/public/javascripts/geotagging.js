// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


function parseTags() {
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

    updateURL(position.latitude, position.longitude);

}


function updateLocation(){
    console.log("Loading updateLocation()");

    var lat = document.getElementById("latitude").value;
    var long = document.getElementById("longitude").value;

    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Locating Device")
        LocationHelper.findLocation(callback);
    } else {
        updateURL(lat, long);
    }
}



//--- aktualisiere die map URL ---//
function updateURL(latitude, longitude) {
    console.log("updateURL");
    const taglist = parseTags();
    const mapurl = mapM.getMapUrl(latitude, longitude, taglist, 16);
    const mapView = document.getElementById("mapView");
    mapView.setAttribute("src", mapurl);
}



//--- GeoTags rendern ---//
function renderGeoTags(taglist) {
    console.log("calling 'renderGeoTags'");
    const geotaglist = document.getElementById("discoveryResults");

    //fülle die Liste mit entsprechenden und zutreffenden GeoTags (Inhalt: ihre Attribute)//
    geotaglist.replaceChildren(...taglist.map((geotag) => {
        let listElement = document.createElement("li");
        listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag}`;
        return listElement;
    }));

    const mapView = document.getElementById("mapView");
    mapView.setAttribute("data-tags", JSON.stringify(taglist));
    //aktualisiere die Map URL//
    updateURL(document.getElementById("latitude").value, document.getElementById("longitude").value);
}


//--- Tagging handling ---//
async function taggingHandler(submitEvent) {
    // dafür da, dass nicht in '/tagging' geladen wird //
    submitEvent.preventDefault();
    
    //erwarte ein POST auf /api/geotags//
    await fetch("/api/geotags", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            latitude : document.getElementById("latitude").value,
            longitude : document.getElementById("longitude").value,
            name : document.getElementById("name").value,
            hashtag : document.getElementById("hashtag").value
        })
    });

    //zeige auch den neuen GeoTag an (erwarte ein JSON Objekt von /api/geotags)//
    renderGeoTags(await (await fetch ("/api/geotags")).json());
}


//--- Discovery handling ---//
async function discoveryHandler(submitEvent) {
    // dafür da, dass nicht in '/discovery' geladen wird //
    submitEvent.preventDefault();

    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const query = document.getElementById("searchterm").value;

    //in der query der URL stehen die latitude und longitude Attribute//
    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;

    //falls die query nicht leer ist, soll auch der searchterm zur url angefügt werden//
    if (query != "") {
        url += `&searchterm=${encodeURIComponent(query)}`;
    }

    //erwarte eine URL//
    const response = await fetch(url);
    //erwarte die responses nun als JSON Objekt//
    const responseBody = await response.json();

    const mapView = document.getElementById("mapView");
    //aktualisiere die Karte anhand des reponseBodys als mapurl//
    mapView.setAttribute("data-tags", JSON.stringify(responseBody));
    updateLocation();
}




// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", taggingHandler);
    document.getElementById("discoveryFilterForm").addEventListener("submit", discoveryHandler);
});
