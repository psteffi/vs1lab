// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const { tagList } = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    store = [tagList];          // const bringt hier einen Fehler

    // Add
    add(GeoTag) {
        array.push(GeoTag)
        console.log(store);
    }

    // Remove
    remove(GeoTag) {
        var index = store.find(GeoTag);
        array.splice(index, 1);         // splice zum löschen eines Elementes ohne eine undefinierte Lücke zu hinterlassen.
    }

    // getNearby
    getNearby(GeoTag) {
        var location = GeoTag.latitude
    }


    // searchNearby
    searchNearby(GeoTag) {

    }

}

module.exports = InMemoryGeoTagStore
// module.exports = GeoTagStore;
