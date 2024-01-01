function generateCheckReservationAvailabilityResponse(date) {
    const responseMessage = `You have [Number] tables available on ${date}.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'CheckReservationAvailability',
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

    if (intentName === 'CheckReservationAvailability') {
        const date = event.sessionState.intent.slots.Date;
        return generateCheckReservationAvailabilityResponse(date);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};