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