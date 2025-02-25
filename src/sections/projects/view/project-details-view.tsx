'use client';

import type { IOrderItem } from 'src/types/project';

import { useEffect, useState } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PROJECT } from 'src/lib/mutations/project.mutation';
import { GQLMutation } from 'src/lib/client';
import { Iconify } from 'src/components/iconify';
import { Tab, Tabs } from '@mui/material';
import { Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { CampaignListView } from './campaign-list-view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'overview', icon: <Iconify icon="solar:phone-bold" width={24} />, label: 'Overview' },
  {
    value: 'campaigns',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
    label: 'Campaigns',
  },
];

type Props = {
  id: string;
};

export function ProjectDetailsView({ id }: Props) {
  const [currentTab, setCurrentTab] = useState('overview');

  const { action: getProject, data: project } = GQLMutation({
    mutation: PROJECT,
    resolver: 'project',
    toastmsg: false,
  });

  const loadProject = () => {
    if (id) getProject({ variables: { input: { id } } });
  };
  // const { product } = await getProduct(id);
  useEffect(() => loadProject(), []);

  console.log('project', project);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Project Details"
        links={[
          { name: 'Dashboard', href: paths.v2.marketing.root },
          { name: 'Project', href: paths.v2.marketing.products.overview },
          { name: 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Tabs value={currentTab} onChange={handleTabChange}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      <Paper variant="outlined" sx={{ p: 2.5, typography: 'body2', borderRadius: 1.5 }}>
        {currentTab === 'overview' && (
          <>
            <Typography variant="h6" gutterBottom>
              {project?.name}
            </Typography>
            Overview Content
          </>
        )}
        {currentTab === 'campaigns' && <CampaignListView id={id} />}
      </Paper>
    </DashboardContent>
  );
}
