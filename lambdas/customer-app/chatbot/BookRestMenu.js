function generateBookRestMenuResponse(reservation, guests, menu) {
    const responseMessage = "Thanks for booking!!!";
    const isBookingSuccessful = true; 

    if (isBookingSuccessful) {
        const successMessage = "Your booking is complete now.";
        return {
            sessionState: {
                dialogAction: {
                    type: 'Close',
                },
                intent: {
                    name: 'BookRestMenu',
                    state: 'Fulfilled', 
                    slots: {
                        reservation: reservation,
                        guests: guests,
                        menu: menu,
                    },
                },
            },
            messages: [
                {
                    contentType: 'PlainText',
                    content: successMessage,
                },
            ],
        };
    } else {
        const failureMessage = "Something went wrong!!!";
        return {
            sessionState: {
                dialogAction: {
                    type: 'Close',
                },
                intent: {
                    name: 'BookRestMenu',
                    state: 'Failed', 
                    slots: {
                        reservation: reservation,
                        guests: guests,
                        menu: menu,
                    },
                },
            },
            messages: [
                {
                    contentType: 'PlainText',
                    content: failureMessage,
                },
            ],
        };
    }
}
 module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;

    if (intentName === 'BookRestMenu') {
        const reservation = event.sessionState.intent.slots.reservation;
        const guests = event.sessionState.intent.slots.guests;
        const menu = event.sessionState.intent.slots.menu;
        return generateBookRestMenuResponse(reservation, guests, menu);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
