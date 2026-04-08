import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AppTheme } from '../theme';

interface Props {
  theme: AppTheme;
}

function SkeletonBar({ width, height, theme }: { width: number | string; height: number; theme: AppTheme }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius: height / 2,
        backgroundColor: theme.colors.surfaceAlt,
        opacity,
      }}
    />
  );
}

export function SkeletonLoader({ theme }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <SkeletonBar width={40} height={40} theme={theme} />
        <View style={styles.headerText}>
          <SkeletonBar width={100} height={14} theme={theme} />
          <SkeletonBar width={70} height={10} theme={theme} />
        </View>
      </View>
      <View style={styles.greeting}>
        <SkeletonBar width={120} height={10} theme={theme} />
        <SkeletonBar width={220} height={36} theme={theme} />
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceElevated }]}>
        <SkeletonBar width={90} height={10} theme={theme} />
        <SkeletonBar width={160} height={28} theme={theme} />
        <View style={styles.row}>
          <SkeletonBar width={100} height={16} theme={theme} />
          <SkeletonBar width={100} height={16} theme={theme} />
        </View>
      </View>
      <View style={styles.quickRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.quickCard, { backgroundColor: theme.colors.surfaceElevated }]}>
            <SkeletonBar width={20} height={20} theme={theme} />
            <SkeletonBar width={60} height={10} theme={theme} />
          </View>
        ))}
      </View>
      <SkeletonBar width={180} height={20} theme={theme} />
      <View style={[styles.txCard, { backgroundColor: theme.colors.surfaceElevated }]}>
        <SkeletonBar width={48} height={48} theme={theme} />
        <View style={styles.txContent}>
          <SkeletonBar width={140} height={14} theme={theme} />
          <SkeletonBar width={90} height={10} theme={theme} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 60, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerText: { gap: 6 },
  greeting: { gap: 10 },
  card: { borderRadius: 28, padding: 20, gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, borderRadius: 28, padding: 18, alignItems: 'center', gap: 10 },
  txCard: { borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  txContent: { gap: 8, flex: 1 },
});
