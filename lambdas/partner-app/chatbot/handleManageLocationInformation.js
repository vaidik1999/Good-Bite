function generateManageLocationInformationResponse(actionType, newAddress) {
    const responseMessage = `The location information has been ${actionType} to ${newAddress}.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ManageLocationInformation',
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

    if (intentName === 'ManageLocationInformation') {
        const slots = event.sessionState.intent.slots;
        return generateManageLocationInformationResponse(slots.ActionType, slots.NewAddress);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};