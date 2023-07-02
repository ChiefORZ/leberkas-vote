import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { createContext } from 'react';

type TUser = NexusGenFieldTypes['User'];
export const mockedUser: TUser = {
  email: '',
  id: '1',
  name: 'Test User',
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
  role: 'USER',
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
