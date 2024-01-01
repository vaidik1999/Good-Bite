function generateReservationAvailabilityResponse(table) {
    const responseMessage = "Here is your restaurant availability.";
    
    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ReservationAvailability',
                state: 'Fulfilled', 
                slots: {
                    table: table,
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

module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;

    if (intentName === 'ReservationAvailability') {
        const table = event.sessionState.intent.slots.table;
        return generateReservationAvailabilityResponse(table);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
