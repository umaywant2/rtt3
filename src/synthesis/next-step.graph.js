/**
 * RTT/3 — Next-Step Synthesis Graph
 * ---------------------------------
 * Declarative graph describing how RTT/3 synthesizes topology from
 * structural, drift, coherence, and GPU topology operators.
 *
 * This graph is used for documentation, visualization, and operator
 * orchestration within the RTT/3 synthesis layer.
 */

export const NextStepSynthesisGraph = {
  engine: "RTT/3",
  version: "2026.1",

  nodes: [
    {
      id: "input:gpu-stack",
      label: "RTT/2 gpu-stack",
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
      description: "Finds regime intersections from drift + coherence"
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
      description: "GPU topology surfaces, intersections, overlays"
    },
    {
      id: "synthesis:next-step",
      label: "Next-Step Synthesis",
      type: "synthesis",
      description: "Combines all RTT/3 operator outputs into unified topology"
    },
    {
      id: "output:topology",
      label: "RTT/3 topology output",
      type: "output"
    }
  ],

  edges: [
    // RTT/2 → RTT/3 operator inputs
    {
      from: "input:gpu-stack",
      to: "op:topology-map",
      label: "regimeView → structural topology"
    },
    {
      from: "input:gpu-stack",
      to: "op:topology-scan",
      label: "driftView + coherenceView → intersections"
    },
    {
      from: "input:gpu-stack",
      to: "op:topology-geometry",
      label: "coherenceView → surfaces"
    },
    {
      from: "input:gpu-stack",
      to: "op:gpu-topology",
      label: "gpu-stack → gpu-topology"
    },

    // Operators → synthesis
    {
      from: "op:topology-map",
      to: "synthesis:next-step",
      label: "structural topology"
    },
    {
      from: "op:topology-scan",
      to: "synthesis:next-step",
      label: "regime intersections"
    },
    {
      from: "op:topology-geometry",
      to: "synthesis:next-step",
      label: "topology surfaces"
    },
    {
      from: "op:gpu-topology",
      to: "synthesis:next-step",
      label: "GPU surfaces + overlays"
    },

    // Synthesis → output
    {
      from: "synthesis:next-step",
      to: "output:topology",
      label: "Unified RTT/3 topology"
    }
  ]
};

