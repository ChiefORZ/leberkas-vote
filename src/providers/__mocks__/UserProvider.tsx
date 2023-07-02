import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { createContext } from 'react';
import { vi } from 'vitest';

type TUser = NexusGenFieldTypes['User'];
export const mockedUser: TUser = {
  id: '1',
  name: 'Test User',
  email: '',
  role: 'USER',
  ratings: [
    {
      itemId: '1',
      userId: '1',
      value: 3,
    },
    {
      itemId: '2',
      userId: '1',
      value: 4,
    },
  ],
};

const UserContext = createContext({
  user: mockedUser,
});

const useUserContext = () => ({
  user: mockedUser,
});

const UserContextProvider = ({ children, user }) => (
  <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
);

export { UserContext, UserContextProvider, useUserContext };
