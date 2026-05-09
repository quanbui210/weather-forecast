import { describe, it, expect } from "vitest";
import { buildQueryParams } from "./client";


describe("buildQueryParams", () => {
  it("should build query params", () => {
    const queryParams = buildQueryParams({
        latitude: 52.520008,
        longitude: 13.405005,
        hours: 24,
    })
    expect(queryParams).toBe("latitude=52.520008&longitude=13.405005&hours=24");
  });
  it("should ignore empty and null params", () => {
    const queryParams = buildQueryParams({
        latitude: 52.520008,
        hourly:undefined,
        longitude: 13.405005,
        daily: "",
        timezone: null,
    })
    expect(queryParams).toBe("latitude=52.520008&longitude=13.405005");
  })
});