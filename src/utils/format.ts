import { Profile, Transaction } from '../types';

export function safeCurrency(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return name?.trim() ? `${prefix}, ${name.trim()}` : prefix;
}

export function getInitials(name?: string) {
  const value = name?.trim() || 'Ledger';
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function makeTransactionLabel(transaction: Transaction) {
  return transaction.note?.trim() || transaction.categoryLabel;
}

export function normalizeCurrencyInput(value: string) {
  return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

export function mergeDateWithNow(date: Date) {
  const now = new Date();
  const merged = new Date(date);
  merged.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return merged;
}

export function formatJoinedAt(profile: Profile) {
  return formatShortDate(profile.joinedAt);
}
