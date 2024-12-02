import { CONFIG } from 'src/config-global';

import { ApplicationsGridView } from 'src/sections/applications';

// ----------------------------------------------------------------------

export const metadata = { title: `Job Applications | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ApplicationsGridView />;
}
