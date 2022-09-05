import React, { useReducer } from 'react';
import { Platform, ScrollView } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import SignInForm from '../components/SignInForm';
import { useAuthContext } from '../contexts/AuthContext';
import { useLayoutEffectAsync } from '../hooks/useEffectAsync';
import AuthManager from '../libs/AuthManager';
import Palette from '../styles/palette';
import { AppLogger } from '../utils/logger';

type Input = {
  userId: string;
  accessToken?: string;
};
const GroupCallSignInScreen = () => {
  const { setCurrentUser } = useAuthContext();
  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    userId: __DEV__ ? 'GroupCall_' + Platform.OS : '',
    accessToken: '',
  });

  useLayoutEffectAsync(async () => {
    const credential = await AuthManager.getSavedCredential();
    if (credential) {
      onSignIn(credential);
    }
  }, []);

  const authenticate = async (value: Input) => {
    const user = await SendbirdCalls.authenticate(value);
    await AuthManager.authenticate(value);

    AppLogger.info('sendbird user:', user);
    return user;
  };

  const onSignIn = async (value: Input) => {
    const user = await authenticate(value);
    setCurrentUser(user);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Palette.background50,
      }}
      keyboardShouldPersistTaps={'always'}
    >
      <SignInForm {...state} onChange={setState} onSubmit={onSignIn} />
    </ScrollView>
  );
};

export default GroupCallSignInScreen;
