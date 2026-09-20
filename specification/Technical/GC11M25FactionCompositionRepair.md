# GC-11 Alpha Repair — M25 Public-Order Faction Composition

**Status:** QUALIFICATION REPAIR  
**Prepared:** 2026-09-20

## Finding

The fresh-save Alpha route exposed an inherited composition mismatch in the M25 public-order conclusion.

The legal production path earns:

```text
quest_valerius_patrol_duty          +10 City Watch
quest_m13_break_merchant_leak       +15 City Watch
valerius_m23_public_override        -10 City Watch
                                    ---
natural accumulated standing        +15
```

M23 intentionally defined the public override as a **-10 institutional consequence**. Earlier M25 qualification isolated that consequence from a neutral faction state and therefore observed `-10`.

M25 later gated `valerius_m25_public_order_conclusion` on:

```text
City Watch <= -1
```

That absolute threshold is incompatible with the chapter's own required production actions. The whole-game Alpha test reached the gate with `+15`.

## Repair

Preserve every existing faction mutation and repair only the later composition gate:

```text
City Watch <= +15
```

The conclusion still requires:

- `valerius_exp_aftermath_public_crackdown`;
- `silas_exp_old_silence_reinterpreted`;
- `valerius_exp_m23_public_override`;
- personally established Forge Assistance knowledge;
- Merchant District `watchPresence = heavy`.

The faction state therefore remains independently consequential: the route must include the public institutional cost, but that cost no longer falsely erases the player's earlier legitimate Watch service.

## Non-changes

- M23's `-10` public-override consequence is unchanged.
- Patrol and leak Quest reputation rewards remain `+10` and `+15`.
- Relationship consequences remain separate from Faction state.
- No Chapter state or new reputation subsystem is introduced.

## Qualification

GC-11's fresh-save production-action route is the regression proof: it must accumulate the real quest rewards, incur the real public override, reach `+15`, and then legally continue through the M25 conclusion.
