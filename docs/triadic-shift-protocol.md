# RTT/3 — Triadic Shift Protocol  
**File:** `docs/triadic-shift-protocol.md`  
**Version:** 2026.1  
**Layer:** Shift  
**Status:** Stable

---

## 1. Purpose

The **Triadic Shift Protocol** defines how RTT/3 performs regime transitions across the triadic cycle:

**S → E → R → S**

It specifies the rules, data flows, and operator behavior for:

- structural regime transitions  
- drift‑vector directional shifts  
- coherence surface realignment  
- GPU topology overlays  

The protocol ensures RTT/3 produces deterministic, stable shift topology for synthesis and RTT/12.

---

## 2. Upstream Input (RTT/2 → RTT/3)

Triadic Shift consumes RTT/2 gpu‑stack output:

```json
{
  "regimeView": { ... },
  "driftView": { ... },
  "coherenceView": { ... }
}
```

### Requirements

- All three views must be present.  
- Regime labels must be `S`, `E`, `R`.  
- Missing fields produce `TS3-001`.  
- Drift vectors must include `from`, `to`, and `magnitude`.  
- Coherence surfaces must include regime spans.

---

## 3. Shift Dimensions

Triadic Shift applies **four coordinated transformations**.

### 3.1 Structural Shift  
Transitions nodes and edges across regimes:

```
S → E  
E → R  
R → S
```

Each structural element receives:

```json
{
  "id": "...",
  "label": "...",
  "from": "S",
  "to": "E"
}
```

### 3.2 Drift Shift  
Applies directional drift vectors:

```json
{
  "label": "compose-frame",
  "from": "substrate:rocm.queue.0",
  "to": "substrate:rdp.endpoint.client",
  "magnitude": 0.2
}
```

### 3.3 Coherence Shift  
Realigns coherence surfaces across regime transitions:

```json
{
  "label": "ROCm Queue 0 Surface",
  "regimes": ["S", "E"],
  "shiftedTo": ["E", "R"]
}
```

### 3.4 GPU Shift Overlay  
Adds GPU topology overlays:

```json
{
  "label": "gpu-shift-overlay",
  "source": "gpu-topology",
  "magnitude": 1.0
}
```

---

## 4. Protocol Flow

The Triadic Shift pipeline is:

```
RTT/2 gpu-stack
   ↓
triadic-shift (structural, drift, coherence, GPU)
   ↓
shift topology
   ↓
next-step synthesis
   ↓
Unified RTT/3 topology
```

This flow is represented in:

```
src/shift/triadic-shift.graph.js
```

---

## 5. Operator Contract

### Input Contract

```json
{
  "regimeView": { ... },
  "driftView": { ... },
  "coherenceView": { ... }
}
```

### Output Contract

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

---

## 6. Determinism Guarantees

Triadic Shift guarantees:

- **Stable regime transitions** (S→E→R→S)  
- **Deterministic drift application**  
- **Consistent coherence realignment**  
- **GPU overlays always included when present**  
- **Schema‑consistent output** matching RTT/3 topology requirements  

---

## 7. Downstream Integration (RTT/3 → RTT/12)

RTT/12 consumes the shift topology for:

- topology clustering  
- surface regime analysis  
- coherence‑drift overlays  
- GPU‑aware refinement  

Shift topology is a required precursor to RTT/3 synthesis and RTT/12 analysis.

---

## 8. File Map

```
shift/triadic-shift.js
shift/triadic-shift.graph.js
shift/triadic-shift.openapi.yaml
shift/triadic-shift.worker.js
docs/triadic-shift-protocol.md
```

---

## 9. Summary

The Triadic Shift Protocol defines the exact rules by which RTT/3:

1. transitions structural elements across S/E/R  
2. applies drift vectors  
3. realigns coherence surfaces  
4. overlays GPU topology  
5. produces deterministic shift topology for synthesis  

This document is the canonical reference for any implementation relying on RTT/3 regime transitions.
