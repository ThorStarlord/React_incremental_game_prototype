/**
 * @file NotificationSlice.ts
 * @description Global (lightweight) notification system for transient UI messages.
 */
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export type NotificationLevel = 'success' | 'error' | 'info' | 'warning';

export interface GameNotification {
  id: string;
  message: string;
  type: NotificationLevel;
  timestamp: number;
  /** Optional auto-dismiss timeout in ms (0/undefined = manual). */
  timeout?: number;
}

interface NotificationsState {
  items: GameNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

interface AddNotificationPayload {
  message: string;
  type?: NotificationLevel;
  timeout?: number;
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      /** Add a notification to the queue. */
      reducer: (state, action: PayloadAction<GameNotification>) => {
        state.items.push(action.payload);
      },
      prepare: ({ message, type = 'info', timeout }: AddNotificationPayload) => ({
        payload: {
          id: nanoid(),
          message,
          type,
          timestamp: Date.now(),
          timeout,
        } as GameNotification,
      }),
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationsSlice.actions;

/** Select all active notifications (most recent last). */
export const selectNotifications = (state: RootState) => state.notifications.items;

export default notificationsSlice.reducer;
