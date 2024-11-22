// import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // if (CONFIG.auth.skip) {
  //   return <DashboardLayout>{children}</DashboardLayout>;
  // }

  return (
    <GuestGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </GuestGuard>
  );
}
