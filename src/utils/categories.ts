import { Category, TransactionType } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', label: 'Food', icon: 'food', color: '#00e3fd', type: 'expense' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#b89fff', type: 'expense' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping', color: '#ffe792', type: 'expense' },
  { id: 'bills', label: 'Bills', icon: 'file-document-outline', color: '#50e3a4', type: 'expense' },
  { id: 'health', label: 'Health', icon: 'heart-pulse', color: '#ff6e84', type: 'expense' },
  { id: 'home', label: 'Home', icon: 'home', color: '#0fb6d2', type: 'expense' },
  { id: 'travel', label: 'Travel', icon: 'airplane', color: '#7d5cff', type: 'expense' },
  { id: 'education', label: 'Education', icon: 'school', color: '#d6b84c', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', icon: 'movie-open', color: '#ff8f5b', type: 'expense' },
  { id: 'other-expense', label: 'Other', icon: 'dots-horizontal', color: '#8b95a7', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary', icon: 'cash-multiple', color: '#50e3a4', type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'briefcase-account', color: '#0fb6d2', type: 'income' },
  { id: 'business', label: 'Business', icon: 'chart-line', color: '#b89fff', type: 'income' },
  { id: 'gift', label: 'Gift', icon: 'gift', color: '#ffe792', type: 'income' },
  { id: 'investment', label: 'Investment', icon: 'trending-up', color: '#7d5cff', type: 'income' },
  { id: 'other-income', label: 'Other', icon: 'dots-horizontal', color: '#8b95a7', type: 'income' },
];

export function getCategories(type: TransactionType) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategoryById(type: TransactionType, id: string) {
  return getCategories(type).find((category) => category.id === id) ?? getCategories(type)[0];
}
