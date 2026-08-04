# RTT/3 — Synthesis Protocol  
**File:** docs/synthesis-protocol.md  
**Version:** 2026.1  
**Layer:** Synthesis  
**Status:** Stable

---

## 1. Purpose

The RTT/3 Synthesis Protocol defines **how RTT/3 combines all topology operators** into a single, unified topology object.

It is the procedural specification for:

- structural topology (`topology-map`)
- regime intersections (`topology-scan`)
- coherence surfaces (`topology-geometry`)
- GPU topology overlays (`gpu-topology`)
- final consolidation (`next-step`)

---

## 2. Participants

### 2.1 Upstream (RTT/2)

- **RTT/2 gpu-stack**
  - `regimeView`
  - `driftView`
  - `coherenceView`

### 2.2 RTT/3 Operators

- **`topology-map`** — structural topology
- **`topology-scan`** — regime intersections
- **`topology-geometry`** — coherence surfaces
- **`gpu-topology`** — GPU surfaces + overlays
- **`next-step`** — synthesis operator

### 2.3 Downstream (RTT/12)

- **RTT/12 Engine**
  - topology clustering
  - surface regime analysis
  - coherence‑drift overlays

---

## 3. Input Contract

RTT/3 synthesis requires four operator outputs:

```json
{
  "structuralTopology": [ ... ],
  "intersections": [ ... ],
  "surfaces": [ ... ],
  "gpuTopology": {
    "topology": {
      "surfaces": [ ... ],
      "intersections": [ ... ],
      "overlays": [ ... ]
    }
  }
}
```

All fields are **mandatory**.  
Missing inputs produce error:

```json
{
  "ok": false,
  "error": "NS3-001: Missing synthesis inputs"
}
```

---

## 4. Protocol Steps

### Step 1 — Collect Operator Outputs

1. Run `topology-map` on `regimeView`.
2. Run `topology-scan` on `driftView + coherenceView`.
3. Run `topology-geometry` on `coherenceView`.
4. Run `gpu-topology` on full gpu‑stack.

### Step 2 — Invoke Synthesis

Call:

```js
NextStep.synthesize(
  structuralTopology,
  intersections,
  surfaces,
  gpuTopology
);
```

### Step 3 — Merge Topology

The synthesis operator:

- concatenates **surfaces** from:
  - `topology-geometry`
  - `gpu-topology.topology.surfaces`

- concatenates **intersections** from:
  - `topology-scan`
  - `gpu-topology.topology.intersections`

- forwards **overlays** from:
  - `gpu-topology.topology.overlays`

### Step 4 — Produce Unified Topology

Result:

```json
{
  "engine": "RTT/3",
  "operator": "next-step",
  "version": "2026.1",
  "topology": {
    "surfaces": [ ... ],
    "intersections": [ ... ],
    "overlays": [ ... ]
  }
}
```

This is the **canonical RTT/3 topology** consumed by RTT/12.

---

## 5. Runtime Surfaces

### 5.1 Implementation Files

- `src/synthesis/next-step.js` — runtime operator
- `src/synthesis/next-step.graph.js` — synthesis graph
- `src/synthesis/next-step.worker.js` — worker wrapper
- `src/synthesis/next-step.openapi.yaml` — API definition

### 5.2 API Protocol

Endpoint:

```http
POST /next-step
Content-Type: application/json
```

Body:

```json
{
  "structuralTopology": [ ... ],
  "intersections": [ ... ],
  "surfaces": [ ... ],
  "gpuTopology": { ... }
}
```

Response:

```json
{
  "engine": "RTT/3",
  "operator": "next-step",
  "version": "2026.1",
  "topology": { ... }
}
```

---

## 6. Determinism & Guarantees

RTT/3 synthesis guarantees:

- **Deterministic merges** — no randomness, no mutation.
- **Stable ordering** — operator outputs are merged in fixed order.
- **Schema consistency** — topology matches `transformation-topology.json`.
- **GPU‑aware overlays** — GPU topology is always included when present.

---

## 7. Integration with RTT/12

RTT/12 expects:

- `topology.surfaces` — regime‑labeled surfaces.
- `topology.intersections` — normalized intersections.
- `topology.overlays` — drift‑coherence overlays with magnitude.

RTT/3 synthesis is the **only supported path** from RTT/2 gpu‑stack to RTT/12 topology input.

---

## 8. Summary

The RTT/3 Synthesis Protocol defines the exact sequence and rules by which RTT/3:

1. collects operator outputs,  
2. merges structural, intersection, surface, and GPU data,  
3. produces a unified topology object,  
4. hands that topology to RTT/12.

This document is the canonical reference for any implementation or integration that relies on RTT/3 topology synthesis.
