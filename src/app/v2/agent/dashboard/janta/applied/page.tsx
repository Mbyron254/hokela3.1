'use client';

import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/run-application.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

export default function Page() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const {
    action: getApplications,
    loading: loadingApplications,
    data: applications,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_APPLICATIONS,
    resolver: 'm_runApplications',
    toastmsg: false,
  });

  useEffect(() => {
    if (session?.user?.agent?.id) {
      getApplications({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  }, [session,getApplications]);


  const handleView = useCallback(
    (id: string) => {
      // Implement view logic here
    },
    []
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Job Applications"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Agent', href: '/agent' },
          { name: 'Job Applications' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {applications?.rows.map((application: any) => (
          <div
            key={application.id}
            onClick={() => handleView(application.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleView(application.id);
              }
            }}
          >
            <Image
              className="me-3 mt-1 mb-1 rounded-circle"
              src={sourceImage(application.run?.poster?.fileName)}
              loader={() => sourceImage(application.run?.poster?.fileName)}
              alt=""
              width={TABLE_IMAGE_WIDTH}
              height={TABLE_IMAGE_HEIGHT}
            />
            <div className="w-100 overflow-hidden">
              <h6 className="mt-1 mb-1">{application.run?.name}</h6>
              <span className="font-13">{application.run?.code}</span>
              <span>{application.run?.campaign?.project?.clientTier2?.clientTier1?.name}</span>
              <span>{application.created}</span>
              <span className={`badge bg-${application.status === 'Accepted' ? 'success' : 'warning'} p-1`}>
                {application.status}
              </span>
            </div>
          </div>
        ))}
      </Box>
    </DashboardContent>
  );
}