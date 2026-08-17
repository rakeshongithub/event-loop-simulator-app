import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodePanel } from './CodePanel';
import type { LoopPhase } from '../eventLoop';

describe('CodePanel', () => {
  const mockCodeLines = [
    'console.log("A");',
    'setTimeout(() => console.log("B"), 0);',
    'Promise.resolve().then(() => console.log("C"));',
    'console.log("D");',
  ];

  it('should render without crashing', () => {
    render(<CodePanel codeLines={mockCodeLines} />);
    expect(screen.getByText('SOURCE CODE')).toBeInTheDocument();
  });

  it('should display the file tag', () => {
    render(<CodePanel codeLines={mockCodeLines} />);
    expect(screen.getByText('script.js')).toBeInTheDocument();
  });

  it('should render all code lines', () => {
    render(<CodePanel codeLines={mockCodeLines} />);
    
    mockCodeLines.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });

  it('should display line numbers starting from 01', () => {
    render(<CodePanel codeLines={mockCodeLines} />);
    
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('should highlight the active line based on current phase', () => {
    const currentPhase: LoopPhase = {
      phase: 'stack',
      line: 1,
      label: 'Synchronous code runs',
    };

    const { container } = render(
      <CodePanel codeLines={mockCodeLines} current={currentPhase} />
    );

    const codeLines = container.querySelectorAll('.code-line');
    expect(codeLines[1]).toHaveClass('active');
    expect(codeLines[0]).not.toHaveClass('active');
    expect(codeLines[2]).not.toHaveClass('active');
  });

  it('should display the current phase label', () => {
    const currentPhase: LoopPhase = {
      phase: 'microtask',
      line: 2,
      label: 'Promise joins microtask queue',
    };

    render(<CodePanel codeLines={mockCodeLines} current={currentPhase} />);
    expect(screen.getByText('Promise joins microtask queue')).toBeInTheDocument();
  });

  it('should display default message when no current phase', () => {
    render(<CodePanel codeLines={mockCodeLines} />);
    expect(screen.getByText('Press play to trace the runtime')).toBeInTheDocument();
  });

  it('should render with empty code lines array', () => {
    render(<CodePanel codeLines={[]} />);
    expect(screen.getByText('SOURCE CODE')).toBeInTheDocument();
  });

  it('should not highlight any line when current is undefined', () => {
    const { container } = render(<CodePanel codeLines={mockCodeLines} />);
    
    const codeLines = container.querySelectorAll('.code-line');
    codeLines.forEach((line) => {
      expect(line).not.toHaveClass('active');
    });
  });

  it('should render pulse dot element', () => {
    const { container } = render(<CodePanel codeLines={mockCodeLines} />);
    expect(container.querySelector('.pulse-dot')).toBeInTheDocument();
  });

  it('should handle different phase types correctly', () => {
    const phases: LoopPhase[] = [
      { phase: 'stack', line: 0, label: 'Stack execution' },
      { phase: 'web-api', line: 1, label: 'Web API execution' },
      { phase: 'microtask', line: 2, label: 'Microtask execution' },
      { phase: 'task', line: 3, label: 'Task execution' },
    ];

    phases.forEach((phase) => {
      const { rerender } = render(
        <CodePanel codeLines={mockCodeLines} current={phase} />
      );
      expect(screen.getByText(phase.label)).toBeInTheDocument();
      rerender(<CodePanel codeLines={mockCodeLines} />);
    });
  });

  it('should apply correct CSS classes to panel structure', () => {
    const { container } = render(<CodePanel codeLines={mockCodeLines} />);
    
    expect(container.querySelector('.code-panel')).toBeInTheDocument();
    expect(container.querySelector('.panel')).toBeInTheDocument();
    expect(container.querySelector('.panel-heading')).toBeInTheDocument();
    expect(container.querySelector('.code-block')).toBeInTheDocument();
  });
});
