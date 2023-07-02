'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useUserContext } from '@/providers/UserProvider';

interface IInteractionContextProviderProps {
  children: React.ReactNode;
}

interface IInteractionContext {
  displayLoginOverlay: boolean;
  hasInteracted: boolean;
  setHasInteracted: React.Dispatch<React.SetStateAction<boolean>>;
  handleAllowedToInteract: () => Promise<boolean>;
}

const InteractionContext = createContext<IInteractionContext | null>(null);

const InteractionContextProvider = ({
  children,
}: IInteractionContextProviderProps) => {
  const { user } = useUserContext();
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleAllowedToInteract = useCallback(async () => {
    if (!hasInteracted && (!user || !user.id)) {
      setHasInteracted(true);
      return false;
    }
    setHasInteracted(true);
    return true;
  }, [hasInteracted, user]);

  const displayLoginOverlay = useMemo(
    () => hasInteracted && (!user || !user.id),
    [hasInteracted, user]
  );

  const interactionContextValue = useMemo(
    () => ({
      displayLoginOverlay,
      hasInteracted,
      setHasInteracted,
      handleAllowedToInteract,
    }),
    [displayLoginOverlay, handleAllowedToInteract, hasInteracted]
  );
  return (
    <InteractionContext.Provider value={interactionContextValue}>
      {children}
    </InteractionContext.Provider>
  );
};

const useInteractionContext = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error(
      'useInteractionContext must be used within a InteractionContextProvider'
    );
  }
  return context;
};

export {
  InteractionContext,
  InteractionContextProvider,
  useInteractionContext,
};
