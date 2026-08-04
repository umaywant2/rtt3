# RTT/3 — Transformation Protocol  
**File:** `docs/transformation-protocol.md`  
**Version:** 2026.1  
**Layer:** Transformation  
**Status:** Stable

---

## 1. Purpose

The RTT/3 Transformation Protocol defines **how RTT/3 converts RTT/2 gpu‑stack output into RTT/3 topology** through a deterministic, multi‑operator pipeline.

It is the authoritative specification for:

- structural topology construction  
- intersection computation  
- coherence surface generation  
- GPU topology integration  
- final synthesis into unified RTT/3 topology  

This protocol ensures RTT/3 behaves consistently across all implementations.

---

## 2. Upstream Input (RTT/2 → RTT/3)

RTT/3 consumes the three RTT/2 views:

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
- Missing fields produce `TE3-001`.  
- Geometry metadata enhances surface construction but is optional.

---

## 3. RTT/3 Operator Pipeline

RTT/3 consists of **five operators**, each performing a distinct transformation:

### **3.1 topology-map**  
Builds structural topology from `regimeView`.

### **3.2 topology-scan**  
Computes regime intersections from drift + coherence.

### **3.3 topology-geometry**  
Generates coherence surfaces from geometry and alignment.

### **3.4 gpu-topology**  
Adds GPU surfaces, intersections, and overlays.

### **3.5 next-step (synthesis)**  
Combines all RTT/3 operator outputs into the unified topology.

---

## 4. Transformation Flow

The RTT/3 transformation pipeline is:

```
RTT/2 gpu-stack
   ↓
topology-map
   ↓
topology-scan
   ↓
topology-geometry
   ↓
gpu-topology
   ↓
next-step (synthesis)
   ↓
Unified RTT/3 topology
```

This flow is also represented in:

```
src/synthesis/next-step.graph.js
```

---

## 5. Operator Contracts

### **5.1 topology-map**
Input: `regimeView`  
Output: structural topology (nodes, edges, tiers)

### **5.2 topology-scan**
Input: `driftView`, `coherenceView`  
Output: intersections (regime transitions, drift‑coherence intersections)

### **5.3 topology-geometry**
Input: `coherenceView`  
Output: coherence surfaces (alignment, stability, regime spans)

### **5.4 gpu-topology**
Input: full RTT/2 gpu‑stack  
Output: GPU surfaces, intersections, overlays

### **5.5 next-step**
Input: all four operator outputs  
Output: unified RTT/3 topology

---

## 6. Unified RTT/3 Topology Format

The final output of RTT/3 is:

```json
{
  "engine": "RTT/3",
  "operator": "transformation-engine",
  "version": "2026.1",
  "topology": {
    "surfaces": [...],
    "intersections": [...],
    "overlays": [...]
  }
}
```

This is the canonical format consumed by RTT/12.

---

## 7. Determinism Guarantees

RTT/3 guarantees:

- **Deterministic merges** — no randomness, no mutation  
- **Stable ordering** — operator outputs merged in fixed order  
- **Schema consistency** — matches `transformation-topology.json`  
- **GPU‑aware overlays** — GPU topology always included when present  
- **Strict input validation** — missing fields produce operator‑specific errors  

---

## 8. Downstream Integration (RTT/3 → RTT/12)

RTT/12 expects:

- `topology.surfaces` — regime‑labeled surfaces  
- `topology.intersections` — normalized intersections  
- `topology.overlays` — drift‑coherence overlays with magnitude  

RTT/3 is the **only supported path** from RTT/2 gpu‑stack to RTT/12 topology input.

---

## 9. File Map

```
engine/transformation-engine.js
engine/transformation-map.md
engine/transformation-topology.json
docs/transformation-protocol.md

operators/topology-map.js
operators/topology-scan.js
operators/topology-geometry.js

gpu/gpu-topology.js

synthesis/next-step.js
synthesis/next-step.graph.js
synthesis/next-step.openapi.yaml
synthesis/next-step.worker.js

shift/triadic-shift.js
shift/triadic-shift.graph.js
shift/triadic-shift.openapi.yaml
shift/triadic-shift.worker.js
```

---

## 10. Summary

The RTT/3 Transformation Protocol defines the exact sequence and rules by which RTT/3:

1. consumes RTT/2 gpu‑stack input  
2. transforms it through structural, intersection, surface, and GPU operators  
3. synthesizes everything into a unified topology  
4. hands that topology to RTT/12  

This document is the canonical reference for any implementation or integration relying on RTT/3 topology transformation.
