import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventLoopVisualizer } from "./EventLoopVisualizer";
import type { LoopPhase } from "../eventLoop";

describe("EventLoopVisualizer", () => {
  const mockCodeLines = [
    'console.log("A");',
    'setTimeout(() => console.log("B"), 0);',
    'Promise.resolve().then(() => console.log("C"));',
    'console.log("D");',
  ];

  const defaultProps = {
    codeLines: mockCodeLines,
    displayedLogs: [],
    isPlaying: false,
    onReplay: vi.fn(),
    onPlayingChange: vi.fn(),
    onSoundChange: vi.fn(),
    soundOn: true,
    step: -1,
  };

  it("should render without crashing", () => {
    render(<EventLoopVisualizer {...defaultProps} />);
    expect(screen.getByText("THE EVENT LOOP")).toBeInTheDocument();
  });

  describe("Header", () => {
    it("should display brand information", () => {
      const { container } = render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("JS")).toBeInTheDocument();

      const brand = container.querySelector(".brand");
      expect(brand?.textContent).toContain("LOOP");
      expect(brand?.textContent).toContain("LAB");
    });

    it("should display status information", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText(/LIVE SIMULATION/)).toBeInTheDocument();
      expect(screen.getByText("v1.0")).toBeInTheDocument();
    });
  });

  describe("Introduction Section", () => {
    it("should display title and description", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("THE EVENT LOOP")).toBeInTheDocument();
      expect(
        screen.getByText("JAVASCRIPT RUNTIME / PLAYGROUND 01"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Watch synchronous code, microtasks, and callback queues/,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Transport Controls", () => {
    it("should render play/pause button", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      const playButton = screen.getByRole("button", { name: /PLAY/ });
      expect(playButton).toBeInTheDocument();
    });

    it("should display pause when playing", () => {
      render(<EventLoopVisualizer {...defaultProps} isPlaying={true} />);
      expect(screen.getByText(/PAUSE/)).toBeInTheDocument();
    });

    it("should display play when paused", () => {
      render(<EventLoopVisualizer {...defaultProps} isPlaying={false} />);
      const playButton = screen.getByRole("button", { name: /PLAY/ });
      expect(playButton).toBeInTheDocument();
      expect(playButton.textContent).toContain("PLAY");
    });

    it("should call onPlayingChange when play/pause button is clicked", async () => {
      const user = userEvent.setup();
      const onPlayingChange = vi.fn();

      render(
        <EventLoopVisualizer
          {...defaultProps}
          isPlaying={false}
          onPlayingChange={onPlayingChange}
        />,
      );

      const playButton = screen.getByRole("button", { name: /PLAY/ });
      await user.click(playButton);

      expect(onPlayingChange).toHaveBeenCalledWith(true);
    });

    it("should render sound toggle button", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      const soundButton = screen.getByRole("button", {
        name: /Toggle chime sound/,
      });
      expect(soundButton).toBeInTheDocument();
    });

    it("should call onSoundChange when sound button is clicked", async () => {
      const user = userEvent.setup();
      const onSoundChange = vi.fn();

      render(
        <EventLoopVisualizer
          {...defaultProps}
          soundOn={true}
          onSoundChange={onSoundChange}
        />,
      );

      const soundButton = screen.getByRole("button", {
        name: /Toggle chime sound/,
      });
      await user.click(soundButton);

      expect(onSoundChange).toHaveBeenCalledWith(false);
    });

    it("should apply is-on class to sound button when sound is on", () => {
      const { container } = render(
        <EventLoopVisualizer {...defaultProps} soundOn={true} />,
      );
      const soundButton = screen.getByRole("button", {
        name: /Toggle chime sound/,
      });
      expect(soundButton).toHaveClass("is-on");
    });

    it("should not apply is-on class when sound is off", () => {
      render(<EventLoopVisualizer {...defaultProps} soundOn={false} />);
      const soundButton = screen.getByRole("button", {
        name: /Toggle chime sound/,
      });
      expect(soundButton).not.toHaveClass("is-on");
    });

    it("should render replay button", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      const replayButton = screen.getByRole("button", {
        name: /Replay simulation/,
      });
      expect(replayButton).toBeInTheDocument();
    });

    it("should call onReplay when replay button is clicked", async () => {
      const user = userEvent.setup();
      const onReplay = vi.fn();

      render(<EventLoopVisualizer {...defaultProps} onReplay={onReplay} />);

      const replayButton = screen.getByRole("button", {
        name: /Replay simulation/,
      });
      await user.click(replayButton);

      expect(onReplay).toHaveBeenCalledTimes(1);
    });
  });

  describe("Simulator Section", () => {
    it("should render CodePanel component", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("SOURCE CODE")).toBeInTheDocument();
    });

    it("should render RuntimePanels component", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("CALL STACK")).toBeInTheDocument();
    });

    it("should pass current phase to child components", () => {
      const current: LoopPhase = {
        phase: "stack",
        line: 0,
        label: "Synchronous code runs",
      };

      render(<EventLoopVisualizer {...defaultProps} current={current} />);
      expect(screen.getByText("Synchronous code runs")).toBeInTheDocument();
    });
  });

  describe("OutputPanel", () => {
    it("should render OutputPanel component", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("CONSOLE OUTPUT")).toBeInTheDocument();
    });

    it("should pass displayed logs to OutputPanel", () => {
      const logs = ["A", "D"];
      const { container } = render(
        <EventLoopVisualizer {...defaultProps} displayedLogs={logs} />,
      );

      const consoleLines = container.querySelectorAll(".console-line");
      expect(consoleLines.length).toBeGreaterThan(0);

      logs.forEach((log) => {
        const hasLog = Array.from(consoleLines).some((line) =>
          line.textContent?.includes(log),
        );
        expect(hasLog).toBe(true);
      });
    });
  });

  describe("Footer", () => {
    it("should display footer text", () => {
      render(<EventLoopVisualizer {...defaultProps} />);
      expect(screen.getByText("EVENT LOOP VISUALIZER")).toBeInTheDocument();
      expect(screen.getByText(/CLICK PLAY TO BEGIN/)).toBeInTheDocument();
      expect(screen.getByText("BUILT FOR THE CURIOUS")).toBeInTheDocument();
    });

    it("should show sound ON status in footer", () => {
      render(<EventLoopVisualizer {...defaultProps} soundOn={true} />);
      expect(screen.getByText(/SOUND ON/)).toBeInTheDocument();
    });

    it("should show sound OFF status in footer", () => {
      render(<EventLoopVisualizer {...defaultProps} soundOn={false} />);
      expect(screen.getByText(/SOUND OFF/)).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should handle all props correctly", () => {
      const current: LoopPhase = {
        phase: "microtask",
        line: 2,
        label: "Promise joins microtask queue",
      };

      const props = {
        codeLines: mockCodeLines,
        current,
        displayedLogs: ["A", "D"],
        isPlaying: true,
        onReplay: vi.fn(),
        onPlayingChange: vi.fn(),
        onSoundChange: vi.fn(),
        soundOn: false,
        step: 2,
      };

      const { container } = render(<EventLoopVisualizer {...props} />);

      expect(screen.getByText(/PAUSE/)).toBeInTheDocument();
      expect(screen.getByText(/SOUND OFF/)).toBeInTheDocument();
      expect(
        screen.getByText("Promise joins microtask queue"),
      ).toBeInTheDocument();

      const consoleLines = container.querySelectorAll(".console-line");
      expect(consoleLines.length).toBeGreaterThan(0);
    });

    it("should apply correct CSS classes", () => {
      const { container } = render(<EventLoopVisualizer {...defaultProps} />);

      expect(container.querySelector(".arcade-shell")).toBeInTheDocument();
      expect(container.querySelector(".topbar")).toBeInTheDocument();
      expect(container.querySelector(".intro")).toBeInTheDocument();
      expect(container.querySelector(".simulator")).toBeInTheDocument();
    });
  });
});
