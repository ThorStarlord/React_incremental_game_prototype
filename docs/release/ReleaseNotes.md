# Campaign One — Release Notes

## Status of this release

Campaign One / 1.0 is a **personal release**. The game has **not been externally playtested**: no fresh-player or external playthrough sessions were recorded, and the owner waived that requirement for 1.0 (`specification/Technical/OwnerPersonalReleaseDecision.md`). Nothing in these notes claims that the game is understandable, well paced, balanced, or fun for other players. Those questions are still open.

What has been verified is technical. Every release build plays the whole campaign through its ordinary interface in Chromium and Firefox, along two different story routes, with save, load, export and import checks along the way.

## What Campaign One is

A narrative incremental RPG. You play a stranded former imperial commander who rebuilds influence on an isolated planet by forming consequential relationships. Those relationships:

- teach durable capabilities (Traits) that change what you can do later;
- leave a remembered history that explains why later options open or close;
- let you delegate familiar, personally understood work to Copies, so your attention moves to new strategic and relational decisions.

The campaign runs from the Prologue through seven chapters to the Telluric Echo finale and a state-responsive epilogue:

1. Merchant District Crisis
2. Archive Inquiry
3. Enemies in Phase
4. Lattice Under Strain
5. The Chrono-Crypt
6. Network Under Pressure
7. Counterphase

The finale resolves through one of four strategies (Distributed Dissipation, Structural Redirection, Diagnostic Disruption, Fortified Containment), depending on the relationships, capabilities, knowledge, faction standing, and preparation you built.

## Playing

- Desktop browsers: current Chromium-class browsers (Chrome, Edge) and Firefox, at 1280×720 or larger.
- Progress is stored in the browser's local storage. Use **Save Game** in the game, and **Export** on the main menu to keep a portable copy. Autosave keeps the three most recent autosaves; saves you make yourself are never removed automatically.
- Reloading the page returns you to the main menu; **Continue** resumes your latest save.

## Fixed during release qualification

Qualification through the real interface found and fixed:

- New Game or Continue pressed during startup could reveal every character out of story order, or overwrite a loaded save (KD-010).
- Reloading mid-game dropped you into an uninitialized world (KD-012).
- There was no in-game save and no way back to the main menu, and autosave could write a non-game save from the main menu (KD-013).
- Unbounded autosaves would eventually fill browser storage (KD-014).
- The main menu and save dialogs rendered unstyled, and the Export dialog could not be closed (KD-015).
- The opening narration was hidden from assistive technology (KD-011).

## Known limitations

- **Not externally playtested** (KD-001, accepted for this release under the owner waiver).
- Combat, travel, and Copy automation are deliberately bounded to what the campaign needs; this is not a broad combat or exploration game.
- Campaign One ends on the isolated planet. Chapters 8+, the interplanetary story, New Game+, generic crafting and inventory are outside this release.
- The universal Trait redesign (draft PR #165) is not part of 1.0.
- Mobile layouts are not supported.
- Remaining lower-severity items are listed in `docs/release/KnownDefects.md`.
