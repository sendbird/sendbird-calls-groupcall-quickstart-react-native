import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { GroupRouteWithParams, GroupRoutes } from '../navigations/routes';
import { AsParamListBase } from '../types/navigations';

export type GroupParamListBase = AsParamListBase<GroupRouteWithParams>;
export type GroupRouteProp<T extends GroupRoutes> = RouteProp<GroupParamListBase, T>;
export type GroupNativeStackNavigationProp<T extends GroupRoutes> = NativeStackNavigationProp<GroupParamListBase, T>;

export const useGroupNavigation = <T extends GroupRoutes>() => {
  const navigation = useNavigation<GroupNativeStackNavigationProp<T>>();
  const route = useRoute<GroupRouteProp<T>>();

  return { navigation, route };
};
