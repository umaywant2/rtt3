/**
 * RTT/3 — Next-Step Client Tests
 * ------------------------------
 * Validates client wrapper behavior for RTT/3 synthesis.
 */

import { RTT3NextClient } from "./next.client.js";

describe("RTT/3 Next-Step Client", () => {
  const validPayload = {
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

  test("identity() returns correct engine metadata", () => {
    const id = RTT3NextClient.identity();
    expect(id.engine).toBe("RTT/3");
    expect(id.operator).toBe("next-step");
    expect(id.version).toBe("2026.1");
  });

  test("run() throws when payload is missing", async () => {
    await expect(RTT3NextClient.run()).rejects.toThrow(
      "NS3-CLIENT-001: Missing synthesis payload"
    );
  });

  test("run() throws when required fields are missing", async () => {
    const badPayload = { structuralTopology: [] };
    await expect(RTT3NextClient.run(badPayload)).rejects.toThrow(
      "NS3-CLIENT-002: Missing field 'intersections'"
    );
  });

  test("run() throws on network failure", async () => {
    global.fetch = jest.fn(() => {
      throw new Error("Network down");
    });

    await expect(RTT3NextClient.run(validPayload)).rejects.toThrow(
      "NS3-CLIENT-004: Network or runtime error — Network down"
    );
  });

  test("run() throws on non-OK response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "NS3-001: Missing synthesis inputs" })
      })
    );

    await expect(RTT3NextClient.run(validPayload)).rejects.toThrow(
      "NS3-CLIENT-003: Synthesis failed — NS3-001: Missing synthesis inputs"
    );
  });

  test("run() returns unified topology on success", async () => {
    const mockTopology = {
      engine: "RTT/3",
      operator: "next-step",
      version: "2026.1",
      topology: {
        surfaces: [],
        intersections: [],
        overlays: []
      }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTopology)
      })
    );

    const result = await RTT3NextClient.run(validPayload);
    expect(result.engine).toBe("RTT/3");
    expect(result.operator).toBe("next-step");
    expect(result.topology).toHaveProperty("surfaces");
    expect(result.topology).toHaveProperty("intersections");
    expect(result.topology).toHaveProperty("overlays");
  });
});

