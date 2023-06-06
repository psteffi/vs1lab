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
    #store = [];          // const bringt hier einen Fehler

    // Add
    add(geotag) {
        this.#store.push(geotag)
        console.log(store)
    }

    // Remove
    remove(name) {
        var index = this.#store.find(name);
        this.#store.splice(index, 1);         // splice zum löschen eines Elementes ohne eine undefinierte Lücke zu hinterlassen.
    }

    // getNearby
    getNearby(latitude, longitude, radius, store) {
        if (radius === undefined) {
            radius = 5
        }
        const localTags = [];

        store.forEach(function (geotag) {
            var latDiff = geotag.latitude - lat;
    
            // check if Latitude is in range
            if (-1 * radius <= latDiff && latDiff <= radius) {
              var longDiff = geotag.longitude - long;
    
              /* longitude -179 and 180 are next to each other on the globe
               * which means we need to account for overflows and under-flows
               * when calculating relative distance */
              if (longDiff > 180) {
                longDiff -= 360
              } else if (longDiff < -180) {
                longDiff += 360
              }
    
              // check if Longitude is in range
              if (-1 * radius <= longDiff && longDiff <= radius) {
                // all checks passed, object can be added to localTags
                localTags.push(geotag)
              }
            }
          })
        
        return localTags;
    }


    // searchNearby
    searchNearby(name, localTags) {
        // Form validation
        if (localTags === undefined) {
            localTags = tagList
        }

        var searchExp = new RegExp(name, 'i')
        var searchResult = []

        // Iterate through each tag in list and return only tags that match the RegEx
        searchResult = localTags.filter(function (geotag) {
            return (searchExp.test(geotag.name) || searchExp.test(geotag.hashtag))
        })

        return searchResult
    }
}

module.exports = InMemorygeotagStore