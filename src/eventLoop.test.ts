import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEventLoop, codeLines, phases } from "./eventLoop";

describe("eventLoop.ts", () => {
  describe("codeLines", () => {
    it("should export the correct code lines", () => {
      expect(codeLines).toEqual([
        'console.log("A");',
        'setTimeout(() => console.log("B"), 0);',
        'Promise.resolve().then(() => console.log("C"));',
        'console.log("D");',
      ]);
      expect(codeLines).toHaveLength(4);
    });
  });

  describe("phases", () => {
    it("should export the correct phases array", () => {
      expect(phases).toHaveLength(6);
      expect(phases[0]).toEqual({
        phase: "stack",
        line: 0,
        label: "Synchronous code runs",
      });
      expect(phases[1]).toEqual({
        phase: "web-api",
        line: 1,
        label: "Timer handed to Web APIs",
      });
      expect(phases[2]).toEqual({
        phase: "microtask",
        line: 2,
        label: "Promise joins microtask queue",
      });
    });

    it("should have valid phase types", () => {
      const validPhases = ["stack", "web-api", "microtask", "task"];
      phases.forEach((phase) => {
        expect(validPhases).toContain(phase.phase);
      });
    });

    it("should have valid line numbers", () => {
      phases.forEach((phase) => {
        expect(phase.line).toBeGreaterThanOrEqual(0);
        expect(phase.line).toBeLessThan(codeLines.length);
      });
    });
  });

  describe("useEventLoop", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should initialize with default values", () => {
      const { result } = renderHook(() => useEventLoop());

      expect(result.current.step).toBe(-1);
      expect(result.current.isPlaying).toBe(true);
      expect(result.current.soundOn).toBe(true);
      expect(result.current.current).toBeUndefined();
      expect(result.current.displayedLogs).toEqual([]);
      expect(result.current.codeLines).toEqual(codeLines);
    });

    it("should advance steps when playing", async () => {
      const { result } = renderHook(() => useEventLoop());

      expect(result.current.step).toBe(-1);

      // Advance to first step
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.step).toBe(0);
    });

    it("should pause when isPlaying is false", async () => {
      const { result } = renderHook(() => useEventLoop());

      act(() => {
        result.current.setIsPlaying(false);
      });

      const initialStep = result.current.step;

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.step).toBe(initialStep);
      expect(result.current.isPlaying).toBe(false);
    });

    it("should reset to -1 after completing all phases", async () => {
      const { result } = renderHook(() => useEventLoop());

      // Advance through all steps
      for (let i = 0; i < phases.length + 1; i++) {
        await act(async () => {
          vi.advanceTimersByTime(i === 0 ? 500 : 1200);
          await vi.runOnlyPendingTimersAsync();
        });
      }

      expect(result.current.step).toBe(-1);
    });

    it("should toggle sound on/off", () => {
      const { result } = renderHook(() => useEventLoop());

      expect(result.current.soundOn).toBe(true);

      act(() => {
        result.current.setSoundOn(false);
      });

      expect(result.current.soundOn).toBe(false);

      act(() => {
        result.current.setSoundOn(true);
      });

      expect(result.current.soundOn).toBe(true);
    });

    it("should replay from beginning", async () => {
      const { result } = renderHook(() => useEventLoop());

      // Advance to step 2
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.step).toBe(0);

      await act(async () => {
        vi.advanceTimersByTime(1200);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.step).toBe(1);

      // Replay
      act(() => {
        result.current.replay();
      });

      expect(result.current.step).toBe(-1);
      expect(result.current.isPlaying).toBe(true);
    });

    it("should display correct logs based on current step", async () => {
      const { result } = renderHook(() => useEventLoop());

      // Initially no logs
      expect(result.current.displayedLogs).toEqual([]);

      // Advance to first step (line 0: console.log("A"))
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.displayedLogs).toEqual(["A"]);

      // Advance to step 2 (skips web-api)
      await act(async () => {
        vi.advanceTimersByTime(1200);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.step).toBe(1);

      // Step 1 is web-api, shouldn't add to logs
      expect(result.current.displayedLogs).toEqual(["A"]);
    });

    it("should filter out web-api phases from displayed logs", async () => {
      const { result } = renderHook(() => useEventLoop());

      // Advance through several steps
      for (let i = 0; i <= 3; i++) {
        await act(async () => {
          vi.advanceTimersByTime(i === 0 ? 500 : 1200);
          await vi.runOnlyPendingTimersAsync();
        });
      }

      expect(result.current.step).toBeGreaterThanOrEqual(3);

      // Should have A, D (steps 0 and 3 - synchronous)
      const logs = result.current.displayedLogs;
      expect(logs).toContain("A");
      expect(logs).toContain("D");
    });

    it("should set current phase correctly", async () => {
      const { result } = renderHook(() => useEventLoop());

      // Advance to first step
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runOnlyPendingTimersAsync();
      });

      expect(result.current.current).toEqual(phases[0]);
    });

    it("should handle AudioContext gracefully when unavailable", () => {
      const originalAudioContext = window.AudioContext;
      // @ts-expect-error - Testing undefined AudioContext
      window.AudioContext = undefined;

      const { result } = renderHook(() => useEventLoop());

      // Should not throw error
      expect(() => {
        act(() => {
          result.current.replay();
        });
      }).not.toThrow();

      window.AudioContext = originalAudioContext;
    });

    it("should not play sound when soundOn is false", () => {
      const mockCreateOscillator = vi.fn();
      const mockCreateGain = vi.fn();

      const mockAudioContext = {
        createOscillator: mockCreateOscillator,
        createGain: mockCreateGain,
        currentTime: 0,
      };

      // @ts-expect-error - Mocking AudioContext
      window.AudioContext = vi.fn(() => mockAudioContext);

      const { result } = renderHook(() => useEventLoop());

      act(() => {
        result.current.setSoundOn(false);
      });

      act(() => {
        result.current.replay();
      });

      expect(mockCreateOscillator).not.toHaveBeenCalled();
    });

    it("should return all expected hook values", () => {
      const { result } = renderHook(() => useEventLoop());

      expect(result.current).toHaveProperty("codeLines");
      expect(result.current).toHaveProperty("current");
      expect(result.current).toHaveProperty("displayedLogs");
      expect(result.current).toHaveProperty("isPlaying");
      expect(result.current).toHaveProperty("replay");
      expect(result.current).toHaveProperty("setIsPlaying");
      expect(result.current).toHaveProperty("setSoundOn");
      expect(result.current).toHaveProperty("soundOn");
      expect(result.current).toHaveProperty("step");
    });
  });
});
