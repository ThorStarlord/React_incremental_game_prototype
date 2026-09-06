# M13 Implementation Snapshot

This short snapshot exists to separate the preregistered M13 question from the first implementation candidate before CI evidence exists.

## Baseline

- post-M12 `main`: `47df94af410eac8863676bcd467241f3b81beb61`
- baseline tree: `d9a1a65e1a468166463ab74da055cbd7ada150c3`

## Implemented slice

**The Merchant District Leak**

Production authoring now adds:

- Silas topic `silas_watch_leak_tip`, gated by `silas_exp_secret_neither_sold`;
- quest `quest_m13_trace_merchant_leak` using ordinary `REACH_LOCATION` + quest-resolution Relationship Experience;
- Valerius fallback topic `valerius_leak_rumor`, gated by traced Silas evidence;
- Valerius delegated topic `valerius_delegated_leak_response`, gated by both traced Silas evidence and `valerius_exp_order_questioned`;
- quest `quest_m13_break_merchant_leak` using the existing location/quest-resolution path;
- two new Silas post-M12 Experiences;
- two new Valerius post-M12 Experiences;
- defining Valerius Memory `valerius_memory_merchant_leak_broken`.

No generic Relationship, NPC, Quest, game-event, Essence, Trait, or save runtime file was changed for the story behavior.

## Qualification candidate

The dedicated `RelationshipM13NarrativeIntegration.test.tsx` covers:

1. production data wiring and absence of M13 identifiers from representative generic runtime files;
2. an unqualified Valerius history where the traced leak can be reported but delegated command is absent and a direct interaction-thunk bypass is rejected;
3. a qualified Silas + Valerius history where the M13 Silas route is played through ordinary UI/quest/location/resolution, saved and loaded before the Valerius consequence, then resumed through the delegated Valerius route to a new defining Memory.

The accumulated Build Validation workflow now includes this test. No PASS claim is made until exact-head CI completes.
