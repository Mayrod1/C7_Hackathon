//calls map on load
google.maps.event.addDomListener(window, 'load', initMap);


//initializes google map
var monkeyMap;
var photos = [];
var cycling = true;
var storage = {
    index: 0,
    tweetHolder: [],
    cycle: function(){
        var timer = setTimeout(function () {
            if(storage.index > 0)storage.tweetHolder[storage.index - 1][1].close(monkeyMap, storage.tweetHolder[storage.index - 1][0]);

            if(storage.index > storage.tweetHolder.length - 1) storage.index = 0;
            console.log(storage.index);
            storage.tweetHolder[storage.index][1].open(monkeyMap, storage.tweetHolder[storage.index][0]);
            storage.index++;

            if(cycling) storage.cycle();
            clearTimeout(timer);
        }, 1000);
    }
}
//learningfuze coords
var learningFuze = new google.maps.LatLng(33.64,-117.75);
/*
* function: initMap  - creates google maps on page
* */
function initMap(){
    var mapProp = {
        center: learningFuze,
        zoom: 5,
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
//returns the coordinates when map is clicked
function getLocation(text, coords, radius){
    console.log(coords.latLng.lat(), coords.latLng.lng());
    //findCloseTweets(coords.latLng.lat(), coords.latLng.lng());
    findTweets(text, coords.latLng.lat(), coords.latLng.lng(), radius);
    apiFlickr.radiusSearch(photocaller, text, [], coords.latLng.lng(), coords.latLng.lat(), 50);
    //return coords.latLng.lat(), coords.latLng.lng();
}

function photocaller(a){
     photos.push(a);
}

//apiFlickr.unlocalizedSearch(function(a){ b = apiFlickr.getImageUrl(a.photos.photo[9], 200)}, "cat", [])
/*
* function setMarks
* params: an array of tweets with lat and long properties
* return: nothing, applies markers to the map
* */

function setMark(tweet){
            //create a point on google maps from tweet data
            var pos = new google.maps.LatLng(tweet.latitude, tweet.longitude);
            //change the icon picture and scale of the map marker pin
            var icon = {
                url: "images/tweet.png",
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
            //tweet name and info holder
            var infowindow = new google.maps.InfoWindow({
                content: "<h2>" + tweet.screenName + "</h2><a href='"+ find_tweet_URL(tweet.tweetText) +"'>instagram</a> <div" +
                    " class='tweets'>" + tweet.tweetText + "</div>"
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
            });
            //add tweet to storage holder TODO: add tweet message to parse through
            storage.tweetHolder.push([marker, infowindow]);
}
/*
* */
function tweetArrayToMarker(tweets){
    for(var i in tweets){

        setMark(tweets[i])
    }
}



function setPhoto(photo){
    //create a point on google maps from tweet data
    var pos = new google.maps.LatLng(photo.latitude, photo.longitude);
    //change the icon picture and scale of the map marker pin
    var icon = {
        url: "images/tweet.png",
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
    //tweet name and info holder
    var infowindow = new google.maps.InfoWindow({
        content: "<h2>" + photo.title + "</h2> <div class='tweets'>" + apiFlickr.getImageUrl(photo,0) + "</div>"
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
    });
    //add tweet to storage holder TODO: add tweet message to parse through
    storage.tweetHolder.push([marker, infowindow]);
}


/*
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
/*
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