/**
 * RTT/3 — Next-Step Worker
 * ------------------------
 * Worker wrapper for RTT/3 synthesis. Receives messages from the main thread,
 * loads the next-step operator, executes synthesis, and posts results back.
 */

import { RTT3 } from "../assets/js/rtt3.js";

self.onmessage = async (event) => {
  const payload = event.data;

  if (!payload) {
    self.postMessage({
      ok: false,
      error: "NS3-WORKER-001: Missing synthesis payload"
    });
    return;
  }

  try {
    const nextStep = await RTT3.load("synth");
    const result = await nextStep.synthesize(
      payload.structuralTopology,
      payload.intersections,
      payload.surfaces,
      payload.gpuTopology
    );

    self.postMessage({
      ok: true,
      result
    });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: `NS3-WORKER-002: Synthesis failed — ${err.message}`
    });
  }
};

