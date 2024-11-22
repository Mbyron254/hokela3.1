// src/app/RootServerLayout.tsx
import { primary } from 'src/theme/core/palette';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `src/assets/favicon.ico`,
    },
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
