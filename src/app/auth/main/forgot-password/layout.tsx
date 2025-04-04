import { AuthSplitLayout } from 'src/layouts/auth-split';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>{children}</AuthSplitLayout>
    </AuthGuard>
  );
}
