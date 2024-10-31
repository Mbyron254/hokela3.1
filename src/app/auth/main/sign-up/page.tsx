import { CONFIG } from 'src/config-global';

import { JwtSignUpView } from 'src/auth/view/main';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignUpView />;
}
