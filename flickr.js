var apiFlickr = new ApiFlickr();

/**
 * ApiFlickr - Constructs an object for interfacing with Flickr's API.
 * @constructor
 */
function ApiFlickr() {

    //  Begin public interface methods
    /**
     * unlocalizedSearch - Method used for performing searches without specifying location.
     * @param {Function} callback - A one-parameter function to call with the response from the server.
     * @param {string} searchString - String used to search image titles, descriptions, and keywords.
     * @param {Date[]|string[]} timePeriod - Filter by range of dates. One date implies minimum date to current. Empty array ignores dates.
     */
    this.unlocalizedSearch = function (callback, searchString, timePeriod) {
        var dataObject = new UnlocalizedData(searchString, timePeriod);
        flickrPhotoSearch(dataObject, callback);
    };

    /**
     * radiusSearch - Method used for performing searches which return the closest results to a given location.
     * @param {Function} callback - A one-parameter function to call with the response from the server.
     * @param {string} searchString - String used to search image titles, descriptions, and keywords.
     * @param {Date[]|string[]} timePeriod - Filter by range of dates. One date implies minimum date to current. Empty array ignores dates.
     * @param {number} longitude - Longitude of location to search around.
     * @param {number} latitude - Latitude of location to search around.
     * @param {number} radiusInMiles - Maximum radius to include in search.
     */
    this.radiusSearch = function(callback, searchString, timePeriod, longitude, latitude, radiusInMiles){
        var dataObject = new RadialData(searchString, timePeriod, [longitude, latitude, radiusInMiles]);
        flickrPhotoSearch(dataObject, callback);
    };

    /**
     * boundingBoxSearch - Method used for performing searches limited by the given location window.
     * @param {Function} callback - A one-parameter function to call with the response from the server.
     * @param {string} searchString - String used to search image titles, descriptions, and keywords.
     * @param {Date[]|string[]} timePeriod - Filter by range of dates. One date implies minimum date to current. Empty array ignores dates.
     * @param {number} minLongitude - Minimum longitude to include.
     * @param {number} minLatitude - Minimum latitude to include.
     * @param {number} maxLongitude - Maximum longitude to include.
     * @param {number} maxLatitude - Maximum latitude to include.
     */
    this.boundingBoxSearch = function(callback, searchString, timePeriod, minLongitude, minLatitude, maxLongitude, maxLatitude){
        var dataObject = new BoundingBoxData(searchString, timePeriod, [minLongitude, minLatitude, maxLongitude, maxLatitude]);
        flickrPhotoSearch(dataObject, callback);
    };

    /**
     * getImageUrlBySize - Returns the static url for the given image of the given size.
     * @param {Object} photoObject - Object containing a single image object.
     * @param {string|number} size - Character suffix for determining size of image in returned object. See https://www.flickr.com/services/api/misc.urls.html for list of suffixes.
     *  If a number is used, the size of the image is taken so that the largest dimension is at least that number of pixels.
     * @returns {string}
     */
    this.getImageUrlBySize = function(photoObject, size){
        var photoUrl = "https://farm" + photoObject.farm + ".staticflickr.com/" + photoObject.server + "/" + photoObject.id + "_" + photoObject.secret;
        if (typeof size == "string") {
            photoUrl += "_" + size;
        } else if (typeof size == "number") {
            if (size <= 75) {
                photoUrl += "_s";
            } else if (size <= 150) {
                photoUrl += "_q";
            } else if (size <= 240) {
                photoUrl += "_m";
            } else if (size <= 320) {
                photoUrl += "_n";
            } else if (size <= 500) {
                photoUrl += "_-";
            } else if (size <= 640) {
                photoUrl += "_z";
            } else if (size <= 800) {
                photoUrl += "_c";
            } else if (size <= 1024) {
                photoUrl += "_b";
            } else if (size <= 1600) {
                photoUrl += "_h";
            } else if (size <= 2048) {
                photoUrl += "_k";
            }
        }
        photoUrl += ".jpg";
        return photoUrl;
    };
    //  End public interface methods

    /**
     * flickrPhotoSearch - Private method for initiating AJAX calls to Flickr API, modified to include the static url.
     * @param {Object} dataObject - Object containing all data keys to be passed to Flickr API.
     * @param {Function} callback - A one-parameter function to call with the response from the server.
     */
    function flickrPhotoSearch(dataObject, callback) {
        $.ajax({
            url: "https://api.flickr.com/services/rest",
            method: "POST",
            dataType: "JSON",
            data: dataObject,
            success: function (response) {
                console.log("dataObject: ", dataObject);
                console.log("response: ", response);
                callback(response.photos.photo);
            },
            fail: function (response) {
                callback(response);
            }
        });
    }

    /**
     * FlickrData - Base constructor for data object sent via Flickr API call.
     * @param {string} searchText - Search string
     * @param {Date[]} dateRange - Date range used to limit search.  One date acts as minimum date.  Empty array ignores date filter.
     * @constructor
     */
    function FlickrData(searchText, dateRange) {
        this.method = "flickr.photos.search";
        this.api_key =  "4291af049e7b51ff411bc39565109ce6";
        this.format = "json";
        this.nojsoncallback = 1;
        this.text = searchText;
        if (Array.isArray(dateRange) && dateRange.length >= 1) {
            this.min_taken_date = dateRange[0];
            if (dateRange.length >= 2) {
                this.max_taken_date = dateRange[1];
            }
        }
        this.has_geo = 1;
        this.per_page = 100;
        this.content_type = 1;
        this.extras = "geo,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o";
    }

    /**
     * UnlocalizedData - Constructor based upon FlickrData, used to search without specifying location.
     * @param {string} searchText - Search string
     * @param {Date[]} dateRange - Date range used to limit search.  One date acts as minimum date.  Empty array ignores date filter.
     * @constructor
     */
    function UnlocalizedData (searchText, dateRange) {
        FlickrData.call(this, searchText, dateRange);
        this.sort = "relevance";
    }

    /**
     * RadialData - Constructor based upon FlickrData, used to search for closest results to a given location.
     * @param {string} searchText - Search string
     * @param {Date[]} dateRange - Date range used to limit search.  One date acts as minimum date.  Empty array ignores date filter.
     * @param {Array} location - Array containing longitude, latitude, and radius in miles.
     * @constructor
     */
    function RadialData (searchText, dateRange, location) {
        FlickrData.call(this, searchText, dateRange);
        this.lon = location[0];
        this.lat = location[1];
        this.radius = location[2];
        this.radius_units = "mi";
        this.per_page = 50;
    }

    /**
     * BoundingBoxData - Constructor based upon FlickrData, used to search for results spread evenly in a bounded geographical area.
     * @param {string} searchText - Search string
     * @param {Date[]} dateRange - Date range used to limit search.  One date acts as minimum date.  Empty array ignores date filter.
     * @param {number[]|string[]} location - Array containing bounding box information as [min-long, min-lat, max-long, max-lat].
     * @constructor
     */
    function BoundingBoxData (searchText, dateRange, location) {
        FlickrData.call(this, searchText, dateRange);
        this.bbox = location.join(",");
        this.sort = "relevance";
    }
}