const handleGetBookingInformation = require('./handleGetBookingInformation');
const handleManageOpeningTimes = require('./handleManageOpeningTimes');
const handleManageLocationInformation = require('./handleManageLocationInformation');
const handleCheckMenuAvailability = require('./handleCheckMenuAvailability');
const handleCheckReservationAvailability = require('./handleCheckReservationAvailability');
const handleReadReviews = require('./handleReadReviews');
const handleReadRestaurantRating = require('./handleReadRestaurantRating');
const handleManageReservations = require('./handleManageReservations');

exports.handler = async (event) => {
    const intentName = event.currentIntent.name;
    const slots = event.currentIntent.slots;

    let response;

    if (intentName === 'GetBookingInformation') {
        response = await handleGetBookingInformation(slots);
    } else if (intentName === 'ManageOpeningTimes') {
        response = await handleManageOpeningTimes(slots);
    } else if (intentName === 'ManageLocationInformation') {
        response = await handleManageLocationInformation(slots);
    } else if (intentName === 'CheckMenuAvailability') {
        response = await handleCheckMenuAvailability(slots);
    } else if (intentName === 'CheckReservationAvailability') {
        response = await handleCheckReservationAvailability(slots);
    } else if (intentName === 'ReadReviews') {
        response = await handleReadReviews(slots);
    } else if (intentName === 'ReadRestaurantRating') {
        response = await handleReadRestaurantRating();
    } else if (intentName === 'ManageReservations') {
        response = await handleManageReservations(slots);
    } else {
        response = {
            dialogAction: {
                type: 'Close',
                fulfillmentState: 'Fulfilled',
                message: {
                    contentType: 'PlainText',
                    content: "I'm sorry, I couldn't understand your request."
                }
            }
        };
    }

    return response;
};