/**
 * RTT/3 — Transformation Engine Worker
 * ------------------------------------
 * Wraps the RTT/3 TransformationEngine for use in browser workers.
 *
 * Consumes RTT/2 gpu-stack output and produces RTT/3 topology:
 *   - topology surfaces
 *   - regime intersections
 *   - drift‑coherence overlays
 */

importScripts("/src/transform/transformation-engine.js");

self.onmessage = (event) => {
  const { gpuStackOutput } = event.data;

  try {
    const result = TransformationEngine.run(gpuStackOutput);

    self.postMessage({
      ok: true,
      engine: "RTT/3",
      operator: "transformation-engine",
      version: TransformationEngine.version,
      result
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error.message || "TE3-001: Internal RTT/3 transformation error"
    });
  }
};

