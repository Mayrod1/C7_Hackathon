//calls map on load
google.maps.event.addDomListener(window, 'load', initMap);


//initializes google map
var monkeyMap;
var photos = [];
var cycling = true;
var photoMode = true;
var tweetMode = true;
//storage object for map markers, can cycle through markers on map;
var storage = {
    index: 0,
    mapMarkerArray: [],
    cycle: function(){
        var timer = setTimeout(function () {
            if(storage.index > 0)storage.mapMarkerArray[storage.index - 1][1].close(monkeyMap, storage.mapMarkerArray[storage.index - 1][0]);

            if(storage.index > storage.mapMarkerArray.length - 1) storage.index = 0;
            console.log(storage.index);
            storage.mapMarkerArray[storage.index][1].open(monkeyMap, storage.mapMarkerArray[storage.index][0]);
            storage.index++;

            if(cycling) storage.cycle();
            clearTimeout(timer);
        }, 2000);
    }
}
//learningfuze coords
var learningFuze = new google.maps.LatLng(33.64,-117.75);
/**
* function: initMap  - creates google maps on page
 * does: sets a click hander to activate getLocation when map is clicked
* */
function initMap(){
    var mapProp = {
        center: learningFuze,
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //creates our map on the ID with MainMap
    var mapDiv = document.getElementById("MainMap");
    monkeyMap = new google.maps.Map(mapDiv, mapProp);
    //adds a click handler to the map
    google.maps.event.addListener(monkeyMap, 'click', function(event) {
        if($("#hashtag").val()){
            getLocation($("#hashtag").val(), event, $("#radius").val());
            $("#hashtag").val("");
        }
    });
}
/**
 * function getLocation
 * params: a search string, coordinates lat-long integers, radius to search for
 * return: nothing, calls searches depending on toggles enabled
 * */
function getLocation(text, coords, radius) {
    var lat = coords.latLng.lat();
    var lon = coords.latLng.lng();
    //console.log(coords.latLng.lat(), coords.latLng.lng());
    //findCloseTweets(coords.latLng.lat(), coords.latLng.lng());
    if (tweetMode) {
        findTweets(text, lat, lon, radius);
    }
    if(photoMode){
        apiFlickr.radiusSearch(photocaller, text, [], lon, lat, 20);
    }
}

/**
 * function photocaller
 * params: response array
 * return: nothing, stores photos in array
 * */
function photocaller(response) {

    console.log("flickrApi success: ", response);
    for (var i in response) {
        photos.push(response[i]);
        photoArrayToMarker(response);
    }
}
/**
* function setMarks
* params: an array of tweets with lat and long properties
* return: nothing, applies markers to the map
* */

function setMark(tweet){
            //create a point on google maps from tweet data
            var pos = new google.maps.LatLng(tweet.latitude, tweet.longitude);
            //change the icon picture and scale of the map marker pin
            var icon = {
                url: "images/tweet_circle.png",
                scaledSize: new google.maps.Size(25, 25), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0) // anchor

            };
            //position of maker and animation/icon setting
            var marker = new google.maps.Marker({
                position: pos,
                //animation:google.maps.Animation.BOUNCE,
                icon: icon
                //labelContent: "moocow",
                //labelAnchor: new google.maps.Point(10, 10),
                //labelClass: "moocow" //the CSS class for the label
            });

            //var btn = $("<div>", {
            //    html: "<button class='btn'>Click</button>"
            //})
            //btn.click(function () {
            //    console.log(tweet);
            //    //storage.mapMarkerArray.splice(storage.mapMarkerArray.indexOf(tweet), 1);
            //});
            //tweet name and info holder
            var infowindow = new google.maps.InfoWindow({
                content: "<div class='tweets'><h2>" + tweet.screenName +
                "</h2><a href='"+ tweet.link +"' target='_blank'>Link</a><p>" + tweet.tweetText +
                "</p></div>"
            });
            //set the market on monkey map
            marker.setMap(monkeyMap);
            // open the info window
            infowindow.open(monkeyMap, marker);
            //close the info window 0 - 2 seconds later
            var time = setTimeout(function () {
                infowindow.close(monkeyMap, marker);
                clearTimeout(time);
            }, Math.floor(Math.random() * 2000));
            //add event listener to open text window again
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(monkeyMap, this);
                console.log(tweet);
            });


            //add tweet to storage holder TODO: add tweet message to parse through
            storage.mapMarkerArray.push([marker, infowindow, tweet]);
}
//failed tweet button can't grab object
function tweetBtn(tweet){
    console.log(tweet);
}

/**
 * Function: tweetArrayToMarker
 * Params: tweet array
 * runs through tweet array and sends them to be marked
* */
function tweetArrayToMarker(tweets){

    for(var i in tweets){
        var link = find_tweet_URL(tweets[i].tweetText);

        tweets[i].link = link ? link: "";

        setMark(tweets[i])
    }
}


/**
 * Function: photoArrayToMarker
 * Params: tweet array
 * runs through photo array sends them to be marked
 * */
function photoArrayToMarker(photos){
    for(var i in photos){
        setPhoto(photos[i])
    }
}
/**
 * function setPhoto
 * params: a photo object with lat and long properties
 * return: nothing, applies markers to the map
 * */

function setPhoto(photo){
    //create a point on google maps from photo data
    var pos = new google.maps.LatLng(photo.latitude, photo.longitude);
    //change the icon picture and scale of the map marker pin
    var icon = {
        url: "images/flickrbox.png",
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
    //photo title and image holder
    var infowindow = new google.maps.InfoWindow({
        content: "<div class='flickrphoto'><h2>" + photo.title +
        "</h2> <img src='" + photo.url_q +
        "'></div>"
    });
    //set the market on monkey map
    marker.setMap(monkeyMap);
    // open the info window
    //infowindow.open(monkeyMap, marker);


    //add event listener to open text window again
    google.maps.event.addListener(marker, 'click', function () {
        display_photo(photo);
        infowindow.open(monkeyMap, this);
        console.log(photo);
    });
    //add photo to storage holder TODO: add tweet message to parse through
    storage.mapMarkerArray.push([marker, infowindow]);
}

function display_photo(photo){

    var modal_element = $('#Modal');

    var image = $('<img>',{
        src: photo.url_m
    });
    var photoFrame = $('<div>',{
        class: 'flickr',
    });

    photoFrame.append(image);
    modal_element.find('.modal-body').html('').append(photoFrame);
    modalActive("Modal");
}

$(".close").click(function(){
    modalActive("Modal");
})

/**
* Function createTweets
* params: none
* does: creates dummy tweets with lat lon data and passes to set marks
* */
function createTweets(){
    var tweets = ["#time to take down Hillary ", "#Trumps WALL trumps all", "#Stop Cruz Eternal Theocracy", "#Don't join Bernies Commies"]
    var newp = [];
    for(var i = 0; i < 10; i++){
        var long =  (Math.random() * (122 - 90) - 122).toFixed(3);
        var lati =  (Math.random()* (45 - 32) + 32).toFixed(3);
        var tweet = tweets[Math.floor(Math.random() * tweets.length)];
        var coord = {longitude:long , latitude:lati, tweetText:tweet, screenName:"HillaTump"};
        newp.push(coord);
    }
    console.log(newp);
    tweetArrayToMarker(newp);
}
/**
function findCloseTweets
params: long and latitude floats
does: creates dummy tweets that within range of given coordinates
* */
function findCloseTweets(x, y){
    maxX = x + 1;
    minX = x - 1;
    maxY = y + 1;
    minY = y - 1;
    var tweets = ["#time to take down Hillary ", "#Trumps WALL trumps all", "#Stop Cruz Eternal Theocracy", "#Don't join Bernies Commies"];
    var politico = [{tweet: tweets, pic: "images/trump.png"},{tweet: tweets, pic: "images/hillary.png"}];
    //var newp = [];
    var lati =  (Math.random() * (minX - maxX) + minX).toFixed(3);
    var long =  (Math.random()* (minY - maxY) + minY).toFixed(3);
    var person = politico[Math.floor(Math.random()* politico.length)];
    var tweet = person.tweet[Math.floor(Math.random()*tweets.length)];
    var coord = {longitude:long , latitude:lati, screenName:"HillaTump", icon: person.pic, tweetText:tweet};
    console.log(coord.lat,coord.lon);
    //newp.push(coord);

    setMark(coord);
}


