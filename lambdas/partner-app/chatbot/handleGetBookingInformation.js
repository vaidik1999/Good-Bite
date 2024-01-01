function generateGetBookingInformationResponse(timePeriod) {
    
    const responseMessage = `Here are the bookings for ${timePeriod}.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'GetBookingInformation',
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

    if (intentName === 'GetBookingInformation') {
        const timePeriod = event.sessionState.intent.slots.TimePeriod;
        return generateGetBookingInformationResponse(timePeriod);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};