# RTT/3 — Integration Notes  
### *docs/integration-notes.md*  
**Version:** 2026.1  
**Layer:** Integration  
**Status:** Stable

---

## 1. Purpose

These notes describe how **RTT/3 integrates with RTT/2 upstream** and **RTT/12 downstream**, forming the central topology engine of the TriadicFrameworks canon.

RTT/3 consumes RTT/2 gpu‑stack output, transforms it through a deterministic operator pipeline, and produces the unified topology object required by RTT/12.

---

## 2. Upstream Integration (RTT/2 → RTT/3)

RTT/3 expects the three RTT/2 views:

```json
{
  "regimeView": { ... },
  "driftView": { ... },
  "coherenceView": { ... }
}
```

### Requirements

- All three views must be present.  
- Missing fields produce `TE3-001`.  
- RTT/2 geometry is optional but enhances surface construction.  
- Regime labels must be S/E/R.

### Mapping

| RTT/2 View | RTT/3 Operator | Purpose |
|-----------|----------------|---------|
| `regimeView` | topology-map | Structural topology |
| `driftView` | topology-scan | Regime intersections |
| `coherenceView` | topology-geometry | Coherence surfaces |
| gpu-stack | gpu-topology | GPU surfaces + overlays |

---

## 3. RTT/3 Operator Pipeline

RTT/3 consists of five operators:

1. **topology-map** — structural topology  
2. **topology-scan** — intersections  
3. **topology-geometry** — coherence surfaces  
4. **gpu-topology** — GPU overlays  
5. **next-step (synthesis)** — unified RTT/3 topology

### Pipeline Flow

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

---

## 4. Downstream Integration (RTT/3 → RTT/12)

RTT/12 consumes the unified RTT/3 topology:

```json
{
  "topology": {
    "surfaces": [...],
    "intersections": [...],
    "overlays": [...]
  }
}
```

### RTT/12 Requirements

- Surfaces must include regime labels.  
- Intersections must be normalized.  
- Overlays must include magnitude.  
- All arrays must be deterministic and stable.

RTT/12 uses RTT/3 topology for:

- topology clustering  
- surface regime analysis  
- coherence‑drift overlays  
- GPU‑aware topology refinement  

---

## 5. Integration Guarantees

RTT/3 guarantees:

- deterministic operator outputs  
- stable pipeline order  
- consistent S/E/R regime model  
- schema‑validated structures  
- GPU‑aware topology merging  
- compatibility with RTT/12

---

## 6. Error Handling

RTT/3 uses operator‑specific error codes:

- **TM‑*** — topology-map  
- **TS‑*** — topology-scan  
- **TG‑*** — topology-geometry  
- **GT‑*** — gpu-topology  
- **NS‑*** — next-step synthesis  

Example:

```json
{
  "ok": false,
  "error": "NS3-001: Missing synthesis inputs"
}
```

---

## 7. File Locations

```
engine/transformation-engine.js
engine/transformation-map.md
engine/transformation-topology.json

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

## 8. Summary

RTT/3 is the **Topology Engine** of TriadicFrameworks.  
It integrates RTT/2 gpu‑stack input, transforms it through a multi‑operator pipeline, and produces the unified topology required by RTT/12.

These Integration Notes define how RTT/3 connects upstream and downstream, ensuring stable, deterministic, canon‑aligned behavior across the entire RTT stack.
