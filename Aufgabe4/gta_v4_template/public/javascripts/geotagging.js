// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


function parseTags() { //"mapUrl"
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

    //return [lat, long];
}


//------------------ neu ------------------//

//--- aktualisiere die map URL ---//

function updateURL(latitude, longitude) { //"renderMap"
    console.log("updateURL");
    const taglist = parseTags();
    const mapurl = mapM.getMapUrl(latitude, longitude, taglist, 16);
    const mapView = document.getElementById("mapView");
    mapView.setAttribute("src", mapurl);
}



//--- GeoTags rendern ---//

function renderGeoTags(taglist) { //"geotagMap"
    console.log("calling 'renderGeoTags'");
    const geotaglist = document.getElementById("discoveryResults");

    //fill the list//
    geotaglist.replaceChildren(...taglist.map((geotag) => {
        let listElement = document.createElement("li");
        listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag}`;
        return listElement;
    }));

    const mapView = document.getElementById("mapView");
//--- Tags werden direkt auf der Karte angezeigt ---//
//--- → Fehler: benutze setAttribute statt getAttribute = taglist ---//
    mapView.setAttribute("data-tags", JSON.stringify(taglist));

    updateURL(document.getElementById("latitude").value, document.getElementById("longitude").value);
}


//--- Tagging handling ---//
//------ Seite muss neu geladen werden, sodass der GeoTag auf der Karte auftaucht ------//
//------ in der Liste taucht er direkt auf ------//
//------ neuer GeoTag taucht aber im VS Code Terminal direkt auf ------//
//------ → das Aktualisieren der Karte allein funktioniert nicht richtig (?) ------//
async function taggingHandler(submitEvent) {
    // dafür da, dass nicht in '/tagging' geladen wird //
    submitEvent.preventDefault();
    
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

    renderGeoTags(await (await fetch ("/api/geotags")).json());
}


//--- Discovery handling ---//
//------ Suche wird überhaupt nicht ausgeführt ------//
//------ also man kann auf den Button / Enter klicken, aber es passiert GAR nichts ------//
async function discoveryHandler(submitEvent) {
    // dafür da, dass nicht in '/discovery' geladen wird //
    submitEvent.preventDefault();

    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const query = document.getElementById("searchterm").value;

    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;

    if (query != "") {
        url += `&searchterm=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    const responseBody = await response.json();
    //renderGeoTags(responseBody);

    const mapView = document.getElementById("mapView");
    mapView.setAttribute("data-tags", JSON.stringify(responseBody));
    updateLocation();
}




// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", taggingHandler);
    document.getElementById("discoveryFilterForm").addEventListener("submit", discoveryHandler);
});
