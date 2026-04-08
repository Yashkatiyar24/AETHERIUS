import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '../../theme';
import { Category } from '../../types';
import { PressableScale } from '../PressableScale';

interface Props {
  category: Category;
  selected: boolean;
  theme: AppTheme;
  onPress: () => void;
}

export function CategoryChip({ category, selected, theme, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} style={styles.wrap}>
      <View
        style={[
          styles.circle,
          {
            borderColor: selected ? category.color : theme.colors.outline,
            backgroundColor: selected ? `${category.color}22` : theme.colors.surface,
            shadowColor: category.color,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={category.icon as any}
          size={selected ? 22 : 20}
          color={selected ? category.color : theme.colors.muted}
        />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.colors.text : theme.colors.muted,
          },
        ]}
        numberOfLines={1}
      >
        {category.label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
    width: 84,
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    textAlign: 'center',
  },
});
