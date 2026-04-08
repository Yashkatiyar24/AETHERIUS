import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTransactions, useTheme } from '../hooks';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../navigation/types';
import { getCategories, getCategoryById } from '../utils/categories';
import { formatShortDate, mergeDateWithNow, normalizeCurrencyInput, safeCurrency } from '../utils/format';
import { PressableScale, GlassCard } from '../components';
import { CategoryChip } from '../components/transactions';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTransaction'>;

export function AddTransactionScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const currency = useAppStore((s) => s.profile.currency);
  const { add } = useTransactions();
  const insets = useSafeAreaInsets();

  const initialType = route.params?.defaultType ?? 'expense';
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amountText, setAmountText] = useState('');
  const [categoryId, setCategoryId] = useState(getCategoryById(initialType, getCategories(initialType)[0].id).id);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; category?: string; note?: string }>({});

  // Shake animation values using RN's built-in Animated
  const amountShake = useRef(new Animated.Value(0)).current;
  const noteShake = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback((shakeValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(shakeValue, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    setType(initialType);
    const defaultCategory = getCategories(initialType)[0]?.id ?? '';
    setCategoryId(defaultCategory);
  }, [initialType]);

  const categories = useMemo(() => getCategories(type), [type]);

  useEffect(() => {
    if (!categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0]?.id ?? '');
    }
  }, [categories, categoryId]);

  const parsedAmount = Number(normalizeCurrencyInput(amountText));
  const isValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const isValidCategory = Boolean(categoryId);
  const isValidNote = note.trim().length > 0;
  const isValidForm = isValidAmount && isValidCategory && isValidNote;

  const submit = () => {
    const nextErrors: typeof errors = {};

    if (!isValidAmount) {
      nextErrors.amount = 'Amount must be greater than zero.';
      triggerShake(amountShake);
    }

    if (!isValidCategory) {
      nextErrors.category = 'Choose a category.';
    }

    if (!note.trim()) {
      nextErrors.note = 'Add a note to keep the entry useful.';
      triggerShake(noteShake);
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    add({
      amount: parsedAmount,
      type,
      categoryId,
      note,
      date: mergeDateWithNow(date),
    });
    navigation.goBack();
  };

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.ambientOne, { backgroundColor: `${theme.colors.primary}18` }]} />
      <View style={[styles.ambientTwo, { backgroundColor: `${theme.colors.secondary}12` }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.outline }]}>
                <Text style={[styles.avatarText, { color: theme.colors.text }]}>+</Text>
              </View>
              <Text style={[styles.title, { color: theme.colors.text }]} accessibilityRole="header">Add transaction</Text>
            </View>
            <PressableScale onPress={() => navigation.goBack()} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close">
              <MaterialCommunityIcons name="close" size={22} color={theme.colors.muted} />
            </PressableScale>
          </View>

          <Animated.View style={{ transform: [{ translateX: amountShake }] }}>
            <GlassCard
              theme={theme}
              accent={type === 'income' ? theme.colors.secondary : theme.colors.primary}
              style={[styles.amountCard, errors.amount && { borderColor: theme.colors.error, borderWidth: 2 }]}
            >
              <Text style={[styles.amountLabel, { color: theme.colors.primary }]}>Amount</Text>
              <Text style={[styles.amountPreview, { color: theme.colors.text }]}>
                {amountText ? safeCurrency(parsedAmount || 0, currency) : safeCurrency(0, currency)}
              </Text>
              <View style={[styles.amountInputShell, { backgroundColor: theme.colors.input, borderColor: errors.amount ? theme.colors.error : theme.colors.outline }]}>
                <TextInput
                  value={amountText}
                  onChangeText={(value) => {
                    setAmountText(normalizeCurrencyInput(value));
                    setErrors((c) => ({ ...c, amount: undefined }));
                  }}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.dim}
                  style={[styles.amountInput, { color: theme.colors.text }]}
                  accessibilityLabel="Transaction amount"
                />
              </View>
              {errors.amount ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.amount}</Text> : null}
            </GlassCard>
          </Animated.View>

          <View>
            <GlassCard theme={theme} style={styles.segmentCard}>
              <View style={styles.segmentWrap}>
                <PressableScale
                  onPress={() => setType('expense')}
                  style={[styles.segment, { backgroundColor: type === 'expense' ? theme.colors.surfaceAlt : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Select expense type"
                  accessibilityState={{ selected: type === 'expense' }}
                >
                  <MaterialCommunityIcons name="arrow-down-right" size={16} color={type === 'expense' ? theme.colors.secondary : theme.colors.muted} />
                  <Text style={[styles.segmentText, { color: type === 'expense' ? theme.colors.secondary : theme.colors.muted }]}>Expense</Text>
                </PressableScale>
                <PressableScale
                  onPress={() => setType('income')}
                  style={[styles.segment, { backgroundColor: type === 'income' ? theme.colors.surfaceAlt : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Select income type"
                  accessibilityState={{ selected: type === 'income' }}
                >
                  <MaterialCommunityIcons name="arrow-up-right" size={16} color={type === 'income' ? theme.colors.secondary : theme.colors.muted} />
                  <Text style={[styles.segmentText, { color: type === 'income' ? theme.colors.secondary : theme.colors.muted }]}>Income</Text>
                </PressableScale>
              </View>
            </GlassCard>
          </View>

          <View style={styles.sectionRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select category</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>Categorize the transaction correctly</Text>
            </View>
            <Text style={[styles.sectionMeta, { color: theme.colors.secondary }]}>{categories.length} available</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={category.id === categoryId}
                theme={theme}
                onPress={() => {
                  setCategoryId(category.id);
                  setErrors((c) => ({ ...c, category: undefined }));
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
            ))}
          </ScrollView>
          {errors.category ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.category}</Text> : null}

          <View>
            <GlassCard theme={theme} style={styles.detailCard}>
              <PressableScale onPress={() => setShowPicker(true)} style={styles.detailRow} accessibilityRole="button" accessibilityLabel={`Select date, current: ${formatShortDate(date.toISOString())}`}>
                <View style={styles.detailLeft}>
                  <View style={[styles.detailIcon, { backgroundColor: `${theme.colors.secondary}14` }]}>
                    <MaterialCommunityIcons name="calendar-month-outline" size={18} color={theme.colors.secondary} />
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Date</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{formatShortDate(date.toISOString())}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
              </PressableScale>
            </GlassCard>
          </View>

          {showPicker ? (
            <View style={styles.pickerWrap}>
              <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            </View>
          ) : null}

          <Animated.View style={{ transform: [{ translateX: noteShake }] }}>
            <GlassCard theme={theme} style={[styles.noteCard, errors.note && { borderColor: theme.colors.error, borderWidth: 2 }]}>
              <Text style={[styles.noteLabel, { color: theme.colors.primary }]}>Note</Text>
              <TextInput
                value={note}
                onChangeText={(value) => {
                  setNote(value);
                  setErrors((c) => ({ ...c, note: undefined }));
                }}
                placeholder="Add a short note"
                placeholderTextColor={theme.colors.dim}
                multiline
                style={[styles.noteInput, { color: theme.colors.text }]}
                accessibilityLabel="Transaction note"
              />
              {errors.note ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.note}</Text> : null}
            </GlassCard>
          </Animated.View>

          <View>
            <PressableScale onPress={submit} disabled={!isValidForm} style={styles.submitWrap} accessibilityRole="button" accessibilityLabel="Save transaction">
              <View style={[styles.submitButton, { opacity: isValidForm ? 1 : 0.5 }]}>
                <Text style={styles.submitText}>Save transaction</Text>
                <MaterialCommunityIcons name="check" size={20} color="#050608" />
              </View>
            </PressableScale>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  ambientOne: { position: 'absolute', width: 280, height: 280, borderRadius: 280, top: -100, left: -90, opacity: 0.28 },
  ambientTwo: { position: 'absolute', width: 220, height: 220, borderRadius: 220, bottom: 60, right: -70, opacity: 0.2 },
  content: { paddingHorizontal: 18, gap: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '900' },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: -0.8 },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  amountCard: { padding: 18, alignItems: 'center' },
  amountLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase', alignSelf: 'stretch', marginBottom: 10 },
  amountPreview: { fontSize: 46, fontWeight: '900', letterSpacing: -1.8, marginBottom: 14 },
  amountInputShell: { width: '100%', borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, minHeight: 60, justifyContent: 'center' },
  amountInput: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  errorText: { alignSelf: 'stretch', marginTop: 10, fontSize: 12, fontWeight: '700' },
  segmentCard: { padding: 6 },
  segmentWrap: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 999, padding: 4 },
  segment: { flex: 1, minHeight: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  segmentText: { fontSize: 13, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginTop: 8 },
  sectionTitle: { fontSize: 21, fontWeight: '900' },
  sectionSubtitle: { fontSize: 12, marginTop: 4 },
  sectionMeta: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  categoryRow: { gap: 12, paddingVertical: 6 },
  detailCard: { paddingHorizontal: 16, paddingVertical: 6 },
  detailRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  detailIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '800' },
  pickerWrap: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 20 },
  noteCard: { padding: 18 },
  noteLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  noteInput: { minHeight: 100, textAlignVertical: 'top', fontSize: 15, fontWeight: '600' },
  submitWrap: { marginTop: 2 },
  submitButton: { borderRadius: 22, minHeight: 60, backgroundColor: '#b89fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  submitText: { color: '#050608', fontSize: 15, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
});
