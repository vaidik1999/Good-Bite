function generateReviewRestaurantResponse(review) {
    const responseMessage = "Thanks for your review!!!";
    
    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ReviewRestaurant',
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

    if (intentName === 'ReviewRestaurant') {
        const review = event.sessionState.intent.slots.review;
        return generateReviewRestaurantResponse(review);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};
