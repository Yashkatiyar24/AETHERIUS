import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { useProfile, useTheme, useExportCSV } from '../hooks';
import { formatJoinedAt, getInitials } from '../utils/format';
import { GlassCard, PressableScale } from '../components';

export function ProfileScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { profile, saveProfile, confirmReset } = useProfile();
  const { exportCSV } = useExportCSV();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [currency, setCurrency] = useState(profile.currency);

  const nameToShow = useMemo(
    () => displayName.trim() || profile.displayName || 'Local Ledger',
    [displayName, profile.displayName],
  );

  const handleSave = () => {
    const trimmedName = displayName.trim();
    if (!trimmedName) return;
    saveProfile({
      displayName: trimmedName,
      email: email.trim(),
      currency: currency.trim().toUpperCase().slice(0, 3) || 'USD',
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientOne, { backgroundColor: `${theme.colors.primary}16` }]} />
      <View style={[styles.ambientTwo, { backgroundColor: `${theme.colors.secondary}10` }]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarRing, { borderColor: theme.colors.secondary }]}>
              <View style={[styles.avatarInner, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
                <Text style={[styles.avatarText, { color: theme.colors.text }]}>{getInitials(nameToShow)}</Text>
              </View>
            </View>
            <View>
              <Text style={[styles.name, { color: theme.colors.text }]} accessibilityRole="header">{nameToShow}</Text>
              <View style={styles.statusPill}>
                <MaterialCommunityIcons name="star-circle" size={14} color={theme.colors.tertiary} />
                <Text style={[styles.statusText, { color: theme.colors.tertiary }]}>Local ledger active</Text>
              </View>
            </View>
          </View>
          <MaterialCommunityIcons name="account" size={22} color={theme.colors.muted} />
        </View>

        <View>
          <GlassCard theme={theme} accent={theme.colors.primary} style={styles.infoCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile snapshot</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoField}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Display name</Text>
                <View style={[styles.inputShell, { backgroundColor: theme.colors.input, borderColor: theme.colors.outline }]}>
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Your name"
                    placeholderTextColor={theme.colors.dim}
                    style={[styles.input, { color: theme.colors.text }]}
                    accessibilityLabel="Display name"
                  />
                </View>
              </View>
              <View style={styles.infoField}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Email</Text>
                <View style={[styles.inputShell, { backgroundColor: theme.colors.input, borderColor: theme.colors.outline }]}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={theme.colors.dim}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, { color: theme.colors.text }]}
                    accessibilityLabel="Email address"
                  />
                </View>
              </View>
              <View style={styles.infoField}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Currency</Text>
                <View style={[styles.inputShell, { backgroundColor: theme.colors.input, borderColor: theme.colors.outline }]}>
                  <TextInput
                    value={currency}
                    onChangeText={setCurrency}
                    placeholder="USD"
                    placeholderTextColor={theme.colors.dim}
                    maxLength={3}
                    autoCapitalize="characters"
                    style={[styles.input, { color: theme.colors.text }]}
                    accessibilityLabel="Currency code"
                  />
                </View>
              </View>
              <View style={styles.infoField}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Joined</Text>
                <View style={[styles.readonlyShell, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
                  <Text style={[styles.readonlyText, { color: theme.colors.text }]}>{formatJoinedAt(profile)}</Text>
                </View>
              </View>
            </View>

            <PressableScale onPress={handleSave} style={styles.saveWrap} accessibilityRole="button" accessibilityLabel="Save profile">
              <View style={styles.saveButton}>
                <Text style={styles.saveText}>Save profile</Text>
              </View>
            </PressableScale>
          </GlassCard>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.settingCard} accent={theme.colors.secondary}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextWrap}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Dark mode</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.muted }]}>Switch the full app between dark and light themes.</Text>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                thumbColor={theme.isDark ? theme.colors.secondary : theme.colors.primary}
                trackColor={{ false: theme.colors.outline, true: `${theme.colors.secondary}66` }}
                accessibilityLabel="Toggle dark mode"
              />
            </View>
          </GlassCard>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.settingCard} accent={theme.colors.tertiary}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextWrap}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export CSV</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.muted }]}>Download all transactions as a CSV file for backup or analysis.</Text>
              </View>
              <PressableScale
                onPress={exportCSV}
                style={[styles.actionButton, { backgroundColor: `${theme.colors.tertiary}14` }]}
                accessibilityRole="button"
                accessibilityLabel="Export transactions as CSV"
              >
                <MaterialCommunityIcons name="file-export-outline" size={18} color={theme.colors.tertiary} />
              </PressableScale>
            </View>
          </GlassCard>
        </View>

        <View>
          <GlassCard theme={theme} style={styles.settingCard} accent={theme.colors.primary}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextWrap}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Reset data</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.muted }]}>Clears all transactions and local preferences safely.</Text>
              </View>
              <PressableScale
                onPress={confirmReset}
                style={styles.resetButton}
                accessibilityRole="button"
                accessibilityLabel="Reset all data"
              >
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.colors.error} />
              </PressableScale>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  ambientOne: { position: 'absolute', width: 260, height: 260, borderRadius: 260, top: -90, left: -80, opacity: 0.2 },
  ambientTwo: { position: 'absolute', width: 240, height: 240, borderRadius: 240, bottom: 100, right: -80, opacity: 0.16 },
  content: { paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  avatarRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900' },
  name: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  statusPill: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)' },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  infoCard: { padding: 18, gap: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  infoGrid: { gap: 12 },
  infoField: { gap: 8 },
  infoLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  inputShell: { minHeight: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, justifyContent: 'center' },
  input: { fontSize: 15, fontWeight: '700' },
  readonlyShell: { minHeight: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, justifyContent: 'center' },
  readonlyText: { fontSize: 15, fontWeight: '700' },
  saveWrap: { marginTop: 4 },
  saveButton: { minHeight: 56, borderRadius: 18, backgroundColor: '#b89fff', alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#050608', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  settingCard: { padding: 18 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  settingTextWrap: { flex: 1, gap: 4 },
  settingTitle: { fontSize: 16, fontWeight: '900' },
  settingSubtitle: { fontSize: 12, lineHeight: 17 },
  actionButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  resetButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,110,132,0.08)' },
});
