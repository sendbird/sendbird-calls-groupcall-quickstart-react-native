import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SendbirdCalls } from '@sendbird/calls-react-native';
import {
  DialogProvider,
  LightUIKitTheme,
  Palette,
  ToastProvider,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';

import Header, { HeaderLeftTypes } from './src/components/Header';
import { AuthProvider, useAuthContext } from './src/contexts/AuthContext';
import { CALL_PERMISSIONS, usePermissions } from './src/hooks/usePermissions';
import { navigationRef } from './src/libs/StaticNavigation';
import GroupCallHomeTab from './src/navigations/GroupCallHomeTab';
import { GroupRoutes } from './src/navigations/routes';
import GroupCallAppInfoScreen from './src/screens/GroupCallAppInfoScreen';
import GroupCallEnterRoomScreen from './src/screens/GroupCallEnterRoomScreen';
import GroupCallParticipantsScreen from './src/screens/GroupCallParticipantsScreen';
import GroupCallRoomInfoScreen from './src/screens/GroupCallRoomInfoScreen';
import GroupCallRoomScreen from './src/screens/GroupCallRoomScreen';
import GroupCallSettingsScreen from './src/screens/GroupCallSettingsScreen';
import GroupCallSignInScreen from './src/screens/GroupCallSignInScreen';

// SendbirdCalls.Logger.setLogLevel('debug');
SendbirdCalls.initialize('SAMPLE_APP_ID');

const Stack = createNativeStackNavigator();

const App = () => {
  usePermissions(CALL_PERMISSIONS);

  return (
    <StyleProviders>
      <AuthProvider>
        <NavigationContainer
          ref={navigationRef}
          theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Palette.background50 } }}
        >
          <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </StyleProviders>
  );
};

const Navigation = () => {
  const { currentUser } = useAuthContext();
  return (
    <Stack.Navigator>
      {!currentUser ? (
        <Stack.Screen name={GroupRoutes.SIGN_IN} component={GroupCallSignInScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name={GroupRoutes.HOME_TAB} component={GroupCallHomeTab} options={{ headerShown: false }} />
          <Stack.Screen
            name={GroupRoutes.ENTER_ROOM}
            component={GroupCallEnterRoomScreen}
            options={{ header: () => <Header title="Enter room" headerLeftType={HeaderLeftTypes.CANCEL} /> }}
          />
          <Stack.Screen name={GroupRoutes.ROOM} component={GroupCallRoomScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name={GroupRoutes.ROOM_INFO}
            component={GroupCallRoomInfoScreen}
            options={{ header: () => <Header title="Room information" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.PARTICIPANTS}
            component={GroupCallParticipantsScreen}
            options={{ header: () => <Header title="Participants" headerLeftType={HeaderLeftTypes.CANCEL} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.SETTINGS}
            component={GroupCallSettingsScreen}
            options={{ header: () => <Header title="Settings" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.APP_INFO}
            component={GroupCallAppInfoScreen}
            options={{
              header: () => <Header title="Application information" headerLeftType={HeaderLeftTypes.BACK} />,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const StyleProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <UIKitThemeProvider theme={LightUIKitTheme}>
        <DialogProvider>
          <ToastProvider>{children}</ToastProvider>
        </DialogProvider>
      </UIKitThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
