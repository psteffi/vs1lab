// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


console.log("The geoTagging script is going to start...");

var mapM = new MapManager("BvSIZ5qQ0kchef3XsC2M3bhrzefd11vE");
const searchButton = document.getElementById('submitGeoTag');

const RESULT_PAGE_LENGTH = 8;


function parseTags() {
    var taglist = [];
    const imageElement = document.getElementById('mapView');
    const taglist_json = imageElement.getAttribute('data-tags');
    return JSON.parse(taglist_json);
}

// function callback(position) {
//     console.log("Loading callback(position)");


//     document.getElementById('latitude').value = position.latitude;
//     document.getElementById('longitude').value = position.longitude;
//     document.getElementById('latitudesearch').value = position.latitude;
//     document.getElementById('longitudesearch').value = position.longitude;

//     const taglist = parseTags();
//     const mapView = document.getElementById('mapView');
//     const mapurl = mapM.getMapUrl(position.latitude, position.longitude, taglist, 16);
//     mapView.setAttribute("src", mapurl);

// }

// Paging

async function calculatePageCount(url) {
    return fetch(url.split("&limit=")[0])
        .then(resp => resp.json()
            .then(body => Math.ceil(body.length / RESULT_PAGE_LENGTH)));
}

function generateUrl(startIndex = 0, limit = -1) {
    const [latitude, longitude] = updateLocation();
    const query = document.getElementById("searchterm").value;
    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;
    if (query !== "")
        url += `&searchTerm=${encodeURIComponent(query)}`;
    url += `&start=${startIndex}`;
    if (limit !== -1)
        url += `&limit=${limit}`;

    return url;
}

function renderGeotags(taglist) {
    const geotagList = document.getElementById("discoveryResults");
    if (taglist.length == 0) {
        // Handle an empty taglist (= no search results)
        let elem = document.createElement("li");
        elem.innerHTML = "No results.";
        geotagList.replaceChildren(elem);
        document.getElementById("pageNumber").innerHTML = "0 / 0";
    } else {
        // Populate result list
        geotagList.replaceChildren(...taglist.map(geotag => {
            let listElement = document.createElement("li");
            listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag})`;
            return listElement;
        }));
    }
    // Populate image element data-* tag
    document.getElementById("mapView").dataset.tags = JSON.stringify(taglist);
    renderMap(...updateLocation())
}

function renderMap(latitude, longitude) {
    let imageElement = document.getElementById("mapView");
    imageElement.src = mapM.getMapUrl(latitude, longitude, JSON.parse(imageElement.dataset.tags), 14);
}

async function handleTaggingForm(submitEvent) {
    submitEvent.preventDefault();
    const response = await fetch("/api/geotags", {
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

    loadGeotags(0, true);
}

async function handleDiscoveryForm(submitEvent) {
    submitEvent.preventDefault();
    loadGeotags(0, true);
}


async function loadGeotags(pageNumber, isNewQuery = false) {
    let nextPageButton = document.getElementById("paginationNext");
    let prevPageButton = document.getElementById("paginationPrev");
    let resultList = document.getElementById("discoveryResults");
    let pageNumberElem = document.getElementById("pageNumber");
    const startIndex = pageNumber * RESULT_PAGE_LENGTH;
    const url = generateUrl(startIndex, RESULT_PAGE_LENGTH);

    // Only update the page count when processing a new form submission or first page load
    // to prevent unnecessary API requests
    if (isNewQuery)
        resultList.dataset.pageCount = await calculatePageCount(url);

    // Update the current / total page counter
    pageNumberElem.innerHTML = `${pageNumber + 1} / ${resultList.dataset.pageCount}`;

    prevPageButton.dataset.page = pageNumber - 1;
    prevPageButton.disabled = pageNumber <= 0;

    nextPageButton.dataset.page = pageNumber + 1;
    nextPageButton.disabled = pageNumber >= resultList.dataset.pageCount - 1;

    renderGeotags(await (await fetch(url)).json());
}

function callback(location) {
    document.getElementById("latitude").value = location.latitude;
    document.getElementById("longitude").value = location.longitude;
   document.getElementById("latitudesearch").value = location.latitude;
   document.getElementById("longitudesearch").value = location.longitude;
   renderMap(location.latitude, location.longitude);
}

function updateLocation() {
   let latElem = document.getElementById("latitude");
   let lonElem = document.getElementById("longitude");
   let lat = latElem.value;
   
   if (lat === undefined || lat === "" || lat === "0") {
       console.log("Geolocating device...")
       LocationHelper.findLocation(callback);
   } else {
       renderMap(latElem.value, lonElem.value);
   }
   
    return [latElem.value, lonElem.value];
}

//---------------------------------------------------------------------

// function updateLocation(){


//     console.log("Loading updateLocation()");


//     var lat = document.getElementById('latitude').value;
//     var long = document.getElementById('longitude').value;

//     if (lat === undefined || lat === "" || lat === "0") {
//         console.log("Locating Device")
//         LocationHelper.findLocation(callback);
//     }

//     const taglist = parseTags();
//     const mapView = document.getElementById('mapView');
//     const mapurl = mapM.getMapUrl(lat, long, taglist, 16);
//     mapView.setAttribute("src", mapurl);
// }


document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", handleTaggingForm);
    document.getElementById("discoveryFilterForm").addEventListener("submit", handleDiscoveryForm);
    document.getElementById("paginationNext").addEventListener("click", e => loadGeotags(parseInt(e.currentTarget.dataset.page)));
    document.getElementById("paginationPrev").addEventListener("click", e => loadGeotags(parseInt(e.currentTarget.dataset.page)));
    loadGeotags(0, true);
});