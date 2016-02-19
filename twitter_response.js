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
 * findTweets
 * @params - searchfor (string, search term), latitude (float, search term),
 *   longitude (float, search term), rad (float, search term)
 *
 *  finds tweets WITH geotags that mention searchFor, near the given location
 *
 * */
function findTweets(searchFor, latitude, longitude, rad){
    console.log('shere');

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
                            response.tweets.statuses[i].user.screen_name,
                            response.tweets.statuses[i].text,
                            response.tweets.statuses[i].geo.coordinates[0],
                            response.tweets.statuses[i].geo.coordinates[1]
                        )
                    );
                }
            }
            console.log("tweetResults: ", tweetResults);
            return tweetResults;
        },
        error: function(response){
            console.log("response: ", response);
        }
    });
}


$(document).ready(function () {
    findTweets("", 33.6694, -117.8231, 50);

    $('button').click(function() {
        for (var i = 0; i < tweetResults.length; i++) {
            $('body').append('<p>', {text: i});
            /*$('.div1').append(tweetResults[i].screenName);
             $('.div1').append(tweetResults[i].tweetText);
             $('.div1').append(tweetResults[i].latitude);
             $('.div1').append(tweetResults[i].longitude);*/

            console.log(i);
        }
    });

});
