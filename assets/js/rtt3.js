/**
 * RTT/3 — Engine Core Module
 * --------------------------
 * Provides RTT/3 namespace, version metadata, operator registry,
 * and lightweight loader for RTT/3 operators.
 *
 * This file does NOT execute operators. It simply exposes RTT/3's
 * public surface for use by the engine, workers, and synthesis.
 */

export const RTT3 = {
  engine: "RTT/3",
  version: "2026.1",

  /**
   * Operator registry
   * (mirrors RTT/1, RTT/2, RTT/12 engine asset patterns)
   */
  operators: {
    map: "/src/operators/topology-map.js",
    scan: "/src/operators/topology-scan.js",
    geometry: "/src/operators/topology-geometry.js",
    gpu: "/src/gpu/gpu-topology.js",
    shift: "/src/shift/triadic-shift.js",
    synth: "/src/synthesis/next-step.js"
  },

  /**
   * Load an RTT/3 operator dynamically.
   * Returns the module's default export or named export.
   */
  async load(operatorName) {
    const path = this.operators[operatorName];

    if (!path) {
      throw new Error(`RTT3-LOAD-001: Unknown operator '${operatorName}'`);
    }

    try {
      const module = await import(path);
      return module.default || module;
    } catch (err) {
      throw new Error(
        `RTT3-LOAD-002: Failed to load operator '${operatorName}' — ${err.message}`
      );
    }
  },

  /**
   * Engine identity block (used by RTT/12 and docs)
   */
  identity() {
    return {
      engine: this.engine,
      version: this.version,
      operators: Object.keys(this.operators)
    };
  }
};

