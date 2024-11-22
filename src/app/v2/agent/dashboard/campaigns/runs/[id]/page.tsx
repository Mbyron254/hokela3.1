
import { CampaignDetailsView } from 'src/sections/campaigns/details/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Campaign Details | Dashboard - Hokela 3.1` };

export default function Page({ params: { id } }: any ) {
  return <CampaignDetailsView  title="Campaign Details" campaignId={id} />;
}
