function generateReadReviewsResponse(reviewType, menuItem) {
    const responseMessage = `Here are the recent reviews for ${reviewType} ${menuItem ? 'about ' + menuItem : ''}.`;

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'ReadReviews',
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

    if (intentName === 'ReadReviews') {
        const slots = event.sessionState.intent.slots;
        return generateReadReviewsResponse(slots.ReviewType, slots.MenuItem);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};