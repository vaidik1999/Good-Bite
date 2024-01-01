function generateLocationInfoResponse(address, time) {
    const responseMessage = "Here is your restaurant details.";
    console.log("------------------------------------------------------")
    console.log(address);
    console.log(time);
    const isInfoRetrievalSuccessful = true; 

if (isInfoRetrievalSuccessful) {
        return {
            sessionState: {
                dialogAction: {
                    type: 'Close',
                },
                intent: {
                    name: 'LocationInfo',
                    state: 'Fulfilled', // Set the IntentState to "Fulfilled"
                    slots: {
                        address: address,
                        time: time,
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
        const failureMessage = "Something went wrong while retrieving restaurant details.";
        return {
            sessionState: {
                dialogAction: {
                    type: 'Close',
                },
                intent: {
                    name: 'LocationInfo',
                    slots: {
                        address: address,
                        time: time,
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

    if (intentName === 'LocationInfo') {
        const address = event.sessionState.intent.slots.address;
        const time = event.sessionState.intent.slots.time;
        return generateLocationInfoResponse(address, time);
    }
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};