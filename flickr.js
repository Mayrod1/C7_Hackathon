var apiFlickr = new ApiFlickr();

/**
 * ApiFlickr - Constructs an object with interfacing with Flickr's API.
 * @constructor
 */
function ApiFlickr() {

    this.radiusSearch = function(searchString, timePeriod, longitude, latitude, radiusInMiles){
        var dataObject = new RadialData(searchString, timePeriod, [longitude, latitude, radiusInMiles]);

    };

    /**
     * flickrPhotoSearch - Private method for initiating AJAX calls to Flickr API, modified to include the static url.
     * @param {Object} dataObject - Object containing all data keys to be passed to Flickr API.
     */
    function flickrPhotoSearch(dataObject) {
        $.ajax({
            url: "https://api.flickr.com/services/rest",
            method: "POST",
            dataType: "JSON",
            data: dataObject,
            success: function (response) {
                return response;
            },
            fail: function (response) {
                return response;
            }
        });
    }

    /**
     * getImageUrl - Returns the static url for the given image.  If a size is also given, image url returned is that size.
     * @param {Object} photoObject - Object containing a single image object.
     * @param {string} size - Character suffix for determining size of image in returned object. See https://www.flickr.com/services/api/misc.urls.html for list of suffixes.
     * @returns {string}
     */
    function getImageUrl(photoObject, size) {
        var photoUrl = "https://farm" + photoObject.farm + ".staticflickr.com/" + photoObject.server + "/" + photoObject.id + "_" + photoObject.secret;
        if (typeof size == "string") {
            photoUrl += "_" + size;
        }
        photoUrl += ".jpg";
        return photoUrl;
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
        this.long = location[0];
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
    }
}