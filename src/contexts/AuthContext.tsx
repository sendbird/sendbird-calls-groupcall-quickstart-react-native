import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

import type { User } from '@sendbird/calls-react-native';

import type { ChildrenProps } from '../types/props';

const AuthContext = createContext<{ currentUser?: User; setCurrentUser: Dispatch<SetStateAction<User | undefined>> }>({
  setCurrentUser: (x) => x,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>();

  return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
};
