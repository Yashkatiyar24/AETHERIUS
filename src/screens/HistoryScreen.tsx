import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { useFilteredTransactions, useTransactions, useTheme } from '../hooks';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../navigation/types';
import { groupTotalsByCategory } from '../utils/calculations';
import { GlassCard, PressableScale } from '../components';
import { TransactionRow } from '../components/transactions';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const transactions = useAppStore((s) => s.transactions);
  const currency = useAppStore((s) => s.profile.currency);
  const { confirmDelete } = useTransactions();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [query, setQuery] = useState('');

  const { filtered, grouped } = useFilteredTransactions(filter, query);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientOne, { backgroundColor: `${theme.colors.primary}16` }]} />
      <View style={[styles.ambientTwo, { backgroundColor: `${theme.colors.secondary}10` }]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <MaterialCommunityIcons name="history" size={22} color={theme.colors.secondary} />
            <Text style={[styles.title, { color: theme.colors.text }]} accessibilityRole="header">Transaction history</Text>
          </View>
          <PressableScale onPress={() => navigation.goBack()} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Go back">
            <MaterialCommunityIcons name="close" size={20} color={theme.colors.muted} />
          </PressableScale>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.searchCard} accent={theme.colors.secondary}>
            <View style={styles.searchRow}>
              <Text style={[styles.searchPrompt, { color: theme.colors.secondary }]}>{' > '}</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search transactions"
                placeholderTextColor={theme.colors.dim}
                style={[styles.searchInput, { color: theme.colors.text }]}
                accessibilityLabel="Search transactions"
              />
              <View style={[styles.cursor, { backgroundColor: theme.colors.secondary }]} />
            </View>
          </GlassCard>
        </View>

        <View>
          <View style={[styles.filterShell, { backgroundColor: theme.colors.surface }]}>
            {(['all', 'income', 'expense'] as const).map((value) => {
              const active = filter === value;
              const label = value === 'all' ? 'All' : value === 'income' ? 'Income' : 'Expense';
              return (
                <PressableScale
                  key={value}
                  onPress={() => setFilter(value)}
                  style={[styles.filterButton, { backgroundColor: active ? `${theme.colors.primary}22` : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${label}`}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.filterText, { color: active ? theme.colors.primary : theme.colors.muted }]}>{label}</Text>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryGrid}>
          {[
            { label: 'Transactions', value: transactions.length.toString(), color: theme.colors.secondary },
            { label: 'Categories', value: groupTotalsByCategory(transactions).length.toString(), color: theme.colors.primary },
          ].map((item) => (
            <GlassCard key={item.label} theme={theme} style={styles.summaryCard} accent={item.color}>
              <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>{item.label}</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]} accessibilityLabel={`${item.label}: ${item.value}`}>{item.value}</Text>
            </GlassCard>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View>
            <GlassCard theme={theme} style={styles.emptyState}>
              <MaterialCommunityIcons name="archive-search-outline" size={28} color={theme.colors.secondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No matching transactions</Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                Try a different filter or add a transaction to populate the history view.
              </Text>
            </GlassCard>
          </View>
        ) : (
          grouped.map(([section, items], sectionIndex) => (
            <View key={section} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: theme.colors.tertiary }]}>{section}</Text>
                <View style={[styles.groupRule, { backgroundColor: `${theme.colors.tertiary}22` }]} />
              </View>
              {items.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  theme={theme}
                  currency={currency}
                  onDelete={() => confirmDelete(transaction.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  ambientOne: { position: 'absolute', top: -80, right: -90, width: 240, height: 240, borderRadius: 240, opacity: 0.22 },
  ambientTwo: { position: 'absolute', bottom: 110, left: -100, width: 240, height: 240, borderRadius: 240, opacity: 0.18 },
  content: { paddingHorizontal: 18, gap: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -1, flex: 1 },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  searchCard: { paddingHorizontal: 16, paddingVertical: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchPrompt: { fontSize: 16, fontWeight: '900' },
  searchInput: { flex: 1, minHeight: 48, fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
  cursor: { width: 3, height: 18, borderRadius: 999 },
  filterShell: { flexDirection: 'row', padding: 5, borderRadius: 999, gap: 4 },
  filterButton: { flex: 1, minHeight: 42, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, padding: 16 },
  summaryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  summaryValue: { fontSize: 22, fontWeight: '900' },
  emptyState: { padding: 24, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptyText: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  group: { gap: 10 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  groupTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  groupRule: { flex: 1, height: 1, borderRadius: 999 },
});
