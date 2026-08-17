# JavaScript Event Loop Visualizer

🎯 **An interactive educational tool that visualizes how JavaScript's event loop handles synchronous code, promises (microtasks), and callbacks (tasks).**

![Version](https://img.shields.io/badge/version-1.0-blue)
![React](https://img.shields.io/badge/React-19.2.8-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue)
![Vite](https://img.shields.io/badge/Vite-8.2.0-646cff)

<p align="center">
  <img src="src/event-loop.jpg" alt="JavaScript Event Loop Visualizer Screenshot" width="800">
</p>

### 🎥 Demo Video

<p align="center">
  <video src="event-loop-in-js-simulator.mov" width="800" controls>
    Your browser does not support the video tag.
  </video>
</p>

> **Note**: If the video doesn't play in GitHub, you can [download it here](event-loop-in-js-simulator.mov) or clone the repository to view it locally.

## 🌟 What This App Does

This application provides a **live, step-by-step visualization** of JavaScript's event loop execution model. It helps developers understand:

- **Call Stack Execution**: How synchronous code runs in the call stack
- **Web APIs**: How browser APIs handle timers (setTimeout, setInterval)
- **Microtask Queue**: How Promises are prioritized over regular callbacks
- **Task Queue**: How callbacks from setTimeout/setInterval are queued
- **Execution Order**: Why the output is `A → D → C → B` instead of `A → B → C → D`

### 📚 Educational Value

The visualizer demonstrates a classic JavaScript interview question:

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**Output**: `A, D, C, B`

**Why?**

1. **Sync first**: `A` and `D` execute immediately on the call stack
2. **Microtasks next**: Promise callback `C` runs before any tasks
3. **Tasks last**: setTimeout callback `B` runs after all microtasks

## ✨ Features

- 🎬 **Interactive Playback**: Play, pause, and replay the simulation
- 🔊 **Audio Feedback**: Optional chime sounds for each execution step
- 📊 **Real-time Visualization**: See the call stack, Web APIs, and queues update live
- 🎨 **Retro Arcade Design**: Engaging UI with a nostalgic aesthetic
- ⚡ **Built with Modern Tools**: React 19, TypeScript, Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── EventLoopVisualizer.tsx  # Main visualizer component
│   ├── CodePanel.tsx             # Displays source code with highlighting
│   ├── RuntimePanels.tsx         # Shows call stack and Web APIs
│   └── OutputPanel.tsx           # Console output and execution order
├── eventLoop.ts                  # Custom hook managing simulation state
├── App.tsx                       # Root application component
└── test/                         # Test setup and utilities
```

## 🧪 Testing

The project includes comprehensive test coverage using:

- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation

### Test Coverage

- ✅ **eventLoop.ts**: Hook state management, timers, audio context
- ✅ **CodePanel.tsx**: Code highlighting, phase labels
- ✅ **OutputPanel.tsx**: Console output, execution order display
- ✅ **RuntimePanels.tsx**: Call stack, queues, Web APIs visualization
- ✅ **EventLoopVisualizer.tsx**: Full integration, user interactions

## 🎮 How to Use

1. **Click PLAY** to start the simulation
2. **Watch** as code executes step-by-step
3. **Observe** how different phases are highlighted:
   - **Yellow glow**: Active call stack execution
   - **Colored panels**: Active queue (microtask or task)
4. **Click the sound icon** (◖))) to toggle audio feedback
5. **Click replay** (↻) to restart the simulation

## 🎯 Key Concepts Demonstrated

### Event Loop Phases

1. **Stack**: Synchronous code execution
2. **Web API**: Browser APIs (timers, fetch, etc.)
3. **Microtask Queue**: Promise callbacks, queueMicrotask
4. **Task Queue**: setTimeout, setInterval, DOM events

### Priority Order

```
Synchronous Code → Microtasks → Tasks
```

## 🛠️ Technology Stack

- **React 19.2.8**: UI library with latest features
- **TypeScript 6.0.2**: Type-safe development
- **Vite 8.2.0**: Lightning-fast build tool
- **Vitest**: Next-generation testing framework
- **Web Audio API**: Sound effects for engagement

## 📝 License

MIT License - feel free to use this for educational purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📚 Learn More

- [JavaScript Event Loop (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) (Philip Roberts)

---

**Built for the curious** 🚀 | **LOOP.LAB v1.0**

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
