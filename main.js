/*
* Object for storing global variables
* possible: input value strings for jquery selections
* possible: tweet location holder,  geolocation coordiantes when map click
*
* */


/*
* Document Ready function
* holds button click events to activate correct functions
* */


/*
* Function: getLocation
* params: *onclick data
* does: takes location data from google maps api and calls getTweetsByLocation
* return: nothing;
* */


/*
*Function: getTweetsbySearch for tags function
* params: takes in text input
* does: makes api call and stores tweets
* returns: an array of tweets collected by param search info
* */


/*
* Function: getTweetsbyLocation,
* params: takes in coordinates/city *type depends on twitter api search requirements
* does: makes api call and stores tweets
* returns: an array of tweets collected by param search info
* */


/*
* Function: parseTweets,
 * params: tweet objects?
 * does: filters tweet info down to tweet text and location info
 * returns: an array of tweet objects that holds tweet text and location data
* */


/*
* Function: displayTweets
* params: tweet array
* does: loops through array and applies them to google map api
* returns: updates html, returns nothing
* */