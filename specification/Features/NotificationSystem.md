Implementation Status: ✅ BOUNDED SHARED QUEUE + PRODUCTION RENDERER QUALIFIED

# Notification System Specification

Global, lightweight feedback state and production presentation for actions and events.

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

Feature thunks/listeners dispatch `addNotification`, including NPC trade, Quest, Trait, Copy, Relationship, active Forge familiarity feedback, and M21 offline-settlement feedback.

The Checkpoint-C Incremental Integration Repair adds the missing presentation bridge:

```text
feature dispatches addNotification
-> shared Redux queue stores GameNotification
-> GlobalNotificationHost consumes selectNotifications
-> MUI Snackbar + Alert renders the current shared message
-> player can dismiss
-> removeNotification removes that queue entry
```

`GlobalNotificationHost` is mounted once in `GameLayout`.

See:

- `../Technical/CheckpointCIncrementalIntegrationResult.md` — historical first `CHECKPOINT_C_WEAK` finding;
- `../Technical/IncrementalIntegrationRepair.md` — preregistered repair contract;
- `../Technical/IncrementalIntegrationRepairReconAmendment.md` — frozen renderer decision;
- `../Technical/IncrementalIntegrationRepairResult.md` — qualified repair result.

## 2. Historical Checkpoint C finding and repair

The first Checkpoint C evaluation found that the shared Redux queue existed but the production component tree did not demonstrate a consumer of `selectNotifications` / `state.notifications.items`.

`useMenuNotifications` was and remains a separate local React-state hook. It is not the shared Redux renderer.

Historical pre-repair state:

```text
feature dispatches addNotification
-> shared Redux queue stores GameNotification
-> no qualified mounted shared renderer
```

Qualified repaired state:

```text
feature dispatches notification
-> shared queue
-> mounted GlobalNotificationHost
-> player-visible Alert
-> shared dismissal/removal
```

The repair does not merge the local menu-notification hook into this authority and does not create an M21-specific duplicate store.

## 3. Production renderer

`src/shared/components/ui/GlobalNotificationHost.tsx` is the bounded production renderer.

Current qualified behavior:

- consumes `selectNotifications`;
- renders the most recent queued shared notification so a newly generated return summary is immediately legible;
- maps `GameNotification.type` to Material UI Alert severity;
- uses `Snackbar` + `Alert`;
- provides Alert close/dismiss behavior;
- removes the rendered entry through `removeNotification`;
- mounts once in `GameLayout`.

When `GameNotification.timeout` is absent, the current host uses a bounded five-second display default. A supplied timeout is honored by the host.

The repair qualifies a single shared player-visible host and queue lifecycle. It does not qualify a rich notification center or long-term notification-history product.

## 4. M21 return-feedback integration

M21 already constructs a bounded summary after a positive offline settlement:

```text
While you were away: ...
```

The repair now qualifies the complete presentation path:

```text
settleOfflineProgressThunk
-> addNotification
-> notifications.items
-> GlobalNotificationHost
-> player-visible Alert
```

The composed repair test specifically proves a saved running Forge Assistance task completing through M21 and the resulting `While you were away` summary being visibly rendered.

This closes the presentation seam identified by the first Checkpoint C evaluation. A fresh Checkpoint C rerun is still required to decide the overall product verdict.

## 5. Integration

Current shared notification producers include ordinary feature feedback from:

- Trait actions;
- Copy actions;
- Quest updates;
- NPC/trading actions;
- Relationship actions;
- active City Center Forge familiarity;
- M21 offline settlement.

The existence of one shared production renderer does not imply that every producer must eventually use identical timeout, stacking, history, or interruption policy. Those broader UX decisions remain outside the bounded repair evidence.

## 6. Evidence ceiling / non-goals

The qualified repair does not establish:

- a notification center/history panel;
- durable notification history across sessions as a product requirement;
- per-feature channels or mute settings;
- rich inline actions;
- deep links;
- notification analytics;
- multi-toast stacking policy at scale;
- final timeout/accessibility/user-comprehension tuning;
- a generalized event-bus redesign.

It qualifies the smaller requirement needed by Checkpoint C: the existing shared queue now has a mounted production presentation and dismissal path, including visible M21 return feedback.
