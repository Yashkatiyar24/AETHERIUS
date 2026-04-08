import { Transaction, TransactionType } from '../types';
import { getCategories } from './categories';

export function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );
}

export function sortNewestFirst(transactions: Transaction[]) {
  return [...transactions].sort((left, right) => {
    const leftDate = new Date(left.createdAt).getTime();
    const rightDate = new Date(right.createdAt).getTime();
    return rightDate - leftDate;
  });
}

export function filterTransactions(transactions: Transaction[], type: TransactionType | 'all') {
  if (type === 'all') {
    return transactions;
  }

  return transactions.filter((transaction) => transaction.type === type);
}

export function searchTransactions(transactions: Transaction[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return transactions;
  }

  return transactions.filter((transaction) => {
    const fields = [
      transaction.note,
      transaction.categoryLabel,
      transaction.amount.toString(),
      transaction.type,
    ].join(' ').toLowerCase();
    return fields.includes(normalized);
  });
}

export function groupTotalsByCategory(transactions: Transaction[]) {
  const map = new Map<string, { total: number; label: string; color: string; icon: string }>();

  for (const transaction of transactions) {
    const existing = map.get(transaction.categoryId);
    if (existing) {
      existing.total += transaction.amount;
      continue;
    }
    map.set(transaction.categoryId, {
      total: transaction.amount,
      label: transaction.categoryLabel,
      color: transaction.categoryColor,
      icon: transaction.categoryIcon,
    });
  }

  return [...map.values()].sort((left, right) => right.total - left.total);
}

export function getDefaultCategoryId(type: TransactionType) {
  return getCategories(type)[0]?.id ?? '';
}
