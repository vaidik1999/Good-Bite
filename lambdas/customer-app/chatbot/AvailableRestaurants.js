const { getResturants } = require("./API.js");

async function resturants(address) {
    const allRestaurants = await getResturants();

    const responseMessage = "Here is your available restaurants list.";

    return {
        sessionState: {
            dialogAction: {
                slotToElicit: "Resturants",
                type: "ElicitSlot",
            },
            intent: {
                name: 'AvailableRestaurants',
                state: 'Fulfilled',
                slots: {
                    City: address,
                },
            },
        },
        messages: [
            {
                contentType: "ImageResponseCard",
                content: "Can you select the restaurant?",
                imageResponseCard: {
                    title: "Restaurants",
                    subtitle: "Can you select a restaurant?",
                    buttons: allRestaurants.slice(0, 4).map(item => (
                        {
                            text: item.res_name,
                            // value: `${item.res_name}_${item.restaurant_id}`,
                            value: item.res_name,
                        }
                    )),
                },
            },
        ],
    };
}

async function generateAvailableRestaurantsResponse(address) {
    const responseMessage = "Can you please enter the city name?";

    return {
        sessionState: {
            dialogAction: {
                slotToElicit: "City",
                type: "ElicitSlot",
            },
            intent: {
                name: 'AvailableRestaurants',
                slots: {
                    City: address,
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
}

async function getRestaurantDetails(restaurantName) {
    const allRestaurants = await getResturants();
    console.log(allRestaurants, restaurantName);
    const selectedRestaurant = allRestaurants.find(item => item.res_name === restaurantName.value.originalValue);
    
    if (selectedRestaurant) {
        return {
            res_opening_time: selectedRestaurant.res_opening_time,
            res_closing_time: selectedRestaurant.res_closing_time,
            res_location: selectedRestaurant.res_location,
            restaurant_id: selectedRestaurant.restaurant_id,
        };
    } else {
        return null; 
    }
}

module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;
    console.log(event)
    if (intentName === 'AvailableRestaurants') {
        const slots = event.sessionState.intent.slots;

        if (slots.City == null) {
            return generateAvailableRestaurantsResponse();
        }

        if (slots.Resturants == null) {
            return resturants(slots.City);
        } else {
            const selectedRestaurantName = slots.Resturants;
            const restaurantDetails = await getRestaurantDetails(selectedRestaurantName);
            if (restaurantDetails) {
                console.log('Restaurant ID:', restaurantDetails.restaurant_id);
                return {
                    sessionState: {
                        dialogAction: {
                            type: 'Close',
                        },
                        intent: {
                            name: 'AvailableRestaurants',
                            state: 'Fulfilled',
                            slots: {
                                ...event.sessionState.intent.slots,
                            },
                        },
                    },
                    messages:[
                        {
                            "contentType":"PlainText",
                            content:`${restaurantDetails.res_opening_time} is Opening Time.\n${restaurantDetails.res_closing_time} is Closing Time.\n${restaurantDetails.res_location}`
                            
                        }
                    ],
                    restaurant_id: restaurantDetails.restaurant_id,
                };
            } else {
                return generateAvailableRestaurantsResponse(slots.City);
            }
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};

// const { getResturants } = require("./API.js");

// async function resturants(address) {
//     const allRestaurants = await getResturants();

//     const responseMessage = "Here is your available restaurants list.";

//     return {
//         sessionState: {
//             dialogAction: {
//                 slotToElicit: "Resturants",
//                 type: "ElicitSlot",
//             },
//             intent: {
//                 name: 'AvailableRestaurants',
//                 state: 'Fulfilled',
//                 slots: {
//                     City: address,
//                 },
//             },
//         },
//         messages: [
//             {
//                 contentType: "ImageResponseCard",
//                 content: "Can you select the restaurant?",
//                 imageResponseCard: {
//                     title: "Restaurants",
//                     subtitle: "Can you select a restaurant?",
//                     buttons: allRestaurants.slice(0, 4).map(item => (
//                         {
//                             text: item.res_name,
//                             value: item.res_name,
//                         }
//                     )),
//                 },
//             },
//         ],
//     };
// }

// async function generateAvailableRestaurantsResponse(address) {
//     const responseMessage = "Can you please enter the city name?";

//     return {
//         sessionState: {
//             dialogAction: {
//                 slotToElicit: "City",
//                 type: "ElicitSlot",
//             },
//             intent: {
//                 name: 'AvailableRestaurants',
//                 slots: {
//                     City: address,
//                 },
//             },
//         },
//         messages: [
//             {
//                 contentType: 'PlainText',
//                 content: responseMessage,
//             },
//         ],
//     };
// }

// async function getRestaurantDetails(restaurantName) {
//     const allRestaurants = await getResturants();
//     console.log(allRestaurants, restaurantName);
//     const selectedRestaurant = allRestaurants.find(item => item.res_name === restaurantName.value.originalValue);
    
//     if (selectedRestaurant) {
//         return {
//             res_opening_time: selectedRestaurant.res_opening_time,
//             res_closing_time: selectedRestaurant.res_closing_time,
//             res_location: selectedRestaurant.res_location,
//         };
//     } else {
//         return null; 
//     }
// }

// module.exports = async (event) => {
//     const intentName = event.sessionState.intent.name;
//     console.log(event)
//     if (intentName === 'AvailableRestaurants') {
//         const slots = event.sessionState.intent.slots;

//         if (slots.City == null) {
//             return generateAvailableRestaurantsResponse();
//         }

//         if (slots.Resturants == null) {
//             return resturants(slots.City);
//         } else {
//             const selectedRestaurantName = slots.Resturants;
//             const restaurantDetails = await getRestaurantDetails(selectedRestaurantName);
//             if (restaurantDetails) {
//                 return {
//                     sessionState: {
//                         dialogAction: {
//                             type: 'Close',
//                         },
//                         intent: {
//                             name: 'AvailableRestaurants',
//                             state: 'Fulfilled',
//                             slots: {
//                                 ...event.sessionState.intent.slots,
//                             },
//                         },
//                     },
//                     messages:[
//                         {
//                             "contentType":"PlainText",
//                             content:`${restaurantDetails.res_opening_time} is Opening Time.\n${restaurantDetails.res_closing_time} is Closing Time.\n${restaurantDetails.res_location}`
                            
//                         }
//                     ]
//                 };
//             } else {
//                 return generateAvailableRestaurantsResponse(slots.City);
//             }
//         }
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
// };