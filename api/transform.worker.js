/**
 * RTT/3 — Transformation Worker
 * -----------------------------
 * Worker wrapper for RTT/3 transformation-engine. Receives RTT/2 gpu-stack
 * input, loads the transformation operator, executes it, and posts results
 * back to the main thread.
 */

import { RTT3 } from "../assets/js/rtt3.js";

self.onmessage = async (event) => {
  const payload = event.data;

  if (!payload) {
    self.postMessage({
      ok: false,
      error: "TE3-WORKER-001: Missing transformation payload"
    });
    return;
  }

  try {
    const transform = await RTT3.load("map");       // topology-map
    const scan = await RTT3.load("scan");          // topology-scan
    const geometry = await RTT3.load("geometry");  // topology-geometry
    const gpu = await RTT3.load("gpu");            // gpu-topology

    // Execute operators in canonical RTT/3 order
    const structuralTopology = await transform.run(payload.regimeView);
    const intersections = await scan.run(payload.driftView, payload.coherenceView);
    const surfaces = await geometry.run(payload.coherenceView);
    const gpuTopology = await gpu.run(payload);

    self.postMessage({
      ok: true,
      result: {
        engine: "RTT/3",
        operator: "transformation-engine",
        version: "2026.1",
        structuralTopology,
        intersections,
        surfaces,
        gpuTopology
      }
    });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: `TE3-WORKER-002: Transformation failed — ${err.message}`
    });
  }
};

