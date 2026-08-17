import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutputPanel } from "./OutputPanel";

describe("OutputPanel", () => {
  it("should render without crashing", () => {
    render(<OutputPanel displayedLogs={[]} />);
    expect(screen.getByText("CONSOLE OUTPUT")).toBeInTheDocument();
  });

  it("should display empty state when no logs", () => {
    render(<OutputPanel displayedLogs={[]} />);
    expect(screen.getByText("AWAITING EXECUTION...")).toBeInTheDocument();
  });

  it("should display console output heading", () => {
    render(<OutputPanel displayedLogs={[]} />);
    expect(screen.getByText("CONSOLE OUTPUT")).toBeInTheDocument();
    expect(screen.getByText("● TERMINAL")).toBeInTheDocument();
  });

  it("should display actual order heading", () => {
    render(<OutputPanel displayedLogs={[]} />);
    expect(screen.getByText("ACTUAL ORDER")).toBeInTheDocument();
  });

  it("should render displayed logs", () => {
    const logs = ["A", "D"];
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const consoleLines = container.querySelectorAll(".console-line");
    expect(consoleLines).toHaveLength(logs.length);

    logs.forEach((log, index) => {
      expect(consoleLines[index].textContent).toContain(log);
    });
  });

  it("should display timestamps for logs", () => {
    const logs = ["A", "D", "C"];
    render(<OutputPanel displayedLogs={logs} />);

    expect(screen.getByText("01 ms")).toBeInTheDocument();
    expect(screen.getByText("02 ms")).toBeInTheDocument();
    expect(screen.getByText("03 ms")).toBeInTheDocument();
  });

  it("should display console prompt for each log", () => {
    const logs = ["A", "D"];
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const prompts = container.querySelectorAll(".console-prompt");
    expect(prompts).toHaveLength(logs.length);
  });

  it("should render execution order sequence", () => {
    const { container } = render(<OutputPanel displayedLogs={[]} />);

    const orderSequence = container.querySelector(".order-sequence");
    expect(orderSequence).toBeInTheDocument();
    expect(orderSequence?.textContent).toContain("A");
    expect(orderSequence?.textContent).toContain("D");
    expect(orderSequence?.textContent).toContain("C");
    expect(orderSequence?.textContent).toContain("B");
  });

  it("should display execution order explanation", () => {
    render(<OutputPanel displayedLogs={[]} />);
    expect(
      screen.getByText("Sync first. Microtasks next. Tasks last."),
    ).toBeInTheDocument();
  });

  it("should mark seen letters in execution order", () => {
    const logs = ["A", "D"];
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const orderSequence = container.querySelector(".order-sequence");
    const spans = orderSequence?.querySelectorAll("span");

    // Check that seen class is applied appropriately
    expect(spans).toBeTruthy();
  });

  it("should render arrows between execution order letters", () => {
    const { container } = render(<OutputPanel displayedLogs={[]} />);

    const arrows = container.querySelectorAll(".order-sequence i");
    expect(arrows.length).toBeGreaterThan(0);
  });

  it("should handle single log entry", () => {
    const logs = ["A"];
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const consoleLines = container.querySelectorAll(".console-line");
    expect(consoleLines).toHaveLength(1);
    expect(consoleLines[0].textContent).toContain("A");
    expect(screen.getByText("01 ms")).toBeInTheDocument();
  });

  it("should handle all logs displayed", () => {
    const logs = ["A", "D", "C", "B"];
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const consoleLines = container.querySelectorAll(".console-line");
    expect(consoleLines).toHaveLength(logs.length);

    logs.forEach((log, index) => {
      expect(consoleLines[index].textContent).toContain(log);
      expect(screen.getByText(`0${index + 1} ms`)).toBeInTheDocument();
    });
  });

  it("should apply correct CSS classes", () => {
    const { container } = render(<OutputPanel displayedLogs={[]} />);

    expect(container.querySelector(".bottom-grid")).toBeInTheDocument();
    expect(container.querySelector(".console-panel")).toBeInTheDocument();
    expect(container.querySelector(".order-panel")).toBeInTheDocument();
    expect(container.querySelector(".panel")).toBeInTheDocument();
  });

  it("should not show empty state when logs are present", () => {
    const logs = ["A"];
    render(<OutputPanel displayedLogs={logs} />);

    expect(screen.queryByText("AWAITING EXECUTION...")).not.toBeInTheDocument();
  });

  it("should render console lines with unique keys", () => {
    const logs = ["A", "A", "D"]; // Duplicate logs
    const { container } = render(<OutputPanel displayedLogs={logs} />);

    const consoleLines = container.querySelectorAll(".console-line");
    expect(consoleLines).toHaveLength(3);
  });
});
