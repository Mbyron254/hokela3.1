import { CONFIG } from 'src/config-global';

import { ProjectDetailsView } from 'src/sections/projects/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Project details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  return <ProjectDetailsView id={id} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };
