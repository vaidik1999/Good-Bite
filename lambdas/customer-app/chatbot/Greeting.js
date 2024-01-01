function generateGreetingResponse() {
    const responseMessage = "Hi, how can I help you?";
    
    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'Greeting',
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

    if (intentName === 'Greeting') {
        return generateGreetingResponse();
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
