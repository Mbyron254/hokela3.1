import { cookies } from 'next/headers';
import { CONFIG } from 'src/config-global';
import { SESSION_COOKIE } from 'src/lib/constant';
import { Q_SESSION } from 'src/lib/queries/session.query';
import { serverGateway } from 'src/lib/server';

import { AgentsAnalyticsView } from 'src/sections/agents/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  console.log(sessionId);
  // const data = await serverGateway(Q_SESSION, { input: { id: sessionId } });
  // console.log(data);
  
  return <AgentsAnalyticsView />;
}
