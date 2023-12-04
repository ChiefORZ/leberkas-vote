/* eslint-disable import/no-extraneous-dependencies */
import { createContext } from 'react';
import { vi } from 'vitest';

const InteractionContext = createContext({
  displayLoginOverlay: false,
  handleAllowedToInteract: vi.fn().mockReturnValue(new Promise((resolve) => resolve(true))),
  hasInteracted: false,
  setHasInteracted: vi.fn(),
});

const useInteractionContext = () => ({
  displayLoginOverlay: false,
  handleAllowedToInteract: vi.fn().mockReturnValue(new Promise((resolve) => resolve(true))),
  hasInteracted: false,
  setHasInteracted: vi.fn(),
});

export { InteractionContext, useInteractionContext };
