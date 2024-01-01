function generateCheckMenuAvailabilityResponse(menuItem) {
    const responseMessage = `${menuItem} is available/not available.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'CheckMenuAvailability',
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

    if (intentName === 'CheckMenuAvailability') {
        const menuItem = event.sessionState.intent.slots.MenuItem;
        return generateCheckMenuAvailabilityResponse(menuItem);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};