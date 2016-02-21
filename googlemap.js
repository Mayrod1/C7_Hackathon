//calls map on load

var apiMap = new GoogleMapsApi("apiMap");
//initializes google map
function GoogleMapsApi(apiname) {
    var api = this;
    var apiName = apiname;
    var totalphoto = 0;
    var learningFuze = new google.maps.LatLng(33.64, -117.75);

    this.monkeyMap;
    this.cycling = false;
    this.photoMode = true;
    this.tweetMode = true;

 //storage object for map markers, can cycle through markers on map;
    this.storage = {
        photos : [],
        index: 0,
        mapMarkerArray: [],
        cycle: function (duration) {
            console.log(this.index);
            var d = duration ? duration: 2000;
            var timer = setTimeout(function () {
                var p = api.storage;
                if (p.index > 0)p.mapMarkerArray[p.index - 1].infowindow.close();
                //api.monkeyMap, this.mapMarkerArray[this.index - 1][0]   params
                if (p.index > p.mapMarkerArray.length - 1) p.index = 0;

                p.mapMarkerArray[p.index].infowindow.open(api.monkeyMap, p.mapMarkerArray[p.index].marker);
                p.index++;

                if (api.cycling) api.storage.cycle();
                clearTimeout(timer);
            }, d);
        }
    };

    this.totalFinder = function(a){
        if(a) totalphoto = a;
        console.log(totalphoto);
    };
    this.clearMarkers = function(){
        for (var i = 0; i < markers.length; i++) {
            api.monkeyMap.setMapOnAll(null);
        }
    };
    this.showAll = function(){
        for (var i = 0; i < markers.length; i++) {
            api.storage.mapMarkerArray[i].marker.setMap(api.monkeyMap);
        }
    };

    this.removeall = function(){
        //clearMarkers();
        api.storage.mapMarkerArray = [];
    };
    /**
     * Function: genericToMarker
     * Params: object array that holds latitude/longitude display properties to display
     * runs through photo array sends them to be marked
     * */
    this.objToMarker = function(obj) {
        for (var i = 0; i < obj.length; i++) {
            api.storage.photos.push(obj[i]);
            setMarker(obj[i]);
        }
    };
    /**
     * Function: photoArrayToMarker
     * Params: flickr array
     * runs through photo array sends them to be marked
     * */
    this.photoArrayToMarker = function(photos) {
        for (var i = 0; i < photos.length; i++) {
            photos[i].display = photos[i].url_z;
            api.storage.photos.push(photos[i]);
            setMarker(photos[i], "images/flickrbox.png");
        }
    };
    /**
     * Function: tweetArrayToMarker
     * Params: tweet array
     * runs through tweet array and sends them to be marked
     * */
    this.tweetArrayToMarker = function(tweet) {
        for (var i = 0; i < tweet.length; i++) {
            var link = find_tweet_URL(tweet[i].tweetText);
            tweet[i].link = link ? link : "";
            setMarker(tweet[i], "images/tweet_circle.png");
        }
    };
    /**
     * function: initMap  - creates google maps on page
     * does: sets a click hander to activate getLocation when map is clicked
     * */
    function initMap() {
        console.log("initilizing");
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
    google.maps.event.addDomListener(window, 'load', initMap);
    /**
     * function getLocation
     * params: a search string, coordinates lat-long integers, radius to search for
     * return: nothing, calls searches depending on toggles enabled
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
    function setMarker(data, logo) {
        //create a point on google maps from tweet data
        var pos = new google.maps.LatLng(data.latitude, data.longitude);
        //change the icon picture and scale of the map marker pin
        var icon = {
            url: logo,
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        //position of maker and animation/icon setting
        var marker = new google.maps.Marker({
            position: pos,
            //animation:google.maps.Animation.BOUNCE,
            icon: icon
        });

        var id = totalphoto;
        //tweet name and info holder
        if(logo !== "images/tweet_circle.png"){
            var img = $("<image>", {
                src:  data.display
            });
            var div = $("<div>", {
                class: "flickerphoto",
                html: "<h2>" + data.title + "</h2>" + img
            });
            var infowindow = new google.maps.InfoWindow({
                content: "<div id='" + id + "' class='flickrphoto'><h2>" + data.title +
                "</h2><img onclick='" + apiName + ".display("+ id +")' src=" + data.url_q + "'>"
            });
        }
        else{
            var infowindow = new google.maps.InfoWindow({
                content: "<div class='tweets'><h2>" + data.screenName +
                "</h2><a href='" + data.link + "' target='_blank'>Link</a><p>" + data.tweetText +
                "</p></div>"
            });
        }

        totalphoto++;
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
            console.log(api.storage.mapMarkerArray[api.storage.mapMarkerArray.indexOf(data)]);
        });

    };
//failed tweet button can't grab object
    function tweetBtn(tweet) {
        console.log(tweet);
    }
    this.display = function(index, display) {

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
        tweetArrayToMarker(newp);
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
        setMarker(coord);
    }
}