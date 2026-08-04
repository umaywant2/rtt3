# RTT/3 — Next‑Step Synthesis
### Engine Module Documentation  
**Version:** 2026.1  
**Operator:** `next-step`  
**Layer:** Synthesis

---

## Overview

The RTT/3 Next‑Step Synthesis Operator combines the outputs of all RTT/3
topology operators into a single unified topology object. It is the final
stage of RTT/3’s topology engine, merging:

- **Structural topology** (from `topology-map`)
- **Regime intersections** (from `topology-scan`)
- **Coherence surfaces** (from `topology-geometry`)
- **GPU topology overlays** (from `gpu-topology`)

This synthesis step produces the canonical RTT/3 topology format consumed
by RTT/12 and higher‑order engines.

---

## Inputs

The operator expects four RTT/3 operator outputs:

| Input Name           | Source Operator      | Description |
|----------------------|----------------------|-------------|
| `structuralTopology` | `topology-map`       | Structural regime topology |
| `intersections`      | `topology-scan`      | Regime intersections from drift + coherence |
| `surfaces`           | `topology-geometry`  | Coherence‑derived topology surfaces |
| `gpuTopology`        | `gpu-topology`       | GPU surfaces, intersections, overlays |

All inputs must be present. Missing inputs produce error `NS3-001`.

---

## Output Format

The unified RTT/3 topology object has the following structure:

```json
{
  "engine": "RTT/3",
  "operator": "next-step",
  "version": "2026.1",
  "topology": {
    "surfaces": [...],
    "intersections": [...],
    "overlays": [...]
  }
}
```

### Surfaces
Combined list of:

- coherence surfaces  
- GPU topology surfaces  

### Intersections
Combined list of:

- structural intersections  
- GPU topology intersections  

### Overlays
GPU drift‑coherence overlays.

---

## Synthesis Flow

The synthesis process follows the RTT/3 graph:

1. **Structural topology** is produced by `topology-map`.
2. **Intersections** are produced by `topology-scan`.
3. **Surfaces** are produced by `topology-geometry`.
4. **GPU topology** contributes surfaces, intersections, and overlays.
5. **Next‑Step** merges all four into a unified topology.

This flow is documented in:

```
src/synthesis/next-step.graph.js
```

---

## Runtime Operator

The runtime implementation is located at:

```
src/synthesis/next-step.js
```

The operator exposes:

```js
NextStep.synthesize(structuralTopology, intersections, surfaces, gpuTopology)
```

and returns the unified topology object.

---

## Worker Integration

The browser worker wrapper is located at:

```
src/synthesis/next-step.worker.js
```

It receives the four inputs via `postMessage` and returns the synthesized
topology.

---

## API Specification

The OpenAPI definition for this operator is located at:

```
src/synthesis/next-step.openapi.yaml
```

It exposes a single POST endpoint:

```
POST /next-step
```

which accepts the four operator outputs and returns the unified topology.

---

## Purpose in RTT/3

Next‑Step Synthesis is the **final consolidation stage** of RTT/3.  
It ensures that all topology information — structural, drift, coherence,
and GPU — is represented in a single deterministic format.

This unified topology is the canonical input for:

- RTT/12 topology clustering  
- RTT/12 surface regime analysis  
- RTT/12 coherence‑drift overlays  
- Higher‑order engines in the TriadicFrameworks canon

---

## Versioning

RTT/3 synthesis follows semantic versioning:

- **2026.1** — Initial stable release  
- Future versions will expand GPU overlay detail and add optional
  synthesis layers for RTT/12 integration.

---

## Summary

Next‑Step Synthesis is the heart of RTT/3’s topology engine.  
It merges all RTT/3 operator outputs into a single, stable, canonical
topology object that higher engines can consume without additional
transformation.
