import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTransactions, useTheme } from '../hooks';
import { useAppStore } from '../store/useAppStore';
import { TabParamList } from '../navigation/types';
import { getGreeting, getInitials, safeCurrency } from '../utils/format';
import { GlassCard, PressableScale } from '../components';
import { TransactionRow } from '../components/transactions';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const profile = useAppStore((s) => s.profile);
  const { totals, balance, recent, confirmDelete } = useTransactions();
  const insets = useSafeAreaInsets();

  const openHistory = () => {
    navigation.getParent()?.navigate('History');
  };

  const openAdd = (type: 'income' | 'expense') => {
    navigation.getParent()?.navigate('AddTransaction', { defaultType: type });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientOne, { backgroundColor: `${theme.colors.primary}14` }]} />
      <View style={[styles.ambientTwo, { backgroundColor: `${theme.colors.secondary}10` }]} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={styles.brandRow}
            accessible
            accessibilityRole="header"
            accessibilityLabel="AETHERIUS, systems online"
          >
            <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
              <Text style={[styles.avatarText, { color: theme.colors.text }]}>{getInitials(profile.displayName)}</Text>
            </View>
            <View>
              <Text style={[styles.appTitle, { color: theme.colors.text }]}>AETHERIUS</Text>
              <Text style={[styles.headerCaption, { color: theme.colors.primary }]}>Systems online</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="bell-outline" size={22} color={theme.colors.muted} accessibilityLabel="Notifications" />
        </View>

        <View style={styles.hero}>
          <Text style={[styles.greetingLabel, { color: theme.colors.secondary }]}>Portfolio resonance</Text>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>{getGreeting(profile.displayName)}</Text>
        </View>

        <View>
          <GlassCard theme={theme} accent={theme.colors.primary} style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View accessible accessibilityLabel={`Total balance: ${safeCurrency(balance, profile.currency)}`}>
                <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>Total Balance</Text>
                <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>
                  {safeCurrency(balance, profile.currency)}
                </Text>
              </View>
              <View style={[styles.balanceOrb, { backgroundColor: `${theme.colors.secondary}15` }]}>
                <MaterialCommunityIcons name="chart-donut" size={22} color={theme.colors.secondary} />
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem} accessible accessibilityLabel={`Income: ${safeCurrency(totals.income, profile.currency)}`}>
                <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Income</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.secondary }]}>
                  {safeCurrency(totals.income, profile.currency)}
                </Text>
              </View>
              <View style={styles.summaryItem} accessible accessibilityLabel={`Expenses: ${safeCurrency(totals.expense, profile.currency)}`}>
                <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Expenses</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                  {safeCurrency(totals.expense, profile.currency)}
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={styles.quickGrid}>
          <PressableScale onPress={() => openAdd('expense')} style={styles.quickAction} accessibilityRole="button" accessibilityLabel="Add expense">
            <GlassCard theme={theme} accent={theme.colors.primary} style={styles.quickInner}>
              <MaterialCommunityIcons name="arrow-down-right" size={18} color={theme.colors.primary} />
              <Text style={[styles.quickText, { color: theme.colors.text }]}>Add Expense</Text>
            </GlassCard>
          </PressableScale>
          <PressableScale onPress={() => openAdd('income')} style={styles.quickAction} accessibilityRole="button" accessibilityLabel="Add income">
            <GlassCard theme={theme} accent={theme.colors.secondary} style={styles.quickInner}>
              <MaterialCommunityIcons name="arrow-up-right" size={18} color={theme.colors.secondary} />
              <Text style={[styles.quickText, { color: theme.colors.text }]}>Add Income</Text>
            </GlassCard>
          </PressableScale>
          <PressableScale onPress={openHistory} style={styles.quickAction} accessibilityRole="button" accessibilityLabel="View history">
            <GlassCard theme={theme} accent={theme.colors.tertiary} style={styles.quickInner}>
              <MaterialCommunityIcons name="history" size={18} color={theme.colors.tertiary} />
              <Text style={[styles.quickText, { color: theme.colors.text }]}>History</Text>
            </GlassCard>
          </PressableScale>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>Latest activity from your local ledger</Text>
          </View>
          <PressableScale onPress={openHistory} style={styles.viewAllButton} accessibilityRole="button" accessibilityLabel="View all transactions">
            <Text style={[styles.viewAllText, { color: theme.colors.secondary }]}>View all</Text>
          </PressableScale>
        </View>

        {recent.length === 0 ? (
          <View>
            <GlassCard theme={theme} style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="wallet-outline" size={28} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No transactions yet</Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                Your wallet looks empty! Tap + to add your first income or expense and the balance will update instantly.
              </Text>
              <PressableScale
                onPress={() => openAdd('expense')}
                style={styles.emptyCta}
                accessibilityRole="button"
                accessibilityLabel="Add your first transaction"
              >
                <View style={[styles.emptyCtaButton, { backgroundColor: `${theme.colors.secondary}18` }]}>
                  <MaterialCommunityIcons name="plus" size={16} color={theme.colors.secondary} />
                  <Text style={[styles.emptyCtaText, { color: theme.colors.secondary }]}>Add transaction</Text>
                </View>
              </PressableScale>
            </GlassCard>
          </View>
        ) : (
          <View>
            {recent.map((transaction) => (
              <View key={transaction.id}>
                <TransactionRow
                  transaction={transaction}
                  theme={theme}
                  currency={profile.currency}
                  onDelete={() => confirmDelete(transaction.id)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  ambientOne: {
    position: 'absolute', top: -90, right: -80,
    width: 220, height: 220, borderRadius: 220, opacity: 0.24,
  },
  ambientTwo: {
    position: 'absolute', bottom: 120, left: -100,
    width: 240, height: 240, borderRadius: 240, opacity: 0.16,
  },
  content: { paddingHorizontal: 18, gap: 18 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '900' },
  appTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  headerCaption: { fontSize: 10, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase' },
  hero: { paddingTop: 8, paddingBottom: 4 },
  greetingLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 },
  greeting: { fontSize: 40, fontWeight: '900', lineHeight: 42, letterSpacing: -1.4 },
  balanceCard: { padding: 20 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 },
  cardLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  balanceAmount: { fontSize: 32, fontWeight: '900', letterSpacing: -1.1 },
  balanceOrb: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 14, marginTop: 22 },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 4 },
  summaryValue: { fontSize: 17, fontWeight: '800' },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1 },
  quickInner: { paddingVertical: 18, paddingHorizontal: 14, alignItems: 'center', gap: 10 },
  quickText: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14, marginTop: 8 },
  sectionTitle: { fontSize: 21, fontWeight: '900' },
  sectionSubtitle: { fontSize: 12, marginTop: 4 },
  viewAllButton: { paddingVertical: 8, paddingHorizontal: 8 },
  viewAllText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  emptyState: { padding: 24, alignItems: 'center', gap: 12 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 227, 253, 0.08)' },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  emptyCta: { marginTop: 4 },
  emptyCtaButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  emptyCtaText: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
});
