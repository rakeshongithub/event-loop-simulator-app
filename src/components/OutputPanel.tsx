type OutputPanelProps = { displayedLogs: string[] };
const executionOrder = ["A", "D", "C", "B"];

export function OutputPanel({ displayedLogs }: OutputPanelProps) {
  return (
    <section className="bottom-grid">
      <div className="console-panel panel">
        <div className="panel-heading">
          <span className="panel-kicker">CONSOLE OUTPUT</span>
          <span className="console-live">● TERMINAL</span>
        </div>
        <div className="console-output">
          {displayedLogs.length ? (
            displayedLogs.map((log, index) => (
              <div className="console-line" key={`${log}-${index}`}>
                <span className="console-prompt">›</span>
                <strong>{log}</strong>
                <span className="console-time">
                  {String(index + 1).padStart(2, "0")} ms
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">AWAITING EXECUTION...</div>
          )}
        </div>
      </div>
      <div className="order-panel panel">
        <span className="panel-kicker">ACTUAL ORDER</span>
        <div className="order-sequence">
          {executionOrder.map((letter, index) => (
            <span
              className={displayedLogs.includes(letter) ? "seen" : ""}
              key={letter}
            >
              <b>{letter}</b>
              {index < 3 && <i>→</i>}
            </span>
          ))}
        </div>
        <p>Sync first. Microtasks next. Tasks last.</p>
      </div>
    </section>
  );
}
