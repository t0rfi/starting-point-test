import { describe, it, expect } from "vitest";
import { formatDuration } from "../formatDuration";

describe("formatDuration", () => {
  describe("standard cases", () => {
    it("formats hours and minutes correctly", () => {
      expect(formatDuration(8100)).toBe("2h 15m"); // 2 hours 15 minutes
    });

    it("formats minutes only", () => {
      expect(formatDuration(2700)).toBe("45m"); // 45 minutes
    });

    it("formats hours only when minutes are 0", () => {
      expect(formatDuration(3600)).toBe("1h"); // exactly 1 hour
      expect(formatDuration(7200)).toBe("2h"); // exactly 2 hours
    });

    it("formats single minute", () => {
      expect(formatDuration(60)).toBe("1m");
    });

    it("rounds down partial minutes", () => {
      expect(formatDuration(90)).toBe("1m"); // 1 min 30 sec -> 1m
      expect(formatDuration(119)).toBe("1m"); // 1 min 59 sec -> 1m
    });
  });

  describe("edge cases", () => {
    it("returns '0m' for 0 seconds", () => {
      expect(formatDuration(0)).toBe("0m");
    });

    it("returns '-' for null", () => {
      expect(formatDuration(null)).toBe("-");
    });

    it("returns '-' for undefined", () => {
      expect(formatDuration(undefined)).toBe("-");
    });

    it("returns '0m' for negative numbers", () => {
      expect(formatDuration(-100)).toBe("0m");
    });

    it("handles very small durations (less than 1 minute)", () => {
      expect(formatDuration(30)).toBe("0m");
      expect(formatDuration(59)).toBe("0m");
    });
  });

  describe("large numbers", () => {
    it("handles very large durations", () => {
      expect(formatDuration(86400)).toBe("24h"); // 24 hours
      expect(formatDuration(90000)).toBe("25h"); // 25 hours
      expect(formatDuration(360000)).toBe("100h"); // 100 hours
    });

    it("handles large durations with minutes", () => {
      expect(formatDuration(90060)).toBe("25h 1m"); // 25 hours 1 minute
    });
  });
});
