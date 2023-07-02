'use client';

import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { createContext, useContext } from 'react';

type TUser = NexusGenFieldTypes['User'];

interface IUserContextProviderProps {
  children: React.ReactNode;
  user: TUser;
}

interface IUserContext {
  user: TUser;
}

const UserContext = createContext<IUserContext | null>(null);

const UserContextProvider = ({ children, user }: IUserContextProviderProps) => (
  <UserContext.Provider
    value={{
      user,
    }}
  >
    {children}
  </UserContext.Provider>
);

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export { UserContext, UserContextProvider, useUserContext };
