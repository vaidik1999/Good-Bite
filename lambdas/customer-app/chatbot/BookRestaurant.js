const axios = require('axios');

function generateBookRestaurantResponse(event, restaurant, guests, intentName, reservationDate, reservationTime, specialRequests, tableNumber, customerId) {
    console.log('Generating BookRestaurant Response...');

    const responseMessage = "Thanks for booking!!!";
    const reservationPayload = {
        customer_id: customerId,
        menu_items: [],
        number_of_guests: guests,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        restaurant_id: restaurant,
        special_requests: specialRequests,
        table_number: tableNumber,
    };

    console.log('Reservation Payload:', reservationPayload);

    return axios.post('https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/book-reservation', reservationPayload)
        .then((response) => {
            console.log('API Response:', response.data);

            if (response.status === 200) {
                console.log('Booking Successful!');
                return {
                    sessionState: {
                        dialogAction: {
                            type: 'Close',
                        },
                        intent: {
                            name: 'BookRestaurant',
                            state: 'Fulfilled',
                            slots: {
                                ...event.sessionState.intent.slots,
                            },
                        },
                    },
                    messages: [
                        {
                            contentType: 'PlainText',
                            content: responseMessage,
                        },
                    ],
                };
            } else {
                console.log('Booking Failed! Status Code:', response.status);
                return {
                    sessionState: {
                        dialogAction: {
                            type: 'Close',
                        },
                        intent: {
                            name: 'BookRestaurant',
                            state: 'Failed',
                            slots: {
                                ...event.sessionState.intent.slots,
                            },
                        },
                    },
                    messages: [
                        {
                            contentType: 'PlainText',
                            content: 'Reservation failed. Please try again later.',
                        },
                    ],
                };
            }
        })
        .catch((error) => {
            console.error('Error calling API:', error.message);

            return {
                sessionState: {
                    dialogAction: {
                        type: 'Close',
                    },
                    intent: {
                        name: 'BookRestaurant',
                        state: 'Failed',
                        slots: {
                                ...event.sessionState.intent.slots,
                            },
                    },
                },
                messages: [
                    {
                        contentType: 'PlainText',
                        content: 'Reservation failed. Please try again later.',
                    },
                ],
            };
        });
}

module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;

    console.log('Received Intent:', intentName);

    if (intentName === 'BookRestaurant') {
        const restaurant = event.sessionState.intent.slots.restaurant.value.originalValue;
        const guests = event.sessionState.intent.slots.guests.value.originalValue;
        const reservationDate = event.sessionState.intent.slots.reservationDate.value.originalValue;
        const reservationTime = event.sessionState.intent.slots.reservationTime.value.originalValue;
        const specialRequests = event.sessionState.intent.slots.specialRequests ? event.sessionState.intent.slots.specialRequests.value.originalValue : "";
        const tableNumber = event.sessionState.intent.slots.tableNumber ? event.sessionState.intent.slots.tableNumber.value.originalValue : "";
        const customerId = event.sessionState.intent.slots.customerId.value.originalValue;

        console.log('Booking Details - Restaurant:', restaurant, 'Guests:', guests, 'Reservation Date:', reservationDate, 'Reservation Time:', reservationTime);

        return generateBookRestaurantResponse(event, restaurant, guests, intentName, reservationDate, reservationTime, specialRequests, tableNumber, customerId);
    }

    console.log('Returning Default Response...');
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};


// function generateBookRestaurantResponse(restaurant, guests) {
//     const responseMessage = "Thanks for booking!!!";

//     const isBookingSuccessful = true; 

//     if (isBookingSuccessful) {
//         const successMessage = "Your booking is complete now.";
//         return {
//             sessionState: {
//                 dialogAction: {
//                     type: 'Close',
//                 },
//                 intent: {
//                     name: 'BookRestaurant',
//                     state: 'Fulfilled', 
//                     slots: {
//                         restaurant: restaurant,
//                         guests: guests,
//                     },
//                 },
//             },
//             messages: [
//                 {
//                     contentType: 'PlainText',
//                     content: successMessage,
//                 },
//             ],
//         };
//     } else {
//         const failureMessage = "Something went wrong!!!";
//         return {
//             sessionState: {
//                 dialogAction: {
//                     type: 'Close',
//                 },
//                 intent: {
//                     name: 'BookRestaurant',
//                     state: 'Failed', 
//                     slots: {
//                         restaurant: restaurant,
//                         guests: guests,
//                     },
//                 },
//             },
//             messages: [
//                 {
//                     contentType: 'PlainText',
//                     content: failureMessage,
//                 },
//             ],
//         };
//     }
// }

// module.exports = async (event) => {
//     const intentName = event.sessionState.intent.name;

//     if (intentName === 'BookRestaurant') {
//         const restaurant = event.sessionState.intent.slots.restaurant;
//         const guests = event.sessionState.intent.slots.guests;
//         return generateBookRestaurantResponse(restaurant, guests);
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
// };
