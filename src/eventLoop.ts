import { useCallback, useEffect, useRef, useState } from "react";

export type Phase = "stack" | "web-api" | "microtask" | "task";
export type LoopPhase = { phase: Phase; line: number; label: string };

export const codeLines = [
  'console.log("A");',
  'setTimeout(() => console.log("B"), 0);',
  'Promise.resolve().then(() => console.log("C"));',
  'console.log("D");',
];

export const phases: LoopPhase[] = [
  { phase: "stack", line: 0, label: "Synchronous code runs" },
  { phase: "web-api", line: 1, label: "Timer handed to Web APIs" },
  { phase: "microtask", line: 2, label: "Promise joins microtask queue" },
  { phase: "stack", line: 3, label: "Synchronous code runs" },
  { phase: "microtask", line: 2, label: "Microtasks run first" },
  { phase: "task", line: 1, label: "Callback joins the task queue" },
];

const getAudioContext = () =>
  window.AudioContext ||
  (window as typeof window & { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext;

export function useEventLoop() {
  const [step, setStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const audioContext = useRef<AudioContext | null>(null);
  const current = step >= 0 ? phases[step] : undefined;

  const chime = useCallback(
    (frequency: number) => {
      if (!soundOn) return;
      const AudioContextClass = getAudioContext();
      if (!AudioContextClass) return;
      audioContext.current ??= new AudioContextClass();
      const context = audioContext.current;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.22,
      );
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.24);
    },
    [soundOn],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(
      () => {
        setStep((previous) => {
          const next = previous + 1;
          if (next >= phases.length) {
            chime(320);
            return -1;
          }
          chime(320 + next * 70);
          return next;
        });
      },
      step === -1 ? 500 : 1200,
    );
    return () => window.clearTimeout(timer);
  }, [chime, isPlaying, step]);

  const replay = useCallback(() => {
    setStep(-1);
    setIsPlaying(true);
    chime(320);
  }, [chime]);

  const displayedLogs =
    step >= 0
      ? phases
          .slice(0, step + 1)
          .filter(({ phase }) => phase !== "web-api")
          .map(({ line }) => codeLines[line].match(/"([A-Z])"/)?.[1])
          .filter((log): log is string => Boolean(log))
      : [];

  return {
    codeLines,
    current,
    displayedLogs,
    isPlaying,
    replay,
    setIsPlaying,
    setSoundOn,
    soundOn,
    step,
  };
}
