import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppTheme } from '../theme';

interface Props {
  theme: AppTheme;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  accent?: string;
}

export function GlassCard({ theme, style, children, accent }: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.outline,
          shadowColor: theme.colors.shadow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[
          accent ? `${accent}22` : 'rgba(184, 159, 255, 0.12)',
          'rgba(0, 0, 0, 0)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.noise} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.26,
    shadowRadius: 24,
    elevation: 4,
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
