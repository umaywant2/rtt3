/**
 * RTT/3 — Transformation Client
 * -----------------------------
 * Lightweight client wrapper for calling the RTT/3 transformation-engine.
 * This module does not perform transformation; it only sends/receives data.
 */

export const RTT3TransformClient = {
  engine: "RTT/3",
  operator: "transformation-engine",
  version: "2026.1",

  /**
   * Call the RTT/3 transformation endpoint.
   * @param {Object} payload - RTT/2 gpu-stack input.
   * @returns {Promise<Object>} RTT/3 transformation output.
   */
  async run(payload) {
    if (!payload) {
      throw new Error("TE3-CLIENT-001: Missing transformation payload");
    }

    const required = ["regimeView", "driftView", "coherenceView"];

    for (const key of required) {
      if (!(key in payload)) {
        throw new Error(`TE3-CLIENT-002: Missing field '${key}'`);
      }
    }

    try {
      const response = await fetch("/api/rtt3/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `TE3-CLIENT-003: Transformation failed — ${err.error || response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        `TE3-CLIENT-004: Network or runtime error — ${error.message}`
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

