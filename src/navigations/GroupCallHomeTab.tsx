import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import Header from '../components/Header';
import SBIcon from '../components/SBIcon';
import UserInfoHeader from '../components/UserInfoHeader';
import GroupCallDialScreen from '../screens/GroupCallDialScreen';
import GroupCallSettingsScreen from '../screens/GroupCallSettingsScreen';
import Palette from '../styles/palette';
import { GroupRoutes } from './routes';

const Tab = createBottomTabNavigator();

const GroupCallHomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name={GroupRoutes.DIAL}
        component={GroupCallDialScreen}
        options={{
          header: UserInfoHeader,
          tabBarIcon: ({ focused }) => {
            return (
              <SBIcon
                icon={focused ? 'RoomsFilled' : 'Rooms'}
                color={focused ? Palette.background600 : Palette.background300}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={GroupRoutes.SETTING_STACK}
        component={GroupCallSettingsScreen}
        options={{
          header: () => <Header title="Settings" />,
          tabBarIcon: ({ focused }) => {
            return (
              <SBIcon
                icon={focused ? 'SettingsFilled' : 'Settings'}
                color={focused ? Palette.background600 : Palette.background300}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default GroupCallHomeTab;
