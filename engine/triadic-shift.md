# RTT/3 — Triadic Shift  
### Engine‑Level Documentation  
**Version:** 2026.1  
**Operator:** `triadic-shift`  
**Layer:** Shift  
**Status:** Stable

---

## 1. Purpose

The **Triadic Shift Operator** models how topology transitions across the three RTT regimes:

- **S → E → R → S** (triadic cycle)

It applies four coordinated shift dimensions:

1. **Structural Shift** — regime transitions for nodes and edges  
2. **Drift Shift** — directional drift vectors applied to transitions  
3. **Coherence Shift** — surface realignment across regimes  
4. **GPU Shift Overlay** — GPU topology overlays applied during shift  

The result is a **shift topology object** consumed by RTT/3 synthesis and RTT/12.

---

## 2. Operator Identity

| Field | Value |
|-------|-------|
| Engine | RTT/3 |
| Operator | triadic-shift |
| Version | 2026.1 |
| Layer | Shift |
| Output | Shift topology (structural, drift, coherence, GPU) |

---

## 3. Inputs

Triadic Shift consumes RTT/2 gpu‑stack output:

```json
{
  "regimeView": { ... },
  "driftView": { ... },
  "coherenceView": { ... }
}
```

All three are required.  
Missing fields produce error `TS3-001`.

---

## 4. Shift Dimensions

### **4.1 Structural Shift**
Transitions nodes and edges across regimes:

```
S → E  
E → R  
R → S
```

Each node receives:

```json
{
  "id": "...",
  "label": "...",
  "from": "S",
  "to": "E"
}
```

### **4.2 Drift Shift**
Applies drift vectors to transitions:

```json
{
  "label": "compose-frame",
  "from": "substrate:rocm.queue.0",
  "to": "substrate:rdp.endpoint.client",
  "magnitude": 0.2
}
```

### **4.3 Coherence Shift**
Realigns coherence surfaces:

```json
{
  "label": "ROCm Queue 0 Surface",
  "regimes": ["S", "E"],
  "shiftedTo": ["E", "R"]
}
```

### **4.4 GPU Shift Overlay**
Adds GPU topology overlays:

```json
{
  "label": "gpu-shift-overlay",
  "source": "gpu-topology",
  "magnitude": 1.0
}
```

---

## 5. Output Format

Triadic Shift returns:

```json
{
  "engine": "RTT/3",
  "operator": "triadic-shift",
  "version": "2026.1",
  "shift": {
    "structural": [...],
    "drift": [...],
    "coherence": [...],
    "gpu": [...]
  }
}
```

This shift object feeds directly into:

- **RTT/3 synthesis (`next-step`)**
- **RTT/12 topology clustering**

---

## 6. File Map

| File | Purpose |
|------|---------|
| `shift/triadic-shift.js` | Runtime operator |
| `shift/triadic-shift.graph.js` | Shift graph |
| `shift/triadic-shift.openapi.yaml` | API definition |
| `shift/triadic-shift.worker.js` | Worker wrapper |
| `tests/triadic-shift.test.json` | Shift test suite |

---

## 7. Graph Reference

The shift graph is defined in:

```
src/shift/triadic-shift.graph.js
```

It models:

- regime nodes (S, E, R)  
- operator nodes (structural, drift, coherence, GPU)  
- transitions (S→E→R→S)  
- output node (shift topology)

---

## 8. Role in RTT/3

Triadic Shift is the **regime transition engine** of RTT/3.  
It prepares topology for synthesis by:

- shifting structural nodes  
- applying drift vectors  
- realigning coherence surfaces  
- overlaying GPU topology  

This ensures RTT/3 topology reflects dynamic regime movement before final synthesis.

---

## 9. Summary

Triadic Shift is a core RTT/3 operator that models regime transitions across S/E/R, applying structural, drift, coherence, and GPU shifts to produce a unified shift topology.  
It is essential for RTT/3 synthesis and RTT/12 topology analysis.
