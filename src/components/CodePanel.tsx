import type { LoopPhase } from "../eventLoop";

type CodePanelProps = {
  codeLines: string[];
  current?: LoopPhase;
};

export function CodePanel({ codeLines, current }: CodePanelProps) {
  return (
    <aside className="code-panel panel">
      <div className="panel-heading">
        <span className="panel-kicker">SOURCE CODE</span>
        <span className="file-tag">script.js</span>
      </div>
      <div className="code-block">
        {codeLines.map((line, index) => (
          <div
            className={`code-line ${current?.line === index ? "active" : ""}`}
            key={line}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <code>{line}</code>
          </div>
        ))}
      </div>
      <div className="execution-note">
        <span className="pulse-dot" />{" "}
        {current?.label ?? "Press play to trace the runtime"}
      </div>
    </aside>
  );
}
