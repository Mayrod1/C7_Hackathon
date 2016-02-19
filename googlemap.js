//calls map on load
google.maps.event.addDomListener(window, 'load', initialize);

//initializes google map
var monkeyMap;
//learningfuze coords
var learningFuze = new google.maps.LatLng(33.64,-117.75);
//change mapProp to change the map properties
function initialize(){
    var mapProp = {
        center:learningFuze,
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    //creates our map on the ID with MainMap
    monkeyMap = new google.maps.Map($("#MainMap")[0],mapProp);
    //adds a click handler to the map
    google.maps.event.addListener(monkeyMap, 'click', function(event) {
        getLocation(event);
    });
}
//returns the coordinates when map is clicked
function getLocation(coords){
    console.log(coords.latLng.lat(), coords.latLng.lng());
    return coords.latLng.lat(), coords.latLng.lng();
}
/*
* function setMarks
* params: an array of tweets with lat and long properties
* return: nothing, applies markers to the map
* */
function setMarks(tweets){
    for(var i in tweets){
        var pos = new google.maps.LatLng(tweets[i].lat, tweets[i].lon);
        var marker = new google.maps.Marker({
            position: pos,
        });
        var infowindow = new google.maps.InfoWindow({
            content:tweets[i].tweet
        });
        marker.setMap(monkeyMap);

        infowindow.open(monkeyMap,marker);

        //google.maps.event.addListener(marker, 'click', function() {
        //    infowindow.open(monkeyMap,this);
        //});

    }
}
/*
* Function createTweets
* params: none
* does: creates dummy tweets with lat lon data and passes to set marks
* */
function createTweets(){
    var tweets = ["#time 4Hillary", "#Trumps WALL triumphs all", "#Cruz Eternal Theocracy", "#Bernies Commies"]
    var newp = [];
    for(var i = 0; i < 10; i++){
        var long =  (Math.random() * (117 - 115) - 117).toFixed(3);
        var lati =  (Math.random()* (34 - 30) + 30).toFixed(3);
        var tweet = tweets[Math.floor(Math.random()*tweets.length)];
        var coord = {lon:long , lat:lati, tweet:tweet};
        newp.push(coord);
    }
    console.log(newp);
    setMarks(newp);
}