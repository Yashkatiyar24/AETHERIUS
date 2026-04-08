import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface Props extends BottomTabBarProps {
  theme: AppTheme;
  onAddPress: () => void;
}

export function FloatingTabBar({ state, descriptors, navigation, theme, onAddPress }: Props) {
  const insets = useSafeAreaInsets();
  const tabRoutes = state.routes.filter((route) => route.name !== 'Placeholder');

  return (
    <View pointerEvents="box-none" style={[styles.root, { paddingBottom: Math.max(insets.bottom, 10) + 12 }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.colors.tabBar,
            borderColor: theme.colors.outline,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        {tabRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const routeIndex = state.routes.findIndex((candidate) => candidate.key === route.key);
          const isFocused = state.index === routeIndex;
          const iconName =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Analytics'
                ? 'chart-box-outline'
                : 'account-circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <PressableScale key={route.key} onPress={onPress} style={[styles.tabButton, index === 1 && styles.middleTabButton]}>
              <MaterialCommunityIcons
                name={iconName as any}
                size={22}
                color={isFocused ? theme.colors.secondary : theme.colors.muted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? theme.colors.text : theme.colors.muted,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {String(label)}
              </Text>
              {isFocused ? <View style={[styles.activeDot, { backgroundColor: theme.colors.secondary }]} /> : null}
            </PressableScale>
          );
        })}

        <View style={styles.fabSlot} />

        <PressableScale onPress={onAddPress} style={styles.fabWrap}>
          <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.fab}>
            <MaterialCommunityIcons name="plus" size={24} color={theme.isDark ? '#050608' : '#ffffff'} />
          </LinearGradient>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    justifyContent: 'space-between',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  tabButton: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
    flexShrink: 0,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  middleTabButton: {
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
    maxWidth: '100%',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  fabSlot: {
    width: 52,
  },
  fabWrap: {
    position: 'absolute',
    right: 14,
    top: -24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b89fff',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
});
