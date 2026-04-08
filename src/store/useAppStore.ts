import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppState, Profile, ThemeMode, Transaction, TransactionType } from '../types';
import { getCategoryById } from '../utils/categories';

interface AppStore extends AppState {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addTransaction: (input: {
    amount: number;
    type: TransactionType;
    categoryId: string;
    note: string;
    date: Date;
  }) => void;
  deleteTransaction: (id: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  enterApp: (payload?: Partial<Profile>) => void;
  resetData: () => void;
}

const INITIAL_PROFILE: Profile = {
  displayName: '',
  email: '',
  currency: 'USD',
  joinedAt: new Date().toISOString(),
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: [],
      profile: INITIAL_PROFILE,
      themeMode: 'dark' as ThemeMode,
      hasEnteredApp: false,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      addTransaction: ({ amount, type, categoryId, note, date }) => {
        const category = getCategoryById(type, categoryId);
        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          amount,
          categoryId: category.id,
          categoryLabel: category.label,
          categoryIcon: category.icon,
          categoryColor: category.color,
          date: date.toISOString(),
          note: note.trim(),
          type,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateProfile: (patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
            currency: patch.currency
              ? patch.currency.toUpperCase().slice(0, 3)
              : state.profile.currency,
          },
        })),

      setThemeMode: (mode) => set({ themeMode: mode }),

      enterApp: (payload) =>
        set((state) => ({
          hasEnteredApp: true,
          profile: {
            ...state.profile,
            ...payload,
            currency: payload?.currency
              ? payload.currency.toUpperCase().slice(0, 3)
              : state.profile.currency,
          },
        })),

      resetData: () =>
        set({
          transactions: [],
          profile: { ...INITIAL_PROFILE, joinedAt: new Date().toISOString() },
          themeMode: 'dark',
          hasEnteredApp: false,
        }),
    }),
    {
      name: 'expense-tracker-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        profile: state.profile,
        themeMode: state.themeMode,
        hasEnteredApp: state.hasEnteredApp,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
