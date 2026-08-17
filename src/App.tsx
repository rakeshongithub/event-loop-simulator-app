import "./App.css";
import { EventLoopVisualizer } from "./components/EventLoopVisualizer";
import { useEventLoop } from "./eventLoop";

function App() {
  const eventLoop = useEventLoop();

  return (
    <EventLoopVisualizer
      {...eventLoop}
      onReplay={eventLoop.replay}
      onPlayingChange={eventLoop.setIsPlaying}
      onSoundChange={eventLoop.setSoundOn}
    />
  );
}

export default App;
