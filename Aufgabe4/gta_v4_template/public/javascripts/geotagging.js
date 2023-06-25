// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

//--- Pagination Start ---//

const resultPageLength = 8;

//--- Pagination End ---//


var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");


function parseTags() {
    console.log("parseTags()");
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

    //--- handle empty list ---//
    if (taglist.length == 0) {
    //erstelle ein Listenelement//
        const noResultsMessage = document.createElement("li");
        //Inhalt des neuen Listenelements//
        noResultsMessage.innerHTML = "No results.";
        //ersetze die bisherige Liste durch die neue (also die noResultsMessage)//
        geotaglist.replaceChildren(noResultsMessage);
        //Ausnahmefall: es gibt 0 Seiten//
        document.getElementById("pageNumber").innerHTML = "0 / 0";
    } else {
        //fülle die Liste mit entsprechenden und zutreffenden GeoTags (Inhalt: ihre Attribute)//
        geotaglist.replaceChildren(...taglist.map((geotag) => {
            let listElement = document.createElement("li");
            listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag}`;
            return listElement;
        }));
    }

    const mapView = document.getElementById("mapView");
    mapView.setAttribute("data-tags", JSON.stringify(taglist));
    updateURL(document.getElementById("latitude").value, document.getElementById("longitude").value);
}


//--- Tagging handling ---//
async function taggingHandler(submitEvent) {
    console.log("taggingHandler");
    // dafür da, dass nicht in '/tagging' geladen wird //
    submitEvent.preventDefault();
    
    //erwarte ein POST auf /api/geotags//
    await fetch("/api/geotags", {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },

        body : JSON.stringify({
            latitude : document.getElementById("latitude").value,
            longitude : document.getElementById("longitude").value,
            name : document.getElementById("name").value,
            hashtag : document.getElementById("hashtag").value
        })
    });

    //--- Startwert: 0, neue Anfrage: true ---//
    loadGeoTags(0, true);
}


//--- Discovery handling ---//
async function discoveryHandler(submitEvent) {
    console.log("discoveryHandler");
    // dafür da, dass nicht in '/discovery' geladen wird //
    submitEvent.preventDefault();

    //--- Startwert: 0, neue Anfrage: true ---//
    loadGeoTags(0, true);
}


//--- Pagination Start ---//

//--- URl erstellen, die die Seiten implementiert ---//
//--- limit = -1 : letztes Element im Array ---//
//--- 0 und -1 sind default Werte, falls nichts angegeben wird ---//
function getUrlForPages(start = 0, limit = -1) {
    console.log("getUrlForPages");
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const query = document.getElementById("searchterm").value;

    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;

    //--- wenn die query nicht leer ist, soll der searchterm angehängt werden ---//
    if (query != "") {
        url += `&searchterm=${encodeURIComponent(query)}`;
    }

    //--- an die url soll der Startwert "start" angehängt werden ---//
    url += `&start=${start}`;
    if (limit != -1) {
    //--- weicht der Endwert "limit" vom Default "-1" (also letztes Element in der Liste) ab, soll dieser auch hinzugefügt werden ---//
        url += `&limit=${limit}`;
    }

    return url;
}

//--- isNewQuery default = false ---//
async function loadGeoTags(pageNumber, isNewQuery = false) {
    console.log("loadGeoTags");
    let nextPageBtn = document.getElementById("nextPage");
    let prevPageBtn = document.getElementById("prevPage");
    let resultList = document.getElementById("discoveryResults");
    let currentPage = document.getElementById("pageNumber");

    //berechne den Grenzwert an Listenelementen//
    const start = pageNumber * resultPageLength;
    const url = getUrlForPages(start, resultPageLength);

    if (isNewQuery) {
        resultList.dataset.pageCount = await calcPageNumber(url);
    }

    //pageNumber = 0 / Anzahl an benötigten Seiten (berechnet in calcPageNumber)//
    currentPage.innerHTML = `${pageNumber + 1} / ${resultList.dataset.pageCount}`;

    //klickt man auf den previous Button, wird die pageNumber um 1 erniedrigt//
    prevPageBtn.dataset.page = pageNumber - 1;
    //dieser Button soll disabled werden, wenn die aktuelle pageNumber 0 ist (ist man auf Seite 1, soll dieser Button nicht verwendbar sein)//
    prevPageBtn.disabled = pageNumber == 0;

    //klickt man auf den next Buttton, wird die pageNumber um 1 erhöht//
    nextPageBtn.dataset.page = pageNumber + 1;
    //dieser Button soll disabled werden, wenn die aktuelle pageNumber der maximal benötigten Anzahl der Seiten oder mehr entspricht (ist man auf Seite x/x, soll dieser Button nicht verwendbar sein !auch bei 0/0 daher >=)//
    nextPageBtn.disabled = pageNumber >= resultList.dataset.pageCount - 1;

    //erwarte die URL der pageNumber (die Tags auf dieser Seite sollen auf der Karte angezeigt werden)//
    renderGeoTags(await (await fetch (url)).json());
}

//--- berechne die benötigte Anzahl an Seiten, um alle GeoTags darstellen zu können ---//
async function calcPageNumber(url) {
    console.log("calcPageNumber");
    //teile die URL auf in die query-Parameter und seinen Wert (Stelle 0)//
    return fetch(url.split("&limit=")[0])
        //gib das als JSON zurück//
        .then(resp => resp.json()
            //berechne die Anzahl an benötigten Seiten (aufrunden)//
            //Bsp.: body.length = 28; resultPageLength = 8; 28/8 = 3.5, also 4 → man braucht 4 Seiten//
            .then(body => Math.ceil(body.length / resultPageLength)));
}

//--- Pagination End ---//



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", taggingHandler);
    document.getElementById("discoveryFilterForm").addEventListener("submit", discoveryHandler);

    //--- Pagination Buttons ---//
    document.getElementById("nextPage").addEventListener("click", e => loadGeoTags(parseInt(e.currentTarget.dataset.page)));
    document.getElementById("prevPage").addEventListener("click", e => loadGeoTags(parseInt(e.currentTarget.dataset.page)));
    loadGeoTags(0, true);
});
