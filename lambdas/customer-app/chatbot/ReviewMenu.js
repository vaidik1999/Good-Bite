function generateReviewMenuResponse(review) {
    const responseMessage = "Thanks for your review!!!";
    
    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ReviewMenu',
                state: 'Fulfilled', 
                slots: {
                    review: review,
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

    if (intentName === 'ReviewMenu') {
        const review = event.sessionState.intent.slots.review;
        return generateReviewMenuResponse(review);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
