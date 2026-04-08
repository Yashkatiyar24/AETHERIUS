import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnalytics, useTheme } from '../hooks';
import { useAppStore } from '../store/useAppStore';
import { safeCurrency } from '../utils/format';
import { GlassCard } from '../components';

export function AnalyticsScreen() {
  const { theme } = useTheme();
  const currency = useAppStore((s) => s.profile.currency);
  const insets = useSafeAreaInsets();
  const {
    balance, expenseTotal, incomeTotal, maxValue,
    expenseByCategory, incomeByCategory,
  } = useAnalytics();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientOne, { backgroundColor: `${theme.colors.primary}16` }]} />
      <View style={[styles.ambientTwo, { backgroundColor: `${theme.colors.secondary}10` }]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topArea}>
          <Text style={[styles.kicker, { color: theme.colors.secondary }]}>Portfolio resonance</Text>
          <Text
            style={[styles.total, { color: theme.colors.text }]}
            accessible
            accessibilityLabel={`Total balance: ${safeCurrency(balance, currency)}`}
          >
            {safeCurrency(balance, currency)}
          </Text>
        </View>

        <View style={styles.ringWrap}>
          <View style={[styles.outerRing, { borderColor: `${theme.colors.primary}55`, shadowColor: theme.colors.primary }]} />
          <View style={[styles.middleRing, { borderColor: `${theme.colors.secondary}55`, shadowColor: theme.colors.secondary }]} />
          <View style={[styles.core, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
            <Text style={[styles.coreLabel, { color: theme.colors.muted }]}>Net delta</Text>
            <Text style={[styles.coreValue, { color: balance >= 0 ? theme.colors.secondary : theme.colors.primary }]}>
              {balance >= 0 ? '+' : ''}
              {safeCurrency(balance, currency)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <GlassCard theme={theme} accent={theme.colors.secondary} style={styles.summaryCard}>
            <MaterialCommunityIcons name="arrow-down-right" size={18} color={theme.colors.secondary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Income</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]} accessibilityLabel={`Income: ${safeCurrency(incomeTotal, currency)}`}>
              {safeCurrency(incomeTotal, currency)}
            </Text>
          </GlassCard>
          <GlassCard theme={theme} accent={theme.colors.primary} style={styles.summaryCard}>
            <MaterialCommunityIcons name="arrow-up-right" size={18} color={theme.colors.primary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]} accessibilityLabel={`Expenses: ${safeCurrency(expenseTotal, currency)}`}>
              {safeCurrency(expenseTotal, currency)}
            </Text>
          </GlassCard>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.chartCard} accent={theme.colors.tertiary}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Income vs expense</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>A simple local chart of your current totals</Text>
              </View>
              <Text style={[styles.percentage, { color: theme.colors.tertiary }]}>
                {incomeTotal + expenseTotal === 0 ? '0%' : `${Math.round((expenseTotal / Math.max(incomeTotal + expenseTotal, 1)) * 100)}%`}
              </Text>
            </View>

            <View style={styles.barGroup}>
              <View style={styles.barRow}>
                <Text style={[styles.barLabel, { color: theme.colors.muted }]}>Income</Text>
                <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(incomeTotal / maxValue) * 100}%`, backgroundColor: theme.colors.secondary },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.barRow}>
                <Text style={[styles.barLabel, { color: theme.colors.muted }]}>Expenses</Text>
                <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(expenseTotal / maxValue) * 100}%`, backgroundColor: theme.colors.primary },
                    ]}
                  />
                </View>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={styles.breakdownHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Category breakdown</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>Spent and earned by category</Text>
        </View>

        <View style={styles.breakdownGrid}>
          <GlassCard theme={theme} style={styles.breakdownCard} accent={theme.colors.primary}>
            <Text style={[styles.breakdownTitle, { color: theme.colors.text }]}>Expenses</Text>
            {expenseByCategory.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No expense data yet.</Text>
            ) : (
              expenseByCategory.map((item) => (
                <View key={item.label} style={styles.row} accessible accessibilityLabel={`${item.label}: ${safeCurrency(item.total, currency)}`}>
                  <Text style={[styles.rowLabel, { color: theme.colors.muted }]}>{item.label}</Text>
                  <View style={[styles.rowTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
                    <View style={[styles.rowFill, { width: `${(item.total / Math.max(expenseTotal, 1)) * 100}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.rowValue, { color: theme.colors.text }]}>{safeCurrency(item.total, currency)}</Text>
                </View>
              ))
            )}
          </GlassCard>

          <GlassCard theme={theme} style={styles.breakdownCard} accent={theme.colors.secondary}>
            <Text style={[styles.breakdownTitle, { color: theme.colors.text }]}>Income</Text>
            {incomeByCategory.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No income data yet.</Text>
            ) : (
              incomeByCategory.map((item) => (
                <View key={item.label} style={styles.row} accessible accessibilityLabel={`${item.label}: ${safeCurrency(item.total, currency)}`}>
                  <Text style={[styles.rowLabel, { color: theme.colors.muted }]}>{item.label}</Text>
                  <View style={[styles.rowTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
                    <View style={[styles.rowFill, { width: `${(item.total / Math.max(incomeTotal, 1)) * 100}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.rowValue, { color: theme.colors.text }]}>{safeCurrency(item.total, currency)}</Text>
                </View>
              ))
            )}
          </GlassCard>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.footerCard} accent={theme.colors.tertiary}>
            <View style={styles.footerTop}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color={theme.colors.tertiary} />
              <Text style={[styles.footerTitle, { color: theme.colors.text }]}>All data is local</Text>
            </View>
            <Text style={[styles.footerText, { color: theme.colors.muted }]}>
              Analytics refresh instantly when you add, edit, or delete transactions.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  ambientOne: { position: 'absolute', top: -90, left: -70, width: 260, height: 260, borderRadius: 260, opacity: 0.22 },
  ambientTwo: { position: 'absolute', bottom: 100, right: -80, width: 240, height: 240, borderRadius: 240, opacity: 0.16 },
  content: { paddingHorizontal: 18, paddingBottom: 40, gap: 16 },
  topArea: { alignItems: 'center', gap: 8, marginTop: 4 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 4, textTransform: 'uppercase' },
  total: { fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  ringWrap: { height: 250, alignItems: 'center', justifyContent: 'center' },
  outerRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 12, shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } },
  middleRing: { position: 'absolute', width: 164, height: 164, borderRadius: 82, borderWidth: 12, shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  core: { width: 122, height: 122, borderRadius: 61, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  coreLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  coreValue: { fontSize: 18, fontWeight: '900', textAlign: 'center' },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, padding: 16, gap: 8 },
  summaryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  summaryValue: { fontSize: 18, fontWeight: '900' },
  chartCard: { padding: 18, gap: 18 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  sectionSubtitle: { fontSize: 12, marginTop: 4, lineHeight: 16 },
  percentage: { fontSize: 18, fontWeight: '900' },
  barGroup: { gap: 16 },
  barRow: { gap: 8 },
  barLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  barTrack: { height: 12, borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  breakdownHeader: { marginTop: 4 },
  breakdownGrid: { gap: 12 },
  breakdownCard: { padding: 18, gap: 12 },
  breakdownTitle: { fontSize: 17, fontWeight: '900' },
  emptyText: { fontSize: 13 },
  row: { gap: 6 },
  rowLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  rowTrack: { height: 10, borderRadius: 999, overflow: 'hidden' },
  rowFill: { height: '100%', borderRadius: 999 },
  rowValue: { fontSize: 12, fontWeight: '800', alignSelf: 'flex-end' },
  footerCard: { padding: 18, gap: 10 },
  footerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerTitle: { fontSize: 16, fontWeight: '900' },
  footerText: { fontSize: 13, lineHeight: 18 },
});
