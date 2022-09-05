import React, { useState } from 'react';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import SettingsView from '../components/SettingsView';
import { useAuthContext } from '../contexts/AuthContext';
import { useLayoutEffectAsync } from '../hooks/useEffectAsync';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import AuthManager from '../libs/AuthManager';
import { GroupRoutes } from '../navigations/routes';
import { AppLogger } from '../utils/logger';

const GroupCallSettingsScreen = () => {
  const {
    navigation: { navigate },
    route: { params },
  } = useGroupNavigation<GroupRoutes.SETTINGS>();
  const { currentUser, setCurrentUser } = useAuthContext();

  const [room, setRoom] = useState<Room | null>(null);
  useLayoutEffectAsync(async () => {
    if (params?.roomId) {
      try {
        setRoom(await SendbirdCalls.getCachedRoomById(params?.roomId));
      } catch (e) {
        AppLogger.info('[GroupCallSettingsScreen::ERROR] getCachedRoomById - ', e);
      }
    }
  }, []);

  const deauthenticate = async () => {
    await Promise.all([AuthManager.deAuthenticate(), SendbirdCalls.deauthenticate()]);
    setCurrentUser(undefined);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <SettingsView
      userId={currentUser.userId}
      nickname={currentUser.nickname}
      profileUrl={currentUser.profileUrl}
      onPressApplicationInformation={() => navigate(GroupRoutes.APP_INFO)}
      onPressSignOut={async () => {
        room?.exit();
        await deauthenticate();
      }}
    />
  );
};

export default GroupCallSettingsScreen;
