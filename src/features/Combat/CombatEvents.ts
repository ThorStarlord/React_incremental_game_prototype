import { createAction } from '@reduxjs/toolkit';

/** Transient application event consumed by quest/objective listeners. */
export const targetKilled = createAction<{ targetId: string }>('combat/targetKilled');
