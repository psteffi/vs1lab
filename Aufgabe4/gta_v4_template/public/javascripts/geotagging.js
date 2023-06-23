// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");



function mapUrl(lat, long, taglist) {
    console.log("calling mapUrl");
    var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
    const mapView = document.getElementById('mapView');
    const mapurl = mapM.getMapUrl(lat, long, taglist, 16); //JSON.parse(imageElement.dataset.tags), 16);
    mapView.setAttribute("src", mapurl);
}

function geotagMap(taglist){
    console.log("calling geotagMap");
    const geotaglist = document.getElementById("discoveryResults");
    // Populate result list
    geotaglist.replaceChildren(...taglist.map((geotag) => {
        let listElement = document.createElement("li");
        listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}), ${geotag.hashtag})`;
        return listElement;
    }));
    // Populate image element data-* tag
    document.getElementById("mapView").dataset.tags = JSON.stringify(taglist);
    mapUrl(...updateLocation());
}

// var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
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
    mapUrl(position.latitude, position.longitude, taglist);

}


function updateLocation(){
    console.log("Loading updateLocation()");
    var lat = document.getElementById('latitude').value;
    var long = document.getElementById('longitude').value;

    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Locating Device")
        LocationHelper.findLocation(callback);
    }

    return [lat.value, long.value];
    //const taglist = parseTags();
    //mapUrl(position.lat, position.long, taglist);
}

async function taggingHandler(submitEvent) {
    submitEvent.preventDefault();
    const response = await fetch("/api/geotags", { // api -> REST-api, Steffi
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lat: document.getElementById('latitude').value,
            long: document.getElementById('longitude').value,
            name: document.getElementById('name').value,
            hashtag: document.getElementById('hashtag').value
        })
    });

    if (!response.ok) {
        let errorMessageBox = document.getElementById("failure");
        console.log("failed add attempt");
        errorMessageBox.textContent = "Error while adding Geotag";
        errorMessageBox.style.display = "block";
        return;
    }

    let successMessageBox = document.getElementById("successful");
    successMessageBox.textContent = "GeoTag added";
    console.log("Tag added");
    successMessageBox.style.display = "block";
    setTimeout(() => {
        successMessageBox.style.display = "none";
    }, 6000);

    geotagMap(await (await fetch("/api/geotags")).json());
}

async function discoveryHandler(submitEvent) {
    submitEvent.preventDefault();
    const [lat, long] = updateLocation();
    const query = document.getElementById("searchterm").value;
    let url = `/api/geotags?latitude=${lat}&longitude=${long}`;
    f (query !== "")
        url += `&searchTerm=${encodeURIComponent(query)}`
    const response = await fetch(url);
    const responseBody = await response.json();
    geotagMap(responseBody);
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