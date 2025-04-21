'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export default function JobsDashboardPage() {
  // const { data: session } = GQLQuery({
  //   query: Q_SESSION_SELF,
  //   queryAction: 'sessionSelf',
  // });

  // const {
  //   action: getApplications,
  //   loading: loadingApplications,
  //   data: applicationsData,
  // } = GQLMutation({
  //   mutation: M_CAMPAIGN_RUN_APPLICATIONS,
  //   resolver: 'm_campaignRunApplications',
  //   toastmsg: false,
  // });

  // const {
  //   action: getOffers,
  //   loading: loadingOffers,
  //   data: offersData,
  // } = GQLMutation({
  //   mutation: M_CAMPAIGN_RUN_OFFERS,
  //   resolver: 'm_campaignRunOffers',
  //   toastmsg: false,
  // });

  // useEffect(() => {
  //   if (session?.user?.role?.clientTier1?.id) {
  //     getApplications({
  //       variables: {
  //         input: { clientTier1Id: session.user.role.clientTier1.id },
  //       },
  //     });
  //     getOffers({
  //       variables: {
  //         input: { clientTier1Id: session.user.role.clientTier1.id },
  //       },
  //     });
  //   }
  // }, [session, getApplications, getOffers]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Jobs Dashboard"
        links={[
          { name: 'Dashboard', href: paths.v2.marketing.root },
          { name: 'Jobs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
    </DashboardContent>
  );
} 