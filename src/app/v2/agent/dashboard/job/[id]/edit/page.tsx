import { _jobs } from 'src/_mock/_job';
import { CONFIG } from 'src/config-global';

import { JobEditView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Job edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentJob = _jobs.find((job) => job.id === id);

  if (!currentJob) {
    return null;
  }
  const closeAdvertOn = new Date().toISOString();

  return (
    <JobEditView
      job={{
        ...currentJob,
        closeAdvertOn,
        description: '',
        campaign: {
          id: '',
          name: '',
          jobDescription: '',
          jobQualification: '',
          clientTier2: {
            name: '',
            clientTier1: {
              name: '',
            },
          },
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _jobs.map((job) => ({ id: job.id }));
  }
  return [];
}
