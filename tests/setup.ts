import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/react';
// biome-ignore lint/performance/noNamespaceImport: reasonable explanation
import * as ResizeObserverModule from 'resize-observer-polyfill';
import { afterEach, vi } from 'vitest';

// biome-ignore lint/suspicious/noExplicitAny: reasonable explanation
(global as any).ResizeObserver = ResizeObserverModule.default;

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
