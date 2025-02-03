// src/app/RootServerLayout.tsx
import { primary } from 'src/theme/core/palette';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

// export const metadata = {
//   icons: [
//     {
//       rel: 'icon',
//       url: `src/assets/favicon.ico`,
//     },
//   ],
// };
export const metadata = {
  title: 'Hokela Interactive',
  description:
    'Manage your business transaction and document ans human resource all under a single app',
  keywords: 'sales,merchandising,document-management,resource-tracking',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootServerLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>{/* Metadata and viewport can be set here if needed */}</head>
      <body>{children}</body>
    </html>
  );
}
