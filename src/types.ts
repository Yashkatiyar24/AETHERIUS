export type TransactionType = 'income' | 'expense';
export type ThemeMode = 'dark' | 'light';

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  note: string;
  type: TransactionType;
  createdAt: string;
}

export interface Profile {
  displayName: string;
  email: string;
  currency: string;
  joinedAt: string;
}

export interface AppState {
  transactions: Transaction[];
  profile: Profile;
  themeMode: ThemeMode;
  hasEnteredApp: boolean;
}
