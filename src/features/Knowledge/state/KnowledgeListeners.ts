import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { practiceForgeAssistanceThunk } from '../../Exploration/TravelThunks';
import { isPlayerAtNpcWorldLocation } from '../../NPCs/state/NPCWorldLocationDefinitions';
import { FORGE_ASSISTANCE_PRACTICED_FACT_ID } from '../KnowledgeDefinitions';
import { learnNpcFact } from './KnowledgeSlice';

export const knowledgeListeners = createListenerMiddleware<RootState>();

const GRONK_ID = 'npc_blacksmith_gronk';

/**
 * M22 direct-witness bridge.
 * Objective truth remains Player Forge familiarity; Knowledge only records that
 * canonically co-present Gronk witnessed the already-qualified active event.
 */
knowledgeListeners.startListening({
  matcher: practiceForgeAssistanceThunk.fulfilled.match,
  effect: async (_action, api) => {
    const state = api.getState();
    if (
      state.player.routineFamiliarity?.forge_assistance &&
      isPlayerAtNpcWorldLocation(GRONK_ID, state.player.location) === true
    ) {
      api.dispatch(learnNpcFact({
        npcId: GRONK_ID,
        factId: FORGE_ASSISTANCE_PRACTICED_FACT_ID,
      }));
    }
  },
});

export default knowledgeListeners;
