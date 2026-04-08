import { useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { createAppTheme } from '../theme';
import { ThemeMode } from '../types';

export function useTheme() {
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeModeRaw = useAppStore((s) => s.setThemeMode);

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeRaw(mode);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [setThemeModeRaw],
  );

  return { theme, themeMode, setThemeMode };
}
