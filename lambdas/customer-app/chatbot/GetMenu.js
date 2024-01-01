function generateGetMenuResponse(menu) {
    const responseMessage = "Here is your menu.\n";

    const formattedItems = items.map(item => {
        return `Item ID: ${item.item_id}\nItem Name: ${item.item_name}\nDescription: ${item.description}\nCategory: ${item.category}\nPrice: ${item.price}`;
    }).join('\n\n');

    return {
        sessionState: {
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: 'GetMenu',
                state: 'Fulfilled',
                slots: {
                    menu: menu,
                },
            },
        },
        messages: [
            {
                contentType: 'PlainText',
                content: `${responseMessage}\n\n${formattedItems}`,
            },
        ],
    };
}

    const items = [
        {
            item_id: "1",
            item_name: "pasta",
            description: "it is a pasta",
            category: "vegan",
            price: "15.00"
        },
        {
            item_id: "2",
            item_name: "chicken noodles",
            description: "it is noodles made from chicken",
            category: "non-veg",
            price: "20.00"
        }
    ];

module.exports = async (event) => {
    const intentName = event.sessionState.intent.name;

    if (intentName === 'GetMenu') {
        const menu = event.sessionState.intent.slots.menu;
        return generateGetMenuResponse(menu);
    }
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};

// function generateGetMenuResponse(menu) {
//     const responseMessage = "Here is your menu.";
    
//     return {
//         sessionState: {
//             dialogAction: {
//                 type: 'Close',
//             },
//             intent: {
//                 name: 'GetMenu',
//                 state: 'Fulfilled', 
//                 slots: {
//                     menu: menu,
//                 },
//             },
//         },
//         messages: [
//             {
//                 contentType: 'PlainText',
//                 content: responseMessage,
//             },
//         ],
//     };
// }

// module.exports = async (event) => {
//     const intentName = event.sessionState.intent.name;

//     if (intentName === 'GetMenu') {
//         const menu = event.sessionState.intent.slots.menu;
//         return generateGetMenuResponse(menu);
//     }
//     return {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
// };
