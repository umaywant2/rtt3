/**
 * RTT/3 — Transformation Client Tests
 * -----------------------------------
 * Validates client wrapper behavior for RTT/3 transformation-engine.
 */

import { RTT3TransformClient } from "./transform.client.js";

describe("RTT/3 Transformation Client", () => {
  const validPayload = {
    regimeView: {},
    driftView: {},
    coherenceView: {}
  };

  test("identity() returns correct engine metadata", () => {
    const id = RTT3TransformClient.identity();
    expect(id.engine).toBe("RTT/3");
    expect(id.operator).toBe("transformation-engine");
    expect(id.version).toBe("2026.1");
  });

  test("run() throws when payload is missing", async () => {
    await expect(RTT3TransformClient.run()).rejects.toThrow(
      "TE3-CLIENT-001: Missing transformation payload"
    );
  });

  test("run() throws when required fields are missing", async () => {
    const badPayload = { regimeView: {} };
    await expect(RTT3TransformClient.run(badPayload)).rejects.toThrow(
      "TE3-CLIENT-002: Missing field 'driftView'"
    );
  });

  test("run() throws on network failure", async () => {
    global.fetch = jest.fn(() => {
      throw new Error("Network down");
    });

    await expect(RTT3TransformClient.run(validPayload)).rejects.toThrow(
      "TE3-CLIENT-004: Network or runtime error — Network down"
    );
  });

  test("run() throws on non-OK response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "TE3-001: Missing transformation inputs" })
      })
    );

    await expect(RTT3TransformClient.run(validPayload)).rejects.toThrow(
      "TE3-CLIENT-003: Transformation failed — TE3-001: Missing transformation inputs"
    );
  });

  test("run() returns transformation output on success", async () => {
    const mockOutput = {
      engine: "RTT/3",
      operator: "transformation-engine",
      version: "2026.1",
      structuralTopology: [],
      intersections: [],
      surfaces: [],
      gpuTopology: {
        topology: {
          surfaces: [],
          intersections: [],
          overlays: []
        }
      }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOutput)
      })
    );

    const result = await RTT3TransformClient.run(validPayload);
    expect(result.engine).toBe("RTT/3");
    expect(result.operator).toBe("transformation-engine");
    expect(result.structuralTopology).toBeInstanceOf(Array);
    expect(result.intersections).toBeInstanceOf(Array);
    expect(result.surfaces).toBeInstanceOf(Array);
    expect(result.gpuTopology).toHaveProperty("topology");
  });
});

