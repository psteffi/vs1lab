// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


// Funktion zum anfordern der MapURL
function mapUrl(lat, long) {//, taglist) {
    console.log("calling mapUrl");
    //var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
    const mapView = document.getElementById('mapView');
    const mapurl = mapM.getMapUrl(lat, long, JSON.parse(mapView.dataset.tags), 16); //taglist, 16);
    mapView.setAttribute("src", mapurl);
}

// Funktion zum rendern der GeoTags
function geotagMap(taglist){
    console.log("calling geotagMap");
    const geotaglist = document.getElementById("discoveryResults");
    // Populate result list
    geotaglist.replaceChildren(...taglist.map((geotag) => {
        let listElement = document.createElement("li");
        listElement.innerHTML = `${geotag.name}, (${geotag.latitude}, ${geotag.longitude}), ${geotag.hashtag}`;
        return listElement;
    }));
    // Populate image element data-* tag
    document.getElementById("mapView").dataset.tags = JSON.stringify(taglist);
    mapUrl(document.getElementById('latitude').value, document.getElementById('longitude').value);
    //mapUrl(...updateLocation());
}

function parseTags() {
    console.log("parseTags()");
    const imageElement = document.getElementById('mapView');
    const taglist_json = imageElement.getAttribute('data-tags');
    return JSON.parse(taglist_json);
}

function renderMap(latitude, longitude) {
    console.log("renderMap");
    const taglist = parseTags();	
    const mapView = document.getElementById('mapView');	
    const mapurl = mapM.getMapUrl(latitude, longitude, taglist, 16);	
    mapView.setAttribute("src", mapurl);
}


function callback(position) {
    console.log("Loading callback(position)");

    document.getElementById('latitude').value = position.latitude;
    document.getElementById('longitude').value = position.longitude;
    document.getElementById('latitudesearch').value = position.latitude;
    document.getElementById('longitudesearch').value = position.longitude;

    //const taglist = parseTags();
    //mapUrl(position.latitude, position.longitude); //, taglist);

    // const taglist = parseTags();	
    // const mapView = document.getElementById('mapView');	
    // const mapurl = mapM.getMapUrl(position.latitude, position.longitude, taglist, 16);	
    // mapView.setAttribute("src", mapurl);

    renderMap(position.latitude, position.longitude);
}


function updateLocation(){
    console.log("Loading updateLocation()");
    var lat = document.getElementById('latitude').value;
    var long = document.getElementById('longitude').value;

    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Locating Device")
        LocationHelper.findLocation(callback);
    } else {
        // }else {
        //     mapUrl(lat, long);
        // }

        //return [lat, long];
        //const taglist = parseTags();
        //mapUrl(position.lat, position.long, taglist);

        renderMap(lat, long);
    }
}

async function taggingHandler(submitEvent) {
    console.log("taggingHandler");
    submitEvent.preventDefault();


    await fetch("/api/geotags", { // api -> REST-api, Steffi
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: document.getElementById("latitude").value,
            longitude: document.getElementById("longitude").value,
            name: document.getElementById("name").value,
            hashtag: document.getElementById("hashtag").value
        })
    });
    
    //updateLocation(await (await fetch("/api/geotags")).json());
    geotagMap(await (await fetch("/api/geotags")).json());
}

async function discoveryHandler(submitEvent) {
    console.log("discoveryHandler");
    submitEvent.preventDefault();

    const lat = document.getElementById("latitudesearch").value;
    const long = document.getElementById("longitudesearch").value;
    const query = document.getElementById("searchterm").value;

    const imageElement = document.getElementById('mapView');

    let url = `/api/geotags?latitude=${lat}&longitude=${long}`;
    
    if (query !== "")
        url += `&searchTerm=${encodeURIComponent(query)}`
    
    console.log(url);
    const response = await fetch(url);
    const responseBody = await response.json();
    console.log(JSON.stringify(responseBody));

    imageElement.setAttribute('data-tags', JSON.stringify(responseBody));
    updateLocation();
    //geotagMap(responseBody);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", taggingHandler);
    document.getElementById("discoveryFilterForm").addEventListener("submit", discoveryHandler);
});

/*
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
*/