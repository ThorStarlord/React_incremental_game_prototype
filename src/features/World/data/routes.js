export const routes = [
    {
        id: 'oakhaven-stonefang',
        from: 'oakhaven',
        to: 'stonefangHold',
        type: 'road',
        description: 'The Mountain Pass - A well-traveled road connecting Oakhaven to Stonefang Hold',
        path: 'M 100 100 Q 250 125, 400 150' // Curved path between the towns
    },
    {
        id: 'oakhaven-salty',
        from: 'oakhaven',
        to: 'saltyWharf',
        type: 'coastal-road',
        description: 'The Coastal Trail - A winding path down to Salty Wharf',
        path: 'M 100 100 Q 125 225, 150 350'
    },
    {
        id: 'stonefang-windrider',
        from: 'stonefangHold',
        to: 'windriderCamp',
        type: 'trail',
        description: 'The Plains Path - A rugged trail to the Windrider Camp',
        path: 'M 400 150 Q 450 225, 500 300'
    }
];