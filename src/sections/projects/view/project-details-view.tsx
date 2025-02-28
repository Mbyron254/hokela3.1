'use client';

import { useState, useEffect } from 'react';

import { Box, Tab, Tabs, Paper, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { PROJECT } from 'src/lib/mutations/project.mutation';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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

  const [projectId, setProjectId] = useState<string>('');

  const { action: getProject, data: project } = GQLMutation({
    mutation: PROJECT,
    resolver: 'project',
    toastmsg: false,
  });

  const loadProject = () => {
    if (id) {
      getProject({ variables: { input: { id } } });
    }
  };
  // const { product } = await getProduct(id);
  useEffect(
    () => loadProject(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  console.log('project', project);

  useEffect(() => {
    if (project) {
      setProjectId(project.id);
    }
  }, [project]);

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
      <Paper
        variant="outlined"
        sx={{ p: 2.5, typography: 'body2', borderRadius: 1.5, height: '85vh' }}
      >
        {currentTab === 'overview' && (
          <>
            <Typography variant="h6" gutterBottom>
              {project?.name}
            </Typography>
            Overview Content
          </>
        )}
        {currentTab === 'campaigns' && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CampaignListView projectId={projectId} />
          </Box>
        )}
      </Paper>
    </DashboardContent>
  );
}
