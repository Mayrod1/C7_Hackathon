var apiFlickr = new ApiFlickr();

/**
 * ApiFlickr - Constructs an object with interfacing with Flickr's API.
 * @constructor
 */
function ApiFlickr() {

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
}