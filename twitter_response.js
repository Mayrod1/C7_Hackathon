/**
 * Created by Nick on 2/18/2016.
 */

function simpleTweet(name, text, lat, long) {
    this.screenName = name;
    this.tweetText = text;
    this.latitude = lat;
    this.longitude = long;
}

function newTweetObj(name, text, lat, long)
{
    var tweetObj = new simpleTweet(name, text, lat, long);
    return tweetObj;
}


/*
 * findTweets
 * @params - searchfor (string, search term), latitude (float, search term),
 *   longitude (float, search term), rad (float, search term)
 *
 *
 *
 * */
function findTweets(searchFor, latitude, longitude, rad){
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
                    results.push(
                        newTweetObj(
                            response.tweets.statuses[i].user.screen_name,
                            response.tweets.statuses[i].text,
                            response.tweets.statuses[i].geo.coordinates[0],
                            response.tweets.statuses[i].geo.coordinates[1]
                        )
                    );
                }
            }
            slowCount(results);
        },
        error: function(response){
            console.log("response: ", response);
        }
    });
}


/*
$(document).ready(function () {
    findTweets("cats", 33.6694, -117.8231, 50);

});
*/
