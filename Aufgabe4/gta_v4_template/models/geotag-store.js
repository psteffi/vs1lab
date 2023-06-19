// File origin: VS1LAB A3

const geotag = require("./geotag");
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
 * Provide a method 'addgeotag' to add a geotag to the store.
 * 
 * Provide a method 'removegeotag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbygeotags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbygeotags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbygeotags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemorygeotagStore{

    // TODO: ... your code here ...
    #store = [];


    // Get all
    getAll() {
        console.log(this.#store);
        return this.#store;
    }

    // Add
    add(geotag) {
        
        this.#store.push(geotag)
        console.log(this.#store)
    }

    // Remove
    remove(name) {
        this.#store = this.#store.filter(geotag => geotag.name !== name);
    }

    // getNearby
    getNearby(latitude, longitude, radius) {
        return this.#store.filter(geotag => this.#distancepythgoras(latitude, longitude, geotag.latitude, geotag.longitude) <= radius);
    }

    #distancepythgoras(lat1, lon1, lat2, lon2) {
        var a = Math.pow(lat1 - lat2, 2);
        var b = Math.pow(lon1 - lon2, 2);
        return Math.sqrt(a+b);
    }

    #haversine_distance(lat1, lon1, lat2, lon2) {
        var earthRadius = 6378.137;
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = earthRadius * c;
        return d * 1000;
    }


    // searchNearby
    searchNearby(latitude, longitude, radius, searchTerm) {
        console.log(this.getNearby(latitude, longitude, radius));
        return this.getNearby(latitude, longitude, radius).filter((geotag) =>
            geotag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            geotag.hashtag.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

}

module.exports = InMemorygeotagStore