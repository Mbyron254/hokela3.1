import { CONFIG } from 'src/config-global';

import { AgentsAnalyticsView } from 'src/sections/agents/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AgentsAnalyticsView />;
}
