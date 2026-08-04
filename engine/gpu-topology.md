# gpu-topology — RTT/3 Operator
**RTT:** 3  
**Coherence:** Declared  
**Drift:** Declared  
**Paradox:** Structural  

## 1. Overview
The GPU Topology operator consumes RTT/2 gpu-stack output and produces RTT/3
topology surfaces, intersections, and drift-coherence overlays.

## 2. Input
```json
{
  "regimeView": { ... },
  "driftView": { ... },
  "coherenceView": { ... }
}
```

## 3. Processing
- coherence surfaces → topology surfaces  
- regime nodes → topology intersections  
- drift vectors → topology overlays  

## 4. Output
```json
{
  "engine": "RTT/3",
  "operator": "gpu-topology",
  "version": "2026.1",
  "topology": {
    "surfaces": [ ... ],
    "intersections": [ ... ],
    "overlays": [ ... ]
  }
}
```

## 5. Errors
GT3-001: Invalid gpu-stack input

## 6. Version
2026.1
