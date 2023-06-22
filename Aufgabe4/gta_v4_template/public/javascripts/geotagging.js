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


// ### TODO ### Pagination


// const numbers = document.querySelectorAll(".links");

// //Setting in initial step
// let currentStep = 0;

// //Function to update

// const listArray = []
// for (let i = 0; i < 40; i++) {
//     listArray.push(`<li class="list-group-item">${i}</li>`)
// }

// const numberOfItems = listArray.length
// const numberPerPage = 5
// const currentPage = 1
// const numberOfPages = Math.ceil(numberOfItems/numberPerPage)

// const trimStart = (currPage - 1) * numberPerPage
// const trimEnd = trimStart + numberPerPage

// // //if currentPage =1
// // const trimStart = (1 - 1) * 5 = 0
// // const trimEnd = 0 + 5 = 5

// // //if currentPage = 2

// function buildPage(currPage) {
//     const trimStart = ()
// }


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
