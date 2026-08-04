/**
 * RTT/3 — Next-Step Client
 * ------------------------
 * Lightweight client wrapper for calling the RTT/3 synthesis operator.
 * This module does not perform synthesis; it only sends/receives data.
 */

export const RTT3NextClient = {
  engine: "RTT/3",
  operator: "next-step",
  version: "2026.1",

  /**
   * Call the RTT/3 synthesis endpoint.
   * @param {Object} payload - The four RTT/3 operator outputs.
   * @returns {Promise<Object>} Unified RTT/3 topology.
   */
  async run(payload) {
    if (!payload) {
      throw new Error("NS3-CLIENT-001: Missing synthesis payload");
    }

    const required = [
      "structuralTopology",
      "intersections",
      "surfaces",
      "gpuTopology"
    ];

    for (const key of required) {
      if (!(key in payload)) {
        throw new Error(`NS3-CLIENT-002: Missing field '${key}'`);
      }
    }

    try {
      const response = await fetch("/api/rtt3/next-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `NS3-CLIENT-003: Synthesis failed — ${err.error || response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        `NS3-CLIENT-004: Network or runtime error — ${error.message}`
      );
    }
  },

  /**
   * Identity block for debugging and RTT/12 integration.
   */
  identity() {
    return {
      engine: this.engine,
      operator: this.operator,
      version: this.version
    };
  }
};

