/**
 * RTT/3 — Triadic Shift Graph
 * ---------------------------
 * Declarative graph describing how RTT/3 performs a triadic topology shift
 * across S / E / R regimes.
 *
 * The Triadic Shift Operator models:
 *   - structural regime transitions
 *   - drift‑based directional shifts
 *   - coherence‑surface realignments
 *   - GPU topology overlays during shift
 */

export const TriadicShiftGraph = {
  engine: "RTT/3",
  operator: "triadic-shift",
  version: "2026.1",

  nodes: [
    {
      id: "input:gpu-stack",
      label: "RTT/2 gpu-stack",
      type: "input"
    },
    {
      id: "regime:S",
      label: "S Regime",
      type: "regime"
    },
    {
      id: "regime:E",
      label: "E Regime",
      type: "regime"
    },
    {
      id: "regime:R",
      label: "R Regime",
      type: "regime"
    },
    {
      id: "op:shift-structural",
      label: "Structural Shift",
      type: "operator",
      description: "Shift structural nodes/edges across regimes"
    },
    {
      id: "op:shift-drift",
      label: "Drift Shift",
      type: "operator",
      description: "Apply drift vectors to regime transitions"
    },
    {
      id: "op:shift-coherence",
      label: "Coherence Shift",
      type: "operator",
      description: "Realign coherence surfaces during shift"
    },
    {
      id: "op:shift-gpu",
      label: "GPU Shift Overlay",
      type: "operator",
      description: "GPU topology overlays applied during shift"
    },
    {
      id: "output:shift-topology",
      label: "Shifted Topology",
      type: "output"
    }
  ],

  edges: [
    // RTT/2 → RTT/3 shift inputs
    {
      from: "input:gpu-stack",
      to: "op:shift-structural",
      label: "regimeView → structural shift"
    },
    {
      from: "input:gpu-stack",
      to: "op:shift-drift",
      label: "driftView → drift shift"
    },
    {
      from: "input:gpu-stack",
      to: "op:shift-coherence",
      label: "coherenceView → coherence shift"
    },
    {
      from: "input:gpu-stack",
      to: "op:shift-gpu",
      label: "gpu-stack → gpu shift overlay"
    },

    // Regime transitions
    {
      from: "regime:S",
      to: "regime:E",
      label: "S → E shift"
    },
    {
      from: "regime:E",
      to: "regime:R",
      label: "E → R shift"
    },
    {
      from: "regime:R",
      to: "regime:S",
      label: "R → S shift"
    },

    // Operators → output
    {
      from: "op:shift-structural",
      to: "output:shift-topology",
      label: "structural shift topology"
    },
    {
      from: "op:shift-drift",
      to: "output:shift-topology",
      label: "drift shift overlays"
    },
    {
      from: "op:shift-coherence",
      to: "output:shift-topology",
      label: "coherence surface shift"
    },
    {
      from: "op:shift-gpu",
      to: "output:shift-topology",
      label: "GPU shift overlays"
    }
  ]
};

