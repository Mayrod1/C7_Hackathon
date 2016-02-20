/*
* Object for storing global variables
* possible: input value strings for jquery selections
* possible: tweet location holder,  geolocation coordiantes when map click
*
* */


/*
* Document Ready function
* holds button click events connects to input controller
* */

/*
 * Input Controller calls all the other functions
 */

/*
 * Function: parseTweets,
 * params: tweet object array
 * does: filters tweet info down to tweet text and location info
 * returns: an array of tweet objects that holds tweet text and location data
 * */



/*
* Google API caller object
* */

/*
* Function: getLocation
* params: *onclick data
* does: takes location data from google maps api and calls getTweetsByLocation
* return: nothing;
* */




/*
 * Twitter API caller object that encapsulates twitter api calls
 */
/*
*Function: getTweetsbyTag
* params: takes in text input
* does: makes api call based on text and stores tweets
* returns: an array of tweets collected by param search info
* */


/*
* Function: getTweetsbyLocation,
* params: takes in coordinates/city *type depends on twitter api search requirements
* does: makes api call based on numbers and stores tweets
* returns: an array of tweets collected by param search info
* */





//Display Object gets called from input controller

/*
* Function: displayTweets
* params: tweet array
* does: loops through array and applies them to google map
* returns: updates html, returns nothing
* */

/*
 * Function: Extracts the url on each tweet
 * params: tweet array
 * does: loops through array extracts the url
 * returns: url
 * */

//var exampleTweet = "Everyone once in a while you go to train some dogs & instead you get to hang out with bab https://t.co/NXdL9vEOxR";
function find_tweet_URL(tweet){

    var output;
    console.log(tweet);
    output = tweet.match(/(https[a-zA-Z0-9\:\.\/]+).*/);
    return output[1];

}
//var url = find_tweet_URL(exampleTweet);
//console.log(url);
/**
* activates modal and sets modal close event on ready
* */
function modalActive(mode){ //no returns, utility
    var modal = $("#" + mode); //jquery method to check if hidden
    if ( modal.is( ":hidden" ) ) {
        // pointing to a jquery selector in a variable modal previously declared
        modal.css( "display", "block" );
    }
    else{
        // pointing to a jquery selector in a variable modal previously declared
        modal.css( "display", "none");
    }
}

function cycleMarkers(){
    cycling = cycling ? false: true;
    storage.cycle();
}

$(document).ready(function(){
    $("#Modal").click(function(){
        modalActive("Modal");
    })
    $("#cycle").click(function(){
        cycleMarkers();
    })

});

