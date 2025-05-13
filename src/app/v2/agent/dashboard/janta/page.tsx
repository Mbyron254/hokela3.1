import { CONFIG } from 'src/config-global';

import JobListView from 'src/sections/job/view/job-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Job Applications | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <JobListView />;
}
