function generateManageReservationsResponse(actionType, reservationDetails) {
    const responseMessage = `The reservation for ${reservationDetails} has been ${actionType}.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ManageReservations',
                state: 'Fulfilled',
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

module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;

    if (intentName === 'ManageReservations') {
        const slots = event.sessionState.intent.slots;
        return generateManageReservationsResponse(slots.ActionType, slots.ReservationDetails);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};