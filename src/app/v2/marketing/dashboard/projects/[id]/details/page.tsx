import { CONFIG } from 'src/config-global';
import { CLIENTS } from 'src/_mock/marketing/_clients';

import { ProjectDetailsView } from 'src/sections/projects/view/project-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Client details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentClient = CLIENTS?.find((client) => client.id === id);

  return <ProjectDetailsView />;
}
