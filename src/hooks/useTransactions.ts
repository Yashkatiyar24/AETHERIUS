import { useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { TransactionType } from '../types';
import {
  calculateTotals,
  filterTransactions,
  groupTotalsByCategory,
  searchTransactions,
  sortNewestFirst,
} from '../utils/calculations';

export function useTransactions() {
  const transactions = useAppStore((s) => s.transactions);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const balance = totals.income - totals.expense;
  const sorted = useMemo(() => sortNewestFirst(transactions), [transactions]);
  const recent = useMemo(() => sorted.slice(0, 5), [sorted]);

  const add = useCallback(
    (input: {
      amount: number;
      type: TransactionType;
      categoryId: string;
      note: string;
      date: Date;
    }) => {
      addTransaction(input);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [addTransaction],
  );

  const confirmDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete transaction', 'Remove this transaction from your ledger?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]);
    },
    [deleteTransaction],
  );

  return {
    transactions,
    totals,
    balance,
    sorted,
    recent,
    add,
    confirmDelete,
    deleteTransaction,
  };
}

export function useFilteredTransactions(filter: 'all' | 'income' | 'expense', query: string) {
  const transactions = useAppStore((s) => s.transactions);

  const filtered = useMemo(() => {
    const withSearch = searchTransactions(sortNewestFirst(transactions), query);
    return filterTransactions(withSearch, filter);
  }, [filter, query, transactions]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const tx of filtered) {
      const key = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(tx.date));
      const list = map.get(key) ?? [];
      list.push(tx);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return { filtered, grouped };
}

export function useAnalytics() {
  const transactions = useAppStore((s) => s.transactions);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const balance = totals.income - totals.expense;

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions],
  );
  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'income'),
    [transactions],
  );

  const expenseByCategory = useMemo(() => groupTotalsByCategory(expenseTransactions), [expenseTransactions]);
  const incomeByCategory = useMemo(() => groupTotalsByCategory(incomeTransactions), [incomeTransactions]);

  return {
    totals,
    balance,
    expenseTotal: totals.expense,
    incomeTotal: totals.income,
    maxValue: Math.max(totals.income, totals.expense, 1),
    expenseByCategory,
    incomeByCategory,
  };
}
