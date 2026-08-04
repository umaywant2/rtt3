# RTT/3 — GPU Topology Capture

## Example Input (RTT/2 gpu-stack output)
```json
{
  "regimeView": {
    "structure": {
      "nodes": [
        { "id": "substrate:rocm.queue.0", "label": "ROCm Queue 0", "tier": "S" },
        { "id": "substrate:rdp.endpoint.client", "label": "RDP Client", "tier": "R" }
      ]
    }
  },
  "driftView": {
    "vectors": {
      "structural": [
        { "label": "compose-frame", "magnitude": 0.2 }
      ]
    }
  },
  "coherenceView": {
    "surfaces": [
      { "label": "ROCm Queue 0 Surface", "regimes": ["S", "E"] }
    ]
  }
}
```

## Example Output
```json
{
  "engine": "RTT/3",
  "operator": "gpu-topology",
  "version": "2026.1",
  "topology": {
    "surfaces": [
      { "label": "ROCm Queue 0 Surface", "regimes": ["S", "E"] }
    ],
    "intersections": [
      { "label": "ROCm Queue 0", "regimes": ["S"] },
      { "label": "RDP Client", "regimes": ["R"] }
    ],
    "overlays": [
      { "label": "compose-frame", "magnitude": 0.2 }
    ]
  }
}
```

## Interpretation
RTT/3 exposes GPU topology surfaces, regime intersections, and drift-coherence overlays.
```

---

# 5. **api/gpu-topology.schema.json**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "RTT/3 GPU Topology",
  "version": "2026.1",
  "type": "object",

  "properties": {
    "regimeView": { "type": "object" },
    "driftView": { "type": "object" },
    "coherenceView": { "type": "object" }
  },

  "required": ["regimeView", "driftView", "coherenceView"]
}
