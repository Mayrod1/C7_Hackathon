//calls map on load
google.maps.event.addDomListener(window, 'load', initMap);

//initializes google map
var monkeyMap;
//learningfuze coords
var learningFuze = new google.maps.LatLng(33.64,-117.75);
//change mapProp to change the map properties
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
        getLocation(event);
    });
}
//returns the coordinates when map is clicked
function getLocation(coords){
    console.log(coords.latLng.lat(), coords.latLng.lng());
    findCloseTweets(coords.latLng.lat(), coords.latLng.lng());
    return coords.latLng.lat(), coords.latLng.lng();
}
/*
* function setMarks
* params: an array of tweets with lat and long properties
* return: nothing, applies markers to the map
* */
function setMarks(tweets){
    for(var i in tweets){
        var pos = new google.maps.LatLng(tweets[i].latitude, tweets[i].longitude);

        var icon = {
            url: tweets[i].icon, // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0,0) // anchor
        };

        var marker = new google.maps.Marker({
            position: pos,
            animation:google.maps.Animation.BOUNCE,
            icon: icon
        });
        var infowindow = new google.maps.InfoWindow({
            content: "<h2>" + tweets[i].screenName + "</h2><div class='tweets'>" +  tweets[i].tweetText +"</div>"
        });
        marker.setMap(monkeyMap);

        infowindow.open(monkeyMap,marker);
        setTimeout(function(){
            infowindow.close(monkeyMap,marker);
        },700);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(monkeyMap,this);
        });

    }
}
/*
* Function createTweets
* params: none
* does: creates dummy tweets with lat lon data and passes to set marks
* */
function createTweets(){
    var tweets = ["#time to take down Hillary ", "#Trumps WALL trumps all", "#Stop Cruz Eternal Theocracy", "#Don't join Bernies Commies"]
    var newp = [];
    for(var i = 0; i < 1; i++){
        var long =  (Math.random() * (122 - 90) - 122).toFixed(3);
        var lati =  (Math.random()* (45 - 32) + 32).toFixed(3);
        var tweet = tweets[Math.floor(Math.random() * tweets.length)];
        var coord = {longitude:long , latitude:lati, tweetText:tweet, screenName:"HillaTump"};
        newp.push(coord);
    }
    console.log(newp);
    setMarks(newp);
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
    var newp = [];
    var lati =  (Math.random() * (minX - maxX) + minX).toFixed(3);
    var long =  (Math.random()* (minY - maxY) + minY).toFixed(3);
    var person = politico[Math.floor(Math.random()* politico.length)];
    var tweet = person.tweet[Math.floor(Math.random()*tweets.length)];
    var coord = {longitude:long , latitude:lati, screenName:"HillaTump", icon: person.pic, tweetText:tweet};
    console.log(coord.lat,coord.lon);
    newp.push(coord);

    console.log(newp);
    setMarks(newp);
}