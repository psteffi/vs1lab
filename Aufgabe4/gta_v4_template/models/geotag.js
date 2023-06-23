// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    id;
    latitude;
    longitude;
    name;
    hashtag;
    
  // TODO: ... your code here ...
  constructor(latitude, longitude, name, hashtag) {
//--- GeoTags brauchen nun auch eine ID ---//
    this.id = 0;
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
  }
}

module.exports = GeoTag;