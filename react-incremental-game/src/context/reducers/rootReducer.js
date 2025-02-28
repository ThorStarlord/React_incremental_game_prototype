import { combineReducers } from 'redux';
import essenceReducer from './essenceReducer';
import inventoryReducer from './inventoryReducer';
import npcReducer from './npcReducer';
import playerReducer from './playerReducer';
import questReducer from './questReducer';

const rootReducer = combineReducers({
    essence: essenceReducer,
    inventory: inventoryReducer,
    npc: npcReducer,
    player: playerReducer,
    quest: questReducer,
});

export default rootReducer;