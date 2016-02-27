//calls map on load

var apiMap = new GoogleMapsApi("apiMap");
//initializes google map
function GoogleMapsApi(apiname) {
    /**
     * Private Variables only for GoogleMapsApi
     * */
    var api = this;
    var apiName = apiname;
    var markerIndex = 0;
    var learningFuze = new google.maps.LatLng(33.64, -117.75);
    /**
     * Public Variables adjust to manipulate GoogleMapsApi
     * */
    this.monkeyMap = null;
    this.cycling = false;
    this.photoMode = true;
    this.tweetMode = true;
    /**
     * Main storage Object of GoogleMapsApi
     * holds a marker array its current index
     * and cycle marker function
     * */
    this.storage = {
        photos : [],
        index: 0,
        mapMarkerArray: [],
        cycle: function (duration) {
            console.log(this.index);
            var d = duration ? duration: 2000;
            var p = api.storage;
            p.mapMarkerArray[p.index].infowindow.open(api.monkeyMap, p.mapMarkerArray[p.index].marker);
            var timer = setTimeout(function () {
                p.mapMarkerArray[p.index ].infowindow.close();
                p.index++;
                if (p.index > p.mapMarkerArray.length - 1) p.index = 0;
                if (api.cycling) api.storage.cycle($("#cycleSpeed").val() * 1000);
                clearTimeout(timer);
            }, d);
        }
    };
    /**
     * Gets private markerIndex variable;
     * */
    this.getMarkerIndex = function(){
        return  markerIndex;
        console.log( markerIndex);
    };
    /**
     * Sets private markerIndex variable;
     * */
    this.setMarkers = function(num){
         markerIndex = num;
    };
    /**
     * Public method hides all all Markers
     * */
    this.hideMarkers = function(){
        for (var i = 0; i < api.storage.mapMarkerArray.length ; i++) {
            api.storage.mapMarkerArray[i].marker.setMap(null);
        }
    };
    /**
     * Public method displays all all Markers
     * */
    this.showMarkers = function(){
        for (var i = 0; i <  api.storage.mapMarkerArray.length; i++) {
            api.storage.mapMarkerArray[i].marker.setMap(api.monkeyMap);
        }
    };
    /**
     * Public method deletes all all Markers
     * */
    this.deleteMarkers = function(){
        api.hideMarkers();
        api.storage.mapMarkerArray = [];
        api.setMarkers(0);
    };
    /**
     * Function: objToMarker  - a generic map marker call
     * Params: object array - object must contain properties(longitude, latitude)
     * runs through object array sends them to be marked
     * */
    this.objToMarker = function(obj) {
        for (var i = 0; i < obj.length; i++) {
            api.storage.photos.push(obj[i]);
            setMarker(obj[i], "images/trump.png", 25 );
        }
        setMarker.bind(obj)
    };
    /**
     * Function: photoArrayToMarker - a flickr specific map marker call
     * Params: flickr array
     * runs through photo array sends them to be marked
     * */
    this.photoArrayToMarker = function(photos) {
        for (var i = 0; i < photos.length; i++) {
            photos[i].display = photos[i].url_z;
            api.storage.photos.push(photos[i]);
            setMarker(photos[i], "images/flickrbox.png", 50);
        }
    };
    /**
     * Function: tweetArrayToMarker - a tweet specific map marker call
     * Params: tweet array
     * runs through tweet array and sends them to be marked
     * */
    this.tweetArrayToMarker = function(tweet) {
        for (var i = 0; i < tweet.length; i++) {
            var link = find_tweet_URL(tweet[i].tweetText);
            tweet[i].link = link ? link : "";
            var logo = tweet.profile ? tweet.profile : "images/tweet_circle.png";
            setMarker(tweet[i], logo, 50);
        }
    };
    /**
     * function: initMap  - creates google maps on page
     * adjust mapProp properties to edit map config
     * sets a click handler to activate getLocation when map is clicked
     * */
    function initMap() {
        var mapProp = {
            center: learningFuze,
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //creates our map on the ID with MainMap
        var mapDiv = document.getElementById("MainMap");
        api.monkeyMap = new google.maps.Map(mapDiv, mapProp);
        //adds a click handler to the map
        google.maps.event.addListener(api.monkeyMap, 'click', function (event) {
            if ($("#hashtag").val()) {
                getLocation($("#hashtag").val(), event, $("#radius").val());
                $("#hashtag").val("");
            }
        });
    }
    //On load call initMap, must come after initMap
    google.maps.event.addDomListener(window, 'load', initMap);
    /**
     * function getLocation
     * params: a search string, coordinates lat-long integers, radius integer in miles
     * return: nothing, calls tweet and flicr searches depending on toggles enabled
     * */
    function getLocation(text, coords, radius) {
        var lat = coords.latLng.lat();
        var lon = coords.latLng.lng();
        console.log(lat, lon);
        if (api.tweetMode) {
            findTweets(text, lat, lon, radius, api.tweetArrayToMarker);
        }
        if (api.photoMode) {
            apiFlickr.radiusSearch(api.photoArrayToMarker, text, [], lon, lat, 20);
        }
    }
    /**
     * function setMarks to Google Maps
     * params: an array of tweets with lat and long properties
     * return: nothing, applies markers to the map
     * */
    function setMarker(data, logo, size) {
        //create a point on google maps from tweet data
        var pos = new google.maps.LatLng(data.latitude, data.longitude);
        //change the icon picture and scale of the map marker pin
        var icon = {
            url: logo,
            scaledSize: new google.maps.Size(size, size), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        //position of maker and animation/icon setting
        var marker = new google.maps.Marker({
            position: pos,
            //animation:google.maps.Animation.BOUNCE,
            icon: icon
        });

        var id =  markerIndex;
        markerIndex++;
        var infowindow;
        //Check if its a tweet, photo or generic data and create appropriate infoWindow
        if(logo == "images/flickrbox.png"){
            infowindow = new google.maps.InfoWindow({
                content: "<div id='" + id + "' class='flickrphoto'><h2>" + data.title +
                "</h2><img onclick='" + apiName + ".display("+ id +")' src=" + data.url_q + "'>"
            });
        }
        else if(logo == "images/tweet_circle.png"){
            infowindow = new google.maps.InfoWindow({
                content: "<div class='tweets'><h2>" + data.screenName +
                "</h2><a href='" + data.link + "' target='_blank'>Link</a><p>" + data.tweetText +
                "</p></div>"
            });
        }
        else{
            infowindow = new google.maps.InfoWindow({
                content: "<div class='tweets'><h2>" + data.title +
                "</h2><a href='" + data.link + "' target='_blank'>Link</a><p>" + data.text +
                "</p></div>"
            });
        }

        //set the market on monkey map
        marker.setMap(api.monkeyMap);
        // open the info window
        //infowindow.open(api.monkeyMap, marker);

        //add data with marker and infowindow to storage holder
        data.marker = marker;
        data.infowindow = infowindow;
        api.storage.mapMarkerArray.push(data);

        //add event listener to open text window again
        google.maps.event.addListener(marker, 'click', function () {
             infowindow.open(api.monkeyMap, this);
            //console.log(api.storage.mapMarkerArray[api.storage.mapMarkerArray.indexOf(data)]);
        });
    };
    /**
     * Function display
     * params: index integer, display item
     * does: called on click to open modal with image in storage
     * */
    this.display = function(index, img) {

        var modal_element = $('#Modal');

        var image = $('<img>', {
            src: api.storage.mapMarkerArray[index].display
        });
        var photoFrame = $('<div>', {
            class: 'flickr'
        });

        photoFrame.append(image);
        modal_element.find('.modal-body').html('').append(photoFrame);
        modalActive("Modal");
    };

    /** DUMMY DATA FUNCTIONS
     * Function createTweets
     * params: none
     * does: creates dummy tweets with lat lon data and passes to set marks
     * */
    this.createTweets = function() {
        var tweets = ["#time to take down Hillary ", "#Trumps WALL trumps all", "#Stop Cruz Eternal Theocracy", "#Don't join Bernies Commies"]
        var newp = [];
        for (var i = 0; i < 10; i++) {
            var long = (Math.random() * (122 - 90) - 122).toFixed(3);
            var lati = (Math.random() * (45 - 32) + 32).toFixed(3);
            var tweet = tweets[Math.floor(Math.random() * tweets.length)];
            var coord = {longitude: long, latitude: lati, tweetText: tweet, screenName: "HillaTump"};
            newp.push(coord);
        }
        console.log(newp);
        api.tweetArrayToMarker(newp);
    };
    /**
     function findCloseTweets
     params: long and latitude floats
     does: creates dummy tweets that within range of given coordinates
     * */
    this.findCloseTweets = function(x, y) {
        maxX = x + 1;
        minX = x - 1;
        maxY = y + 1;
        minY = y - 1;
        var tweets = ["#time to take down Hillary ", "#Trumps WALL trumps all", "#Stop Cruz Eternal Theocracy", "#Don't join Bernies Commies"];
        var politico = [{tweet: tweets, pic: "images/trump.png"}, {tweet: tweets, pic: "images/hillary.png"}];
        //var newp = [];
        var lati = (Math.random() * (minX - maxX) + minX).toFixed(3);
        var long = (Math.random() * (minY - maxY) + minY).toFixed(3);
        var person = politico[Math.floor(Math.random() * politico.length)];
        var tweet = person.tweet[Math.floor(Math.random() * tweets.length)];
        var coord = {longitude: long, latitude: lati, screenName: "HillaTump", icon: person.pic, tweetText: tweet};
        console.log(coord.lat, coord.lon);
        //newp.push(coord);
        api.setMarker(coord);
    }
}