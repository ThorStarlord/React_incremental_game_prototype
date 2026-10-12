# Grounding Pack

Thin layer over the existing authority set. It does not replace `AGENTS.md`,
`STATUS.md`, `docs/CURRENT.md`, `HANDOFF.md`, or `specification/`. Read those first
(order in `AGENTS.md`, "Required reading order"). This pack holds only what they
do not state directly: open owner decisions, a glossary of easily confused terms,
and the reasons behind existing rules.

## Provenance

Each factual line carries exactly one primary tag. Supporting sources go in an
ordinary Markdown link, not a second tag.

- `[policy: path]` a repository authority document (policy, contract, spec, ADR).
- `[code: path]` a source file, checkable against code.
- `[test: path]` a check that runs.
- `[owner: YYYY-MM-DD]` an answer the owner gave. Owner intent.
- `[delegated: YYYY-MM-DD]` a choice the owner delegated to the agent. Binding only inside that delegation; not owner intent.
- `[hypothesis]` an agent inference. Never a basis for action alone.

## Question ratchet

Before asking the owner, check `intent.md` and `decisions/`. Reuse a recorded
answer while it still applies to the current scope. Ask again only when the
scope changed, the decision was superseded, or new evidence materially
challenges it. Record each new answer with its date.
