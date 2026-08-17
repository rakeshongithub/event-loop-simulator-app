import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RuntimePanels } from './RuntimePanels';
import type { LoopPhase } from '../eventLoop';

describe('RuntimePanels', () => {
  it('should render without crashing', () => {
    render(<RuntimePanels step={-1} />);
    expect(screen.getByText('CALL STACK')).toBeInTheDocument();
    expect(screen.getByText('WEB APIs')).toBeInTheDocument();
  });

  it('should render microtask and task queues', () => {
    render(<RuntimePanels step={-1} />);
    expect(screen.getByText('MICROTASK QUEUE')).toBeInTheDocument();
    expect(screen.getByText('TASK QUEUE')).toBeInTheDocument();
  });

  describe('Call Stack', () => {
    it('should show stack empty when not active', () => {
      render(<RuntimePanels step={-1} />);
      const emptyStates = screen.getAllByText('STACK EMPTY');
      expect(emptyStates.length).toBeGreaterThan(0);
    });

    it('should show running status when stack is active', () => {
      const current: LoopPhase = {
        phase: 'stack',
        line: 0,
        label: 'Synchronous code runs',
      };
      render(<RuntimePanels current={current} step={0} />);
      expect(screen.getByText('RUNNING')).toBeInTheDocument();
    });

    it('should show idle status when stack is not active', () => {
      const current: LoopPhase = {
        phase: 'web-api',
        line: 1,
        label: 'Timer handed to Web APIs',
      };
      render(<RuntimePanels current={current} step={1} />);
      expect(screen.getByText('IDLE')).toBeInTheDocument();
    });

    it('should display anonymous function when stack is active', () => {
      const current: LoopPhase = {
        phase: 'stack',
        line: 0,
        label: 'Synchronous code runs',
      };
      render(<RuntimePanels current={current} step={0} />);
      expect(screen.getByText('anonymous()')).toBeInTheDocument();
      expect(screen.getByText('global execution context')).toBeInTheDocument();
    });

    it('should apply active-panel class when stack phase is active', () => {
      const current: LoopPhase = {
        phase: 'stack',
        line: 0,
        label: 'Synchronous code runs',
      };
      const { container } = render(<RuntimePanels current={current} step={0} />);
      const activePanels = container.querySelectorAll('.active-panel');
      expect(activePanels.length).toBeGreaterThan(0);
    });
  });

  describe('Web APIs', () => {
    it('should show browser meta tag', () => {
      render(<RuntimePanels step={-1} />);
      expect(screen.getByText('BROWSER')).toBeInTheDocument();
    });

    it('should show no pending APIs when step is before 1', () => {
      render(<RuntimePanels step={0} />);
      const noPendingStates = screen.getAllByText('NO PENDING APIS');
      expect(noPendingStates.length).toBeGreaterThan(0);
    });

    it('should show setTimeout when step is between 1 and 4', () => {
      render(<RuntimePanels step={2} />);
      expect(screen.getByText('setTimeout')).toBeInTheDocument();
      expect(screen.getByText('timer: 0 ms')).toBeInTheDocument();
    });

    it('should hide setTimeout when step is 5 or greater', () => {
      render(<RuntimePanels step={5} />);
      expect(screen.queryByText('setTimeout')).not.toBeInTheDocument();
    });

    it('should apply active-panel class when web-api phase is active', () => {
      const current: LoopPhase = {
        phase: 'web-api',
        line: 1,
        label: 'Timer handed to Web APIs',
      };
      const { container } = render(<RuntimePanels current={current} step={1} />);
      const activePanels = container.querySelectorAll('.active-panel');
      expect(activePanels.length).toBeGreaterThan(0);
    });
  });

  describe('Microtask Queue', () => {
    it('should show queue empty when step is before 2', () => {
      render(<RuntimePanels step={1} />);
      const emptyStates = screen.getAllByText('QUEUE EMPTY');
      expect(emptyStates.length).toBeGreaterThan(0);
    });

    it('should show count 1 when step is between 2 and 3', () => {
      render(<RuntimePanels step={2} />);
      const badges = screen.getAllByText('1');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show count 0 when step is 4 or greater', () => {
      render(<RuntimePanels step={4} />);
      const badges = screen.getAllByText('0');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display Promise.then() when active', () => {
      render(<RuntimePanels step={2} />);
      expect(screen.getByText(/Promise.then\(\)/)).toBeInTheDocument();
    });

    it('should apply active-panel class when microtask phase is active', () => {
      const current: LoopPhase = {
        phase: 'microtask',
        line: 2,
        label: 'Promise joins microtask queue',
      };
      const { container } = render(<RuntimePanels current={current} step={2} />);
      const activePanels = container.querySelectorAll('.active-panel');
      expect(activePanels.length).toBeGreaterThan(0);
    });
  });

  describe('Task Queue', () => {
    it('should show count 1 when step is 5', () => {
      render(<RuntimePanels step={5} />);
      const badges = screen.getAllByText('1');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show count 0 when step is not 5', () => {
      render(<RuntimePanels step={3} />);
      const badges = screen.getAllByText('0');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display setTimeout callback when step is 5', () => {
      render(<RuntimePanels step={5} />);
      expect(screen.getByText('setTimeout callback')).toBeInTheDocument();
    });

    it('should show queue empty when step is not 5', () => {
      render(<RuntimePanels step={3} />);
      const emptyStates = screen.getAllByText('QUEUE EMPTY');
      expect(emptyStates.length).toBeGreaterThan(0);
    });

    it('should apply active-panel class when task phase is active', () => {
      const current: LoopPhase = {
        phase: 'task',
        line: 1,
        label: 'Callback joins the task queue',
      };
      const { container } = render(<RuntimePanels current={current} step={5} />);
      const activePanels = container.querySelectorAll('.active-panel');
      expect(activePanels.length).toBeGreaterThan(0);
    });
  });

  describe('Layout and Structure', () => {
    it('should have runtime-column container', () => {
      const { container } = render(<RuntimePanels step={0} />);
      expect(container.querySelector('.runtime-column')).toBeInTheDocument();
    });

    it('should have runtime-grid for panels', () => {
      const { container } = render(<RuntimePanels step={0} />);
      expect(container.querySelector('.runtime-grid')).toBeInTheDocument();
    });

    it('should have queues-grid for queues', () => {
      const { container } = render(<RuntimePanels step={0} />);
      expect(container.querySelector('.queues-grid')).toBeInTheDocument();
    });

    it('should render all four panels', () => {
      const { container } = render(<RuntimePanels step={0} />);
      const panels = container.querySelectorAll('.panel');
      expect(panels.length).toBe(4);
    });
  });

  describe('Step Progression', () => {
    it('should correctly handle step -1 (initial state)', () => {
      render(<RuntimePanels step={-1} />);
      expect(screen.getAllByText('STACK EMPTY')).toBeTruthy();
      expect(screen.getAllByText('QUEUE EMPTY')).toBeTruthy();
    });

    it('should correctly handle step 0', () => {
      const current: LoopPhase = {
        phase: 'stack',
        line: 0,
        label: 'Synchronous code runs',
      };
      render(<RuntimePanels current={current} step={0} />);
      expect(screen.getByText('anonymous()')).toBeInTheDocument();
    });

    it('should correctly handle step transitions', () => {
      const { rerender } = render(<RuntimePanels step={1} />);
      
      // Step 2 - microtask queue should have item
      rerender(<RuntimePanels step={2} />);
      expect(screen.getByText(/Promise.then\(\)/)).toBeInTheDocument();
      
      // Step 5 - task queue should have item
      rerender(<RuntimePanels step={5} />);
      expect(screen.getByText('setTimeout callback')).toBeInTheDocument();
    });
  });
});
