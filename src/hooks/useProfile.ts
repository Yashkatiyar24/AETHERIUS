import { useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { Profile } from '../types';

export function useProfile() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const resetData = useAppStore((s) => s.resetData);

  const saveProfile = useCallback(
    (patch: Partial<Profile>) => {
      updateProfile(patch);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [updateProfile],
  );

  const confirmReset = useCallback(() => {
    Alert.alert(
      'Reset data',
      'This clears all transactions, profile settings, and local storage for this app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ],
    );
  }, [resetData]);

  return { profile, saveProfile, confirmReset };
}
