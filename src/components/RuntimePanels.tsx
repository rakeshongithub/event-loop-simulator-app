import type { LoopPhase, Phase } from "../eventLoop";

type RuntimePanelsProps = { current?: LoopPhase; step: number };

function RuntimePanel({
  active,
  title,
  children,
  meta,
}: {
  active: boolean;
  title: string;
  children: React.ReactNode;
  meta: string;
}) {
  return (
    <div className={`panel runtime-panel ${active ? "active-panel" : ""}`}>
      <div className="panel-heading">
        <span className="panel-kicker">{title}</span>
        <span className="stack-count">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function QueuePanel({
  active,
  title,
  children,
  count,
}: {
  active: boolean;
  title: string;
  children: React.ReactNode;
  count: string;
}) {
  return (
    <div className={`queue panel ${active ? "active-panel" : ""}`}>
      <div className="panel-heading">
        <span className="panel-kicker">{title}</span>
        <span className="queue-badge">{count}</span>
      </div>
      <div className="queue-track">{children}</div>
    </div>
  );
}

export function RuntimePanels({ current, step }: RuntimePanelsProps) {
  const is = (phase: Phase) => current?.phase === phase;
  return (
    <div className="runtime-column">
      <div className="runtime-grid">
        <RuntimePanel
          active={is("stack")}
          title="CALL STACK"
          meta={is("stack") ? "RUNNING" : "IDLE"}
        >
          <div className="stack-area">
            {is("stack") ? (
              <div className="stack-card">
                <span className="stack-icon">ƒ</span>
                <div>
                  <strong>anonymous()</strong>
                  <small>global execution context</small>
                </div>
              </div>
            ) : (
              <div className="empty-state">STACK EMPTY</div>
            )}
          </div>
        </RuntimePanel>
        <RuntimePanel active={is("web-api")} title="WEB APIs" meta="BROWSER">
          <div className="stack-area">
            {step >= 1 && step < 5 ? (
              <div className="api-card">
                <span className="timer-icon">◷</span>
                <div>
                  <strong>setTimeout</strong>
                  <small>timer: 0 ms</small>
                </div>
                <span className="api-bars">▂▅▇</span>
              </div>
            ) : (
              <div className="empty-state">NO PENDING APIS</div>
            )}
          </div>
        </RuntimePanel>
      </div>
      <div className="queues-grid">
        <QueuePanel
          active={is("microtask")}
          title="MICROTASK QUEUE"
          count={step >= 2 && step < 4 ? "1" : "0"}
        >
          {step >= 2 && step < 4 ? (
            <div className="queue-pill promise">
              <span>✦</span> Promise.then()
            </div>
          ) : (
            <div className="empty-state">QUEUE EMPTY</div>
          )}
        </QueuePanel>
        <QueuePanel
          active={is("task")}
          title="TASK QUEUE"
          count={step === 5 ? "1" : "0"}
        >
          {step === 5 ? (
            <div className="queue-pill timeout">
              <span>◷</span> setTimeout callback
            </div>
          ) : (
            <div className="empty-state">QUEUE EMPTY</div>
          )}
        </QueuePanel>
      </div>
    </div>
  );
}
