const routes = [
    {
        path: '/towns',
        name: 'Towns',
        component: 'TownPanel',
        description: 'Explore various towns in the game world.'
    },
    {
        path: '/dungeons',
        name: 'Dungeons',
        component: 'DungeonPanel',
        description: 'Venture into dungeons filled with challenges and treasures.'
    },
    {
        path: '/regions',
        name: 'Regions',
        component: 'RegionsPanel',
        description: 'Discover different regions and their unique characteristics.'
    },
    {
        path: '/exploration',
        name: 'Exploration',
        component: 'ExplorationArea',
        description: 'Engage in exploration activities to uncover secrets.'
    }
];

export default routes;