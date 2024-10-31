import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from 'src/auth/view/main';

// ----------------------------------------------------------------------

export const metadata = { title: `Reset password | Amplify - ${CONFIG.appName}` };

export default function Page() {
  return <ResetPasswordView />;
}
