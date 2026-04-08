import { ThemeMode } from './types';

export interface AppTheme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceAlt: string;
    input: string;
    card: string;
    tabBar: string;
    text: string;
    muted: string;
    dim: string;
    outline: string;
    primary: string;
    secondary: string;
    tertiary: string;
    error: string;
    success: string;
    shadow: string;
  };
}

const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    background: '#050608',
    surface: '#111216',
    surfaceElevated: '#17181d',
    surfaceAlt: '#1f2027',
    input: '#0c0d11',
    card: '#17181d',
    tabBar: 'rgba(10, 11, 15, 0.92)',
    text: '#f8f8fb',
    muted: '#a7adbb',
    dim: '#6f7684',
    outline: '#2a2d36',
    primary: '#b89fff',
    secondary: '#00e3fd',
    tertiary: '#ffe792',
    error: '#ff6e84',
    success: '#50e3a4',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
};

const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceElevated: '#eef2f8',
    surfaceAlt: '#e6ebf3',
    input: '#ffffff',
    card: '#ffffff',
    tabBar: 'rgba(255, 255, 255, 0.96)',
    text: '#101624',
    muted: '#526075',
    dim: '#788293',
    outline: '#d7dde8',
    primary: '#7d5cff',
    secondary: '#0fb6d2',
    tertiary: '#d6b84c',
    error: '#d94c63',
    success: '#1f9d73',
    shadow: 'rgba(15, 23, 42, 0.12)',
  },
};

export function createAppTheme(mode: ThemeMode): AppTheme {
  return mode === 'light' ? lightTheme : darkTheme;
}
