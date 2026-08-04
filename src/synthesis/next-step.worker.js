/**
 * RTT/3 — Next-Step Synthesis Worker
 * ----------------------------------
 * Wraps the RTT/3 NextStep operator for browser worker execution.
 *
 * Inputs:
 *   - structuralTopology
 *   - intersections
 *   - surfaces
 *   - gpuTopology
 *
 * Output:
 *   - unified RTT/3 topology object
 */

importScripts("/src/synthesis/next-step.js");

self.onmessage = (event) => {
  const {
    structuralTopology,
    intersections,
    surfaces,
    gpuTopology
  } = event.data;

  try {
    const result = NextStep.synthesize(
      structuralTopology,
      intersections,
      surfaces,
      gpuTopology
    );

    self.postMessage({
      ok: true,
      engine: "RTT/3",
      operator: "next-step",
      version: NextStep.version,
      result
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error.message || "NS3-002: Internal RTT/3 synthesis error"
    });
  }
};

