'use client';

import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

// eslint-disable-next-line import/no-extraneous-dependencies
import { SnackbarProvider } from 'notistack';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { primary } from 'src/theme/core/palette';
import { LocalizationProvider } from 'src/locales';
import { schemeConfig } from 'src/theme/scheme-config';
import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/main';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

// export const metadata = {
//   icons: [
//     {
//       rel: 'icon',
//       url: `${CONFIG.assetsDir}/favicon.ico`,
//     },
//   ],
// };

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={schemeConfig.defaultMode}
          modeStorageKey={schemeConfig.modeStorageKey}
        />
        <LocalizationProvider>
          <AuthProvider>
            <SettingsProvider settings={defaultSettings}>
              <ThemeProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer />
                  <SnackbarProvider />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
