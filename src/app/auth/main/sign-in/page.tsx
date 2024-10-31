import { CONFIG } from 'src/config-global';

import { JwtSignInView } from 'src/auth/view/main';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignInView />;
}
