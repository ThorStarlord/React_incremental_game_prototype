# Intent

## Users and job
- Players of a narrative incremental RPG where relationships teach capabilities and remembered history explains later options. [policy: specification/GameDesignDocument.md]
- The repo owner, who can revise scope and change Beta/RC promotion requirements ([CLAUDE.md](../CLAUDE.md)). [policy: AGENTS.md]

## Current goals
- Ship Campaign One as a personal 1.0 release: pass the release contract's technical gates on one exact candidate, disclosed as not externally playtested. [owner: 2026-10-20]
- Repository-answerable repairs are wanted now; missing human evidence limits claims but does not block them. [policy: AGENTS.md]

## Non-goals (1.0)
- No generic ChapterEngine, narrative condition DSL, procedural campaign generation, or live-service backend. [policy: specification/Features/FeatureScopeMatrix.md]
- No autonomous Copy planning, offline narrative/quest progression, or generic Copy task chaining. [policy: specification/Features/FeatureScopeMatrix.md]
- No general crafting economy or separate Skills/skill-tree system; Traits own capability progression. [policy: specification/Features/FeatureScopeMatrix.md]
- Equipment and interplanetary continuation are deferred post-1.0. [policy: specification/Features/FeatureScopeMatrix.md]
- Do not expand cut or deferred scope merely to create work. [policy: CLAUDE.md]

## Open owner questions
- None blocking 1.0. Human Product Review (issue #109) stays open and unproven as an optional post-1.0 lane. [owner: 2026-10-20]

## Delegated choices (agent-made, not owner answers)
The owner delegated these choices to the agent on 2026-10-12. They are working defaults, not owner intent. Each stays `[delegated]` until the owner confirms or replaces it with an `[owner: date]` line. A plain `[hypothesis]` is an agent inference, not a decision.
- Next evidence step: run the M5 comprehension protocol in issue #26 with one fresh participant before any tuning work. It is the smallest written protocol already in the repo. [delegated: 2026-10-12] Evidence authority stays with issue #109. Superseded as a 1.0 step by the 2026-10-20 owner waiver; optional post-1.0.
- Beta tuning targets: none set. The Beta contract says no duration target is authoritative until play data exists, so ranges are recorded from human sessions rather than invented ([contract](../specification/Technical/BetaCompletionContract.md)). [delegated: 2026-10-12]

## Answered owner questions
- Intent review: approved by the owner on 2026-10-12, with the external-playtesting deferral above. [owner: 2026-10-12]
- 1.0 bar: personal release. The human Beta floor is waived as a 1.0 gate, not satisfied; BETA_PASS stays NO; release notes must say the game was not externally playtested. Recorded in `specification/Technical/OwnerPersonalReleaseDecision.md`. [owner: 2026-10-20]
- Universal Trait redesign (draft PR #165): parked until after 1.0. [owner: 2026-10-20]
- Merge authority: the agent may merge its own PRs once exact-head Build Validation passes. [owner: 2026-10-20]
- External playtesting: previously DEFERRED / TBD with no owner or date. [owner: 2026-10-12]
