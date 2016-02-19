/**
 * Created by Nick on 2/18/2016.
 */

/*
* simpleTweet - instead of storing whole tweets, stores relevant information extracted from tweet
* */
function simpleTweet(name, text, lat, long) {
    this.screenName = name;
    this.tweetText = text;
    this.latitude = lat;
    this.longitude = long;
}

/*
* newTweetObj - uses closure to make distinct tweet object, intended to be put into tweetResults array
* */
function newTweetObj(name, text, lat, long)
{
    var tweetObj = new simpleTweet(name, text, lat, long);
    return tweetObj;
}


var apiTwitter = new APItwitter();

function APItwitter() {
    /*
    * PUBLIC VARIABLES
    * tweetResults - simplified data extracted from tweets
    * */
    this.tweetResults = [];

    /*
    * PUBLIC METHODS
    * resetTweetResults - resets list of results
    * findTweets - finds tweets with given text in a given area
    * */

    /*
     * resetTweetResults - no params, no return, empties out array tweetResults
     * */
    function resetTweetResults()
    {
        this.tweetResults = [];
    }

    /*
     * findTweets
     * @params - searchfor (string, search term), latitude (float, search term),
     *   longitude (float, search term), rad (float, search term)
     *
     *  finds tweets WITH geotags that mention searchFor, near the given location
     *
     * */
    this.findTweets = function (searchFor, latitude, longitude, rad) {
        console.log('shere');

        $.ajax({
            dataType: "JSON",
            api_key: "LEARNING",
            method: "GET",
            url: "http://s-apis.learningfuze.com/hackathon/twitter/index.php",
            data: {
                search_term: searchFor,
                lat: latitude ,
                long: longitude,
                radius: rad
            },
            success: function(response){
                console.log("response: ", response);
                console.log("response.tweets.statuses: ", response.tweets.statuses);
                for (var i = 0; i < response.tweets.statuses.length; i++) {
                    if (response.tweets.statuses[i].geo != null){
                        this.tweetResults.push(
                            newTweetObj(
                                response.tweets.statuses[i].user.screen_name,
                                response.tweets.statuses[i].text,
                                response.tweets.statuses[i].geo.coordinates[0],
                                response.tweets.statuses[i].geo.coordinates[1]
                            )
                        );
                    }
                }
                return this.tweetResults;
            },
            error: function(response){
                console.log("response: ", response);
            }
        });
    }

    /*
    * PRIVATE FUNCTIONS
    *   none yet
    * */
}





$(document).ready(function () {
 apiTwitter.findTweets("cats", 33.6694, -117.8231, 50);

});
