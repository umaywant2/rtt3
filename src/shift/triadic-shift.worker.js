/**
 * RTT/3 — Triadic Shift Worker
 * ----------------------------
 * Wraps the RTT/3 TriadicShift operator for browser worker execution.
 *
 * Inputs:
 *   - regimeView
 *   - driftView
 *   - coherenceView
 *
 * Output:
 *   - triadic shift result (structural, drift, coherence, GPU)
 */

importScripts("/src/shift/triadic-shift.js");

self.onmessage = (event) => {
  const { gpuStackOutput } = event.data;

  try {
    const result = TriadicShift.run(gpuStackOutput);

    self.postMessage({
      ok: true,
      engine: "RTT/3",
      operator: "triadic-shift",
      version: TriadicShift.version,
      result
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error.message || "TS3-002: Internal RTT/3 triadic shift error"
    });
  }
};

