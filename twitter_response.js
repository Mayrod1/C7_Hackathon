/**
 * Created by Nick on 2/18/2016.
 */

/*
 * simpleTweet - instead of storing whole tweets, stores relevant information extracted from tweet
 * */

function simpleTweet(uName, sName, pic, text, lat, long) {
    this.userName = uName;
    this.screenName = sName;
    this.profile = pic;
    this.tweetText = text;
    this.latitude = lat;
    this.longitude = long;
}

/*
 * newTweetObj - uses closure to make distinct tweet object, intended to be put into tweetResults array
 * */
function newTweetObj(uName, sName, pic, text, lat, long)
{
    var tweetObj = new simpleTweet(uName, sName, pic, text, lat, long);
    return tweetObj;
}


/*
 * tweetResults - simplified data extracted from tweets
 * */

var tweetResults = [];

/*
 * resetTweetResults - no params, no return, empties out array tweetResults
 * */

function resetTweetResults()
{
    tweetResults = [];
}

/*
*
*
* */


/*
 * findTweets
 * @params - searchfor (string, search term), latitude (float, search term),
 *   longitude (float, search term), rad (float, search term)
 *
 *  finds tweets WITH geotags that mention searchFor, near the given location
 *
 * */
function findTweets(searchFor, latitude, longitude, rad, callback){
    console.log('shere');
    var results = [];
    $.ajax({
        dataType: "JSON",
        api_key: "LEARNING",
        method: "GET",
        url: "http://s-apis.learningfuze.com/hackathon/twitter/index.php",
        data: {search_term: searchFor,
            lat: latitude ,
            long: longitude,
            radius: rad
        },
        success: function(response){
            console.log("response: ", response);
            console.log("response.tweets.statuses: ", response.tweets.statuses);
            for (var i = 0; i < response.tweets.statuses.length; i++) {
                if (response.tweets.statuses[i].geo != null){
                    tweetResults.push(
                        newTweetObj(
                            response.tweets.statuses[i].user.name,
                            response.tweets.statuses[i].user.screen_name,
                            response.tweets.statuses[i].user.profile_image_url,
                            response.tweets.statuses[i].text,
                            response.tweets.statuses[i].geo.coordinates[0],
                            response.tweets.statuses[i].geo.coordinates[1]
                        )
                    );
                }
            }
            /*console.log("tweetResults: ", tweetResults);
            return tweetResults;*/

            tweetArrayToMarker(tweetResults);

            //tweetArrayToMarker(results);
            areaTweets();
        },
        error: function(response){
            console.log("response: ", response);
        }
    });
}

/*
//  A BRIDGE TOO FAR
 * areaTweets
 * @params - searchfor (string, search term), startLat (float, search term),
 *   startLong (float, search term), endLat (float, search term),
 *   endLong (float, search term)
 *
 *  finds tweets WITH geotags that mention searchFor, within the given boundaries
 *  NOTE - startLat and startLong are assumed to be the smaller numbers
 * */
var areaTemp = [];

function areaTweets(searchFor, startLat, startLong, endLat, endLong)
{
    if (searchFor !== undefined)
    {
        areaTemp = [searchFor, startLat, startLong, endLat, endLong];

        findTweets(searchFor, startLat, startLong, 69);
        return;
    }

    areaTemp[1]++;
    areaTemp[2]++;
    if ( (areaTemp[1] < areaTemp[3]) )//|| (areaTemp[2] > areaTemp[4]) )
    {
        findTweets(areaTemp[0], areaTemp[1], areaTemp[2], 69);
    }
}


$(document).ready(function () {
    // dummy data
    findTweets("", 33.6694, -117.8231, 50);
    findTweets("", 34.6694, -117.8231, 50);
    findTweets("", 35.6694, -117.8231, 50);
    findTweets("", 36.6694, -117.8231, 50);
    findTweets("", 37.6694, -117.8231, 50);
    findTweets("", 38.6694, -117.8231, 50);
    findTweets("", 39.6694, -117.8231, 50);
    findTweets("", 40.6694, -117.8231, 50);
    //console.log("single call: ", tweetResults);
    //areaTweets("", 23, -124, 48, -68);
    //console.log("multi call: ", tweetResults);

    $('button').click(function() {
        for (var i = 0; i < tweetResults.length; i++) {
            console.log("uName: ", tweetResults[i].userName);
            console.log("sName: ", tweetResults[i].screenName);
            console.log("profile: ", tweetResults[i].profile);
            console.log("tweetText: ", tweetResults[i].tweetText);
            console.log("latitude: ", tweetResults[i].latitude);
            console.log("longitude: ", tweetResults[i].longitude);

            console.log(i);
        }
    });

});
