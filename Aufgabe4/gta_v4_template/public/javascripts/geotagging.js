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

    //Setting in initial step
function pagination() {

    const numberOfItems = taglist.length
    const numberPerPage = 5
    const currentPage = 1
    const numberOfPages = Math.ceil(numberOfItems/numberPerPage) //Division mit aufrunden

    function accomodatePage(clickedPage) {
        if (clickedPage <= 1) { return clickedPage + 1}
        if (clickedPage >= numberOfPages) { return clickedPage -1}
        return clickedPage
    }
    

    function buildPagination(clickedPage) {
        $('.pagiation_selector').empty()
        const currPageNum = accomodatePage(clickedPage)
        //ausgeklammert, da meiner Meinung nach nicht benötigt
        // if (numberOfPages >= 3) {
        //     for (let i=-1; i<2; i++) {
        //         $('.pagination_selector').append(`<button class="btn btn-primary" value="${currPageNum+i}">${currPageNum+i}</button>`)
        //     }
        // } else {
        //     for (let i=0; i<numberOfPages; i++) {
        //         $('.pagiation_selector').append(`<button class="btn btn-primary" value="${i+1}">${i+1}</button>`)
        //     }
        // }
    }
   
    //document.getElementById("page").innerHTML = currentPage + "/" + numberOfPages;


    function buildPage(currPage) {
        const trimStart = (currPage -1) * numberPerPage
        const trimEnd = trimStart + numberPerPage
        // BEISPIEL: if currentPage =1
        // const trimStart = (1 - 1) * 5 = 0
        // const trimEnd = 0 + 5 = 5

        console.log(taglist.slice(trimStart, trimEnd))
        $(".discovery_results").empty().append(taglist.slice(trimStart, trimEnd))
    }

    $(document).ready(function(){
        buildPage(1)
        buildPagination(currentPage)
        $('.pagination_selection').on('click', 'button', function() {
            var clickedPage = parseInt($(this).val())
            buildPage(clickedPage)
            buildPagination(clickedPage, numberOfPages)
       });
    });

    //Alternative ?!?!

    // const updateBtn = () => {
    //     if(currentPage === numberOfPages){
    //         nextBtn.disabled = true;
    //     } else if (currentPage === 0) {
    //         startBtn.disabled = true;
            
    //     }
    // }

    // function startBtn(){
    //     if (currentPage > 1) {
    //         currentPage--;
    //     } else {
    //         // do nothing
    //     }
    // }

    // function nextBtn() {
    //     if (currentPage < numberOfPages) {
    //         currentPage ++;
    //     }
    // }

}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    pagination();
});
