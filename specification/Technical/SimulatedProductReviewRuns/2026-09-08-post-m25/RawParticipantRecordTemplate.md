# Raw Participant Record Template

**Campaign:** `SIR-2026-09-08-POST-M25-V1`  
**Record status:** `RAW — NOT EVALUATED`

> This template preserves participant-facing evidence before evaluator adjudication. Do not insert canonical corrections, severity labels, or verdict language into the raw record.

---

## 1. Participant identity

```text
Session ID:
Participant:
Profile ID:
Frozen packet path:
Frozen packet blob SHA:
External context/provider identifier (controller-only provenance, if applicable):
Isolation check: PASS / FAIL
Contamination status: CLEAN / CONTAMINATED / UNCERTAIN
```

---

## 2. Candidate provenance

```text
Repository: ThorStarlord/React_incremental_game_prototype
Exact game commit: 953b01bec22261e3b84aea59544fd9b75746cf00
Exact game tree:   08427373b98b934a130abd9dc3e59c25258f1c81
Infrastructure qualification: Build Validation #252
Protocol blob: 39c776271585c5cfb62f06678b17932ef7780823
Harness blob:  563a9c29fc0b965c66858eba0bb470fb863cdc6e
```

Record actual runtime details:

```text
Execution date/time:
OS/runtime:
Browser:
Playwright version:
Game URL:
Fresh browser context: YES / NO
Debug injection used: NO
Direct hidden-state access used: NO
```

---

## 3. Isolation attestation

Before first observation:

```text
Participant had not read source code:               YES / NO / UNCERTAIN
Participant had not read specifications:            YES / NO / UNCERTAIN
Participant had not read tests:                     YES / NO / UNCERTAIN
Participant had not read M25 result:                YES / NO / UNCERTAIN
Participant had not read campaign controller docs:  YES / NO / UNCERTAIN
Participant had not read prior participant records: YES / NO / UNCERTAIN
Participant had not read evaluator notes:           YES / NO / UNCERTAIN
Participant was not taught intended answers:        YES / NO / UNCERTAIN
```

If any material isolation field is `NO` or materially uncertain, preserve the record and flag contamination. Do not quietly discard it.

---

## 4. Start state

```text
Fresh game state basis:
Initial URL:
Initial screenshot/observation reference:
Any operational setup intervention:
```

---

## 5. Observation / action ledger

Repeat this block for each meaningful interaction cycle.

### Cycle <N>

**Observation ID:**  
**Screenshot/reference:**  
**Visible text/control packet:**

```text
<reference or exact relayed observation content>
```

**Participant response — verbatim:**

```text
CURRENT INTERPRETATION:

CURRENT HYPOTHESIS:

DECISION:

REASON:

ACTION:

CONFUSION:
```

**Controller execution record:**

```text
Requested action:
Executed exactly: YES / NO
Execution result:
Operational intervention:
Next observation ID:
```

Do not append evaluator interpretation here.

---

## 6. Natural causal probes

Record only probes actually delivered during the participant run.

### Relationship

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

### Trait progression

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

### Knowledge

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

### Faction Reputation

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

### World State

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

### Copies / automation

**Probe:**  
**Participant answer — verbatim:**

```text
...
```

If a domain was not meaningfully encountered, record `NOT OBSERVED`; do not manufacture an answer.

---

## 7. Operational interventions

List every controller/environment intervention, including seemingly harmless ones.

| # | Observation | Intervention | Why required | Causal teaching risk |
|---:|---|---|---|---|
| | | | | |

Use one of:

```text
NONE
LOW — operational only
POSSIBLE CONTAMINATION
MATERIAL CONTAMINATION
```

Do not adjudicate product correctness here.

---

## 8. Session termination

```text
Termination type:
  COMPLETED CHAPTER
  SUBSTANTIAL NAVIGATION COMPLETE
  PARTICIPANT QUIT
  CRITICAL PRODUCT STOP
  ISOLATION STOP
  ENVIRONMENT STOP
  OTHER

Final ordinary player-facing state reference:
Participant-selected final action:
Participant final confusion statement, if any:
```

---

## 9. Raw completion summary

Record descriptive facts only.

```text
Run completed: YES / NO
Chapter conclusion reached: YES / NO
Operational coaching beyond syntax: YES / NO
Hidden-state access: YES / NO
Isolation contamination detected: YES / NO / UNCERTAIN
Early-stop condition fired: YES / NO
```

Do **not** write:

```text
PASS
WEAK
FAIL
MISCONCEPTION
MAJOR
MODERATE
```

Those are evaluator-stage labels.

---

## 10. Freeze record

```text
Raw record frozen at commit:
Frozen path:
Frozen by controller:
Freeze timestamp:
Evaluator had access before freeze: NO
```

After this field is populated and committed, participant wording is immutable for evidentiary purposes.

If later clerical correction is unavoidable, add an append-only correction note below without rewriting the original record.

---

## 11. Append-only clerical corrections

`NONE AT INITIAL FREEZE`
