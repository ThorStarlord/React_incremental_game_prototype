Implementation Status: ⚠️ PARTIAL — shared Redux queue implemented; production toast renderer not currently demonstrated

# Notification System Specification

Global, lightweight feedback state for actions and events.

## 1. Current authoritative runtime

The implemented shared notification substrate is `src/shared/state/NotificationSlice.ts`.

It provides:

```text
notifications.items
addNotification
removeNotification
clearNotifications
selectNotifications
```

Current notification shape:

```ts
GameNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timestamp: number
  timeout?: number
}
```

Several feature thunks/listeners dispatch `addNotification`, including NPC trade, Quest, Trait, Copy, Relationship, and M21 offline-settlement feedback.

## 2. Checkpoint C presentation finding

Checkpoint C repository inspection did **not** find a production component consuming `selectNotifications` / `state.notifications.items` and rendering the shared queue into the mounted application layout.

`useMenuNotifications` is a separate local React-state hook. It is not a renderer for the shared Redux queue.

Therefore the current proven loop is:

```text
feature dispatches addNotification
-> shared Redux queue stores GameNotification
```

The stronger intended loop is **not yet qualified**:

```text
feature dispatches notification
-> shared queue
-> mounted toast / notification surface
-> player sees message
-> lifecycle/dismissal
```

This gap is especially material for M21 because the bounded `While you were away` summary is dispatched into the shared queue after offline settlement but is not yet proven player-visible.

See `../Technical/CheckpointCIncrementalIntegrationResult.md`.

## 3. Intended UI/UX

A bounded repair should render the existing shared queue in a production player-facing surface rather than creating another notification authority solely for M21.

Desired behavior:

- toast/stack presentation for queued notifications;
- severity mapped from `GameNotification.type`;
- dismissal through `removeNotification`;
- optional timeout behavior consistent with `GameNotification.timeout`;
- accessible `role="status"` / `role="alert"` semantics as appropriate;
- no duplication of notification state into another global store.

A Notification Center/history panel is optional and remains outside the current repair requirement.

## 4. Integration

Current notification producers include ordinary feature feedback from:

- Trait actions;
- Copy actions;
- Quest updates;
- NPC/trading actions;
- Relationship actions;
- M21 offline settlement.

Checkpoint C does not claim that all producer messages require identical presentation policy. It establishes only that the shared queue currently lacks demonstrated production rendering and that M21 return feedback therefore needs a bounded presentation bridge.

## 5. Non-goals

The Checkpoint-C repair does not require:

- per-feature channels;
- notification analytics/history persistence;
- rich inline actions;
- deep links;
- generalized messaging/event-bus redesign;
- a second M21-specific notification store.

Those remain optional future enhancements after the basic shared queue is player-visible.
