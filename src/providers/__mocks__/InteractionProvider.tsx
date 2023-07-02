import { createContext } from 'react';
import { vi } from 'vitest';

const InteractionContext = createContext({
  displayLoginOverlay: false,
  hasInteracted: false,
  setHasInteracted: vi.fn(),
  handleAllowedToInteract: vi
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(true))),
});

const useInteractionContext = () => ({
  displayLoginOverlay: false,
  hasInteracted: false,
  setHasInteracted: vi.fn(),
  handleAllowedToInteract: vi
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(true))),
});

export { InteractionContext, useInteractionContext };
