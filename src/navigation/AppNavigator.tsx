import React, { useMemo } from 'react';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks';
import { FloatingTabBar, SkeletonLoader } from '../components';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { GatewayScreen } from '../screens/GatewayScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootStackParamList, TabParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AppTabs() {
  const { theme } = useTheme();
  const rootNavigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <FloatingTabBar
            {...props}
            theme={theme}
            onAddPress={() => rootNavigation.navigate('AddTransaction', { defaultType: 'expense' })}
          />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </View>
  );
}

function buildNavTheme(isDark: boolean, colors: any): NavigationTheme {
  return {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surfaceElevated,
      text: colors.text,
      border: colors.outline,
      notification: colors.secondary,
    },
  };
}

export function AppNavigator() {
  const hasEnteredApp = useAppStore((s) => s.hasEnteredApp);
  const hydrated = useAppStore((s) => s.hydrated);
  const { theme } = useTheme();

  const navTheme = useMemo(() => buildNavTheme(theme.isDark, theme.colors), [theme]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <SkeletonLoader theme={theme} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <RootStack.Navigator
        key={hasEnteredApp ? 'app' : 'gateway'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!hasEnteredApp ? (
          <RootStack.Screen name="Gateway" component={GatewayScreen} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={AppTabs} />
            <RootStack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <RootStack.Screen name="History" component={HistoryScreen} options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
