import { useCallback } from 'react';
import { Alert } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { formatShortDate } from '../utils/format';

export function useExportCSV() {
  const transactions = useAppStore((s) => s.transactions);
  const currency = useAppStore((s) => s.profile.currency);

  const exportCSV = useCallback(async () => {
    if (transactions.length === 0) {
      Alert.alert('No data', 'Add some transactions before exporting.');
      return;
    }

    const header = 'Date,Type,Category,Note,Amount,Currency\n';
    const rows = transactions
      .map((t) => {
        const date = formatShortDate(t.date);
        const note = `"${(t.note || '').replace(/"/g, '""')}"`;
        return `${date},${t.type},${t.categoryLabel},${note},${t.amount},${currency}`;
      })
      .join('\n');

    const csv = header + rows;

    try {
      const file = new File(Paths.cache, 'transactions_export.csv');
      file.write(csv);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Transactions',
          UTI: 'public.comma-separated-values-text',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Exported', 'CSV file saved successfully.');
      }
    } catch {
      Alert.alert('Export failed', 'Could not export your transactions. Please try again.');
    }
  }, [transactions, currency]);

  return { exportCSV, hasData: transactions.length > 0 };
}
