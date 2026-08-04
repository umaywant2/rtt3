importScripts("/src/gpu/gpu-topology.js");

self.onmessage = (event) => {
  try {
    const result = GpuTopology.build(event.data.gpuStackOutput);

    self.postMessage({
      ok: true,
      result
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error.message || "GT3-001: Invalid gpu-stack input"
    });
  }
};

