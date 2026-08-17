import type { LoopPhase } from "../eventLoop";
import { CodePanel } from "./CodePanel";
import { OutputPanel } from "./OutputPanel";
import { RuntimePanels } from "./RuntimePanels";

type EventLoopVisualizerProps = {
  codeLines: string[];
  current?: LoopPhase;
  displayedLogs: string[];
  isPlaying: boolean;
  onReplay: () => void;
  onPlayingChange: (playing: boolean) => void;
  onSoundChange: (enabled: boolean) => void;
  soundOn: boolean;
  step: number;
};

export function EventLoopVisualizer({
  codeLines,
  current,
  displayedLogs,
  isPlaying,
  onReplay,
  onPlayingChange,
  onSoundChange,
  soundOn,
  step,
}: EventLoopVisualizerProps) {
  return (
    <main className="arcade-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">JS</span>
          <span>
            LOOP<span className="brand-dot">.</span>LAB
          </span>
        </div>
        <div className="status">
          <span className="status-light" /> LIVE SIMULATION{" "}
          <span className="version">v1.0</span>
        </div>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">JAVASCRIPT RUNTIME / PLAYGROUND 01</p>
          <h1>THE EVENT LOOP</h1>
          <p className="lede">
            Watch synchronous code, microtasks, and callback queues compete for
            the call stack.
          </p>
        </div>
        <div className="transport">
          <button
            className="primary-button"
            type="button"
            onClick={() => onPlayingChange(!isPlaying)}
          >
            <span>{isPlaying ? "Ⅱ" : "▶"}</span> {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button
            className={`icon-button ${soundOn ? "is-on" : ""}`}
            type="button"
            aria-label="Toggle chime sound"
            title="Toggle chime sound"
            onClick={() => onSoundChange(!soundOn)}
          >
            ◖))
          </button>
          <button
            className="reset-button"
            type="button"
            onClick={onReplay}
            aria-label="Replay simulation"
            title="Replay simulation"
          >
            ↻
          </button>
        </div>
      </section>
      <section className="simulator">
        <CodePanel codeLines={codeLines} current={current} />
        <RuntimePanels current={current} step={step} />
      </section>
      <OutputPanel displayedLogs={displayedLogs} />
      <footer>
        <span>EVENT LOOP VISUALIZER</span>
        <span>
          CLICK PLAY TO BEGIN <b>•</b> SOUND {soundOn ? "ON" : "OFF"}
        </span>
        <span>BUILT FOR THE CURIOUS</span>
      </footer>
    </main>
  );
}
