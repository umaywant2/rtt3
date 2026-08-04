/**
 * RTT/3 — Transformation Engine Graph
 * -----------------------------------
 * Defines the transformation graph for RTT/3 topology construction.
 *
 * RTT/3 consumes RTT/2 structural, drift, and coherence geometry and produces:
 *   - topology surfaces
 *   - regime intersections
 *   - drift‑coherence overlays
 *   - topology clusters (for RTT/12)
 *
 * This graph declares the transformation flow between RTT/3 operators.
 */

export const TransformationEngineGraph = {
  engine: "RTT/3",
  version: "2026.1",

  nodes: [
    {
      id: "input:gpu-stack",
      label: "RTT/2 gpu-stack output",
      type: "input"
    },
    {
      id: "op:topology-map",
      label: "topology-map",
      type: "operator",
      description: "Builds structural topology from regimeView"
    },
    {
      id: "op:topology-scan",
      label: "topology-scan",
      type: "operator",
      description: "Scans driftView and coherenceView for regime intersections"
    },
    {
      id: "op:topology-geometry",
      label: "topology-geometry",
      type: "operator",
      description: "Constructs topology surfaces from coherence geometry"
    },
    {
      id: "op:gpu-topology",
      label: "gpu-topology",
      type: "operator",
      description: "GPU topology surfaces, intersections, and drift‑coherence overlays"
    },
    {
      id: "output:topology",
      label: "RTT/3 topology output",
      type: "output"
    }
  ],

  edges: [
    // RTT/2 → RTT/3
    {
      from: "input:gpu-stack",
      to: "op:topology-map",
      label: "regimeView → structural topology"
    },
    {
      from: "input:gpu-stack",
      to: "op:topology-scan",
      label: "driftView → intersections"
    },
    {
      from: "input:gpu-stack",
      to: "op:topology-geometry",
      label: "coherenceView → surfaces"
    },

    // GPU-specific path
    {
      from: "input:gpu-stack",
      to: "op:gpu-topology",
      label: "gpu-stack → gpu-topology"
    },

    // Aggregation into RTT/3 output
    {
      from: "op:topology-map",
      to: "output:topology",
      label: "structural topology"
    },
    {
      from: "op:topology-scan",
      to: "output:topology",
      label: "regime intersections"
    },
    {
      from: "op:topology-geometry",
      to: "output:topology",
      label: "topology surfaces"
    },
    {
      from: "op:gpu-topology",
      to: "output:topology",
      label: "GPU topology surfaces + overlays"
    }
  ]
};

