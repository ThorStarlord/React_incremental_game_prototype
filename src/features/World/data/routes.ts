import { RouteModelInterface } from './dataModels';

/**
 * Interface for a travel route between towns
 * 
 * @interface Route
 * @property {string} id - Unique identifier for the route
 * @property {string} from - Town ID of the starting point
 * @property {string} to - Town ID of the destination
 * @property {string} type - Type of route (road, trail, etc.)
 * @property {string} description - Description of the route
 * @property {string} path - SVG path specification for rendering the route on a map
 */
interface Route {
    id: string;
    from: string;
    to: string;
    type: string;
    description: string;
    path: string;
}

/**
 * Array of route data objects that define all travel paths between towns
 * 
 * @type {Route[]}
 */
export const routes: Route[] = [
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

/**
 * Get routes connected to a specific town
 * 
 * @param {string} townId - ID of the town
 * @returns {Route[]} Array of routes that connect to the specified town
 */
export const getRoutesForTown = (townId: string): Route[] => {
    return routes.filter(route => route.from === townId || route.to === townId);
};

/**
 * Get a route by its ID
 * 
 * @param {string} id - ID of the route to find
 * @returns {Route | undefined} The route object or undefined if not found
 */
export const getRouteById = (id: string): Route | undefined => {
    return routes.find(route => route.id === id);
};

/**
 * Get a route between two towns (in either direction)
 * 
 * @param {string} town1 - ID of the first town
 * @param {string} town2 - ID of the second town
 * @returns {Route | undefined} The route object or undefined if no direct route exists
 */
export const getRouteBetweenTowns = (town1: string, town2: string): Route | undefined => {
    return routes.find(route => 
        (route.from === town1 && route.to === town2) || 
        (route.from === town2 && route.to === town1)
    );
};

/**
 * Export Route interface for use in other files
 */
export type { Route };
