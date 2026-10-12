# Invariants and traps

## Invariants the code does not enforce
- Never relabel non-human evidence as human Beta evidence. [code: AGENTS.md]
- Missing human evidence limits claims, not repository-answerable work. [code: AGENTS.md]
- Repairs stay inside the already-authorized Campaign One scope. [code: AGENTS.md]

## Invariants enforced by a check
- Documentation authority is consistent. [test: scripts/validate-documentation-authority.js]

## Known traps
- Adding a generic system (chapter engine, planner, crafting economy) to solve a single case. Cut in FeatureScopeMatrix; prefer a bounded projection. [code: specification/Features/FeatureScopeMatrix.md]
- Restoring a duplicate save surface or the old Skills point system. Both are cut; compatibility state stays inert. [code: specification/Features/FeatureScopeMatrix.md]
