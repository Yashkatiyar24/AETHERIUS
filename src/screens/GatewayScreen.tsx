import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks';
import { RootStackParamList } from '../navigation/types';
import { getInitials } from '../utils/format';
import { GlassCard, PressableScale } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'Gateway'>;

export function GatewayScreen({}: Props) {
  const { theme } = useTheme();
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const enterApp = useAppStore((s) => s.enterApp);

  const [mode, setMode] = useState<'access' | 'onboard'>('access');
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [currency, setCurrency] = useState(profile.currency || 'USD');
  const [error, setError] = useState('');

  const title = useMemo(() => (mode === 'access' ? 'Access' : 'Onboard'), [mode]);

  const submit = () => {
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();
    const trimmedCurrency = currency.trim().toUpperCase().slice(0, 3) || 'USD';

    if (!trimmedName) {
      setError('Display name is required.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError('');
    updateProfile({ displayName: trimmedName, email: trimmedEmail, currency: trimmedCurrency });
    enterApp({ displayName: trimmedName, email: trimmedEmail, currency: trimmedCurrency });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const useSavedProfile = () => {
    if (!profile.displayName.trim()) {
      setError('Add a display name first.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setError('');
    enterApp();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientTop, { backgroundColor: `${theme.colors.primary}18` }]} />
      <View style={[styles.ambientBottom, { backgroundColor: `${theme.colors.secondary}10` }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandBlock}>
            <Text style={[styles.brand, { color: theme.colors.text }]} accessibilityRole="header">AETHERIUS</Text>
            <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Initiate sequence</Text>
          </View>

          <View>
            <GlassCard theme={theme} style={styles.card} accent={theme.colors.primary}>
              <View style={styles.segmentRow}>
                <PressableScale
                  onPress={() => setMode('access')}
                  style={[styles.segment, { backgroundColor: mode === 'access' ? theme.colors.surfaceAlt : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Access mode"
                  accessibilityState={{ selected: mode === 'access' }}
                >
                  <Text style={[styles.segmentText, { color: mode === 'access' ? theme.colors.text : theme.colors.muted }]}>Access</Text>
                </PressableScale>
                <View style={[styles.segmentDivider, { backgroundColor: theme.colors.outline }]} />
                <PressableScale
                  onPress={() => setMode('onboard')}
                  style={[styles.segment, { backgroundColor: mode === 'onboard' ? theme.colors.surfaceAlt : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Onboard mode"
                  accessibilityState={{ selected: mode === 'onboard' }}
                >
                  <Text style={[styles.segmentText, { color: mode === 'onboard' ? theme.colors.text : theme.colors.muted }]}>Onboard</Text>
                </PressableScale>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.label, { color: theme.colors.primary }]}>Display Name</Text>
                <View style={[styles.fieldShell, { backgroundColor: theme.colors.input, borderColor: error && !displayName.trim() ? theme.colors.error : theme.colors.outline }]}>
                  <TextInput
                    value={displayName}
                    onChangeText={(v) => { setDisplayName(v); setError(''); }}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.dim}
                    style={[styles.input, { color: theme.colors.text }]}
                    accessibilityLabel="Display name"
                  />
                </View>
              </View>

              {mode === 'onboard' ? (
                <>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.label, { color: theme.colors.primary }]}>Email</Text>
                    <View style={[styles.fieldShell, { backgroundColor: theme.colors.input, borderColor: theme.colors.outline }]}>
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.colors.dim}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { color: theme.colors.text }]}
                        accessibilityLabel="Email address"
                      />
                    </View>
                  </View>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.label, { color: theme.colors.primary }]}>Currency</Text>
                    <View style={[styles.fieldShell, { backgroundColor: theme.colors.input, borderColor: theme.colors.outline }]}>
                      <TextInput
                        value={currency}
                        onChangeText={setCurrency}
                        placeholder="USD"
                        placeholderTextColor={theme.colors.dim}
                        autoCapitalize="characters"
                        maxLength={3}
                        style={[styles.input, { color: theme.colors.text }]}
                        accessibilityLabel="Currency code"
                      />
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.helperBox}>
                  <MaterialCommunityIcons name="shield-check" size={18} color={theme.colors.secondary} />
                  <Text style={[styles.helperText, { color: theme.colors.muted }]}>
                    Use the saved local profile or set up a new wallet identity.
                  </Text>
                </View>
              )}

              {error ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text> : null}

              <PressableScale onPress={submit} style={styles.primaryWrap} accessibilityRole="button" accessibilityLabel={title === 'Access' ? 'Enter system' : 'Save and enter'}>
                <View style={styles.primaryButton}>
                  <Text style={styles.primaryText}>{title === 'Access' ? 'Enter system' : 'Save and enter'}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={theme.isDark ? '#050608' : '#ffffff'} />
                </View>
              </PressableScale>

              <PressableScale onPress={useSavedProfile} style={styles.secondaryWrap} accessibilityRole="button" accessibilityLabel="Use biometric link">
                <View style={[styles.secondaryButton, { backgroundColor: theme.colors.surfaceElevated }]}>
                  <MaterialCommunityIcons name="fingerprint" size={18} color={theme.colors.secondary} />
                  <Text style={[styles.secondaryText, { color: theme.colors.text }]}>Biometric Link</Text>
                </View>
              </PressableScale>

              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: theme.colors.muted }]}>Privacy Protocol</Text>
                <Text style={[styles.footerText, { color: theme.colors.muted }]}>Network Status: Nominal</Text>
              </View>
            </GlassCard>
          </View>

          <View style={styles.savedRow}>
            <View style={[styles.savedAvatar, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
              <Text style={[styles.savedAvatarText, { color: theme.colors.text }]}>{getInitials(profile.displayName)}</Text>
            </View>
            <View style={styles.savedCopy}>
              <Text style={[styles.savedTitle, { color: theme.colors.text }]}>
                {profile.displayName?.trim() ? profile.displayName : 'Local Ledger'}
              </Text>
              <Text style={[styles.savedSubtitle, { color: theme.colors.muted }]}>Your data stays on this device.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  ambientTop: { position: 'absolute', width: 320, height: 320, borderRadius: 320, top: -120, left: -100, opacity: 0.25 },
  ambientBottom: { position: 'absolute', width: 260, height: 260, borderRadius: 260, bottom: -80, right: -90, opacity: 0.2 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 40, gap: 24 },
  brandBlock: { alignItems: 'center', gap: 4, marginBottom: 4 },
  brand: { fontSize: 46, fontWeight: '900', letterSpacing: -2 },
  subtitle: { fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: '700' },
  card: { padding: 18 },
  segmentRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 999, padding: 4, marginBottom: 28, alignItems: 'center', overflow: 'hidden' },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 999 },
  segmentDivider: { width: 1, height: 22, opacity: 0.7 },
  segmentText: { fontSize: 13, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  fieldBlock: { marginBottom: 18 },
  label: { marginBottom: 8, fontSize: 11, letterSpacing: 2, fontWeight: '800', textTransform: 'uppercase' },
  fieldShell: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, minHeight: 54, justifyContent: 'center' },
  input: { fontSize: 15, fontWeight: '600', paddingVertical: 0 },
  helperBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  helperText: { flex: 1, fontSize: 13, lineHeight: 18 },
  errorText: { fontSize: 12, fontWeight: '700', marginBottom: 12 },
  primaryWrap: { marginTop: 4 },
  primaryButton: { minHeight: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#b89fff', flexDirection: 'row', gap: 10 },
  primaryText: { color: '#050608', fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  secondaryWrap: { marginTop: 14, alignSelf: 'center' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  secondaryText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  footerRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  footerText: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 14, alignSelf: 'center' },
  savedAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  savedAvatarText: { fontSize: 18, fontWeight: '900' },
  savedCopy: { gap: 2 },
  savedTitle: { fontSize: 15, fontWeight: '800' },
  savedSubtitle: { fontSize: 12 },
});
