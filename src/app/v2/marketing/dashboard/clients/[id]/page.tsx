
import { CONFIG } from 'src/config-global';

import { ClientDetailsView } from 'src/sections/clients/view/client-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Client details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  console.log('id', id);

  return <ClientDetailsView id={id} />;
}
