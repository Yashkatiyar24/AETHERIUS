import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '../../theme';
import { Transaction } from '../../types';
import { formatShortDate, safeCurrency } from '../../utils/format';
import { GlassCard, PressableScale } from '../';

interface Props {
  transaction: Transaction;
  theme: AppTheme;
  currency: string;
  onDelete: () => void;
}

export function TransactionRow({ transaction, theme, currency, onDelete }: Props) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.secondary : theme.colors.primary;

  return (
    <GlassCard theme={theme} accent={transaction.categoryColor} style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: `${transaction.categoryColor}18`,
              borderColor: `${transaction.categoryColor}55`,
            },
          ]}
        >
          <MaterialCommunityIcons name={transaction.categoryIcon as any} size={20} color={transaction.categoryColor} />
        </View>

        <View style={styles.content}>
          <View style={styles.topLine}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {transaction.note?.trim() || transaction.categoryLabel}
            </Text>
            <Text style={[styles.amount, { color: amountColor }]}> 
              {isIncome ? '+' : '-'}
              {safeCurrency(transaction.amount, currency)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: theme.colors.muted }]}>
              {transaction.categoryLabel}
            </Text>
            <Text style={[styles.dot, { color: theme.colors.dim }]}>•</Text>
            <Text style={[styles.meta, { color: theme.colors.muted }]}>
              {formatShortDate(transaction.date)}
            </Text>
          </View>
        </View>

        <PressableScale onPress={onDelete} hitSlop={12} style={styles.deleteButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.colors.error} />
        </PressableScale>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  meta: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    fontSize: 10,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 110, 132, 0.08)',
  },
});
