const axios = require('axios');

const GreetingIntent = require('./Greeting.js');
const AvailableRestaurantsIntent = require('./AvailableRestaurants.js');
const GetMenuIntent = require('./GetMenu.js');
const ReviewMenuIntent = require('./ReviewMenu.js');
const ReservationAvailabilityIntent = require('./ReservationAvailability.js');
const ReviewRestaurantIntent = require('./ReviewRestaurant.js');
const RatingRestaurantIntent = require('./RatingRestaurant.js');
const BookRestaurantIntent = require('./BookRestaurant.js');
const BookRestMenuIntent = require('./BookRestMenu.js');
const LocationInfoIntent = require('./LocationInfo.js');

exports.handler = async (event) => {
    const intentName = event.sessionState.intent.name;
    
    
    console.log(intentName, "Intent Name");
    console.log(JSON.stringify(event));

    if (intentName === 'Greeting') {
        return GreetingIntent(event);
    } else if (intentName === 'AvailableRestaurants') {
        return AvailableRestaurantsIntent(event);
    } else if (intentName === 'GetMenu') {
        return GetMenuIntent(event);
    } else if (intentName === 'ReviewMenu') {
        return ReviewMenuIntent(event);
    } else if (intentName === 'ReservationAvailability') {
        return ReservationAvailabilityIntent(event);
    } else if (intentName === 'ReviewRestaurant') {
        return ReviewRestaurantIntent(event);
    }else if (intentName === 'RatingRestaurant') {
        return RatingRestaurantIntent(event);
    }else if (intentName === 'BookRestaurant') {
        return BookRestaurantIntent(event);
    }else if (intentName === 'BookRestMenu') {
        return BookRestMenuIntent(event);
    }else if (intentName === 'LocationInfo') {
        console.log('LocationInfoIntent Root Directory');
        return LocationInfoIntent(event);
    }else {
        console.log('hello');
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
