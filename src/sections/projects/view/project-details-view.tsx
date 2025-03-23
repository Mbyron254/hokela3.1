'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { PROJECT } from 'src/lib/mutations/project.mutation';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { M_CAMPAIGNS_ACTIVE, CAMPAIGN_CREATE } from 'src/lib/mutations/campaign.mutation';
import { useBoolean } from 'src/hooks/use-boolean';

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

// Define the table head for campaigns
const CAMPAIGN_TABLE_HEAD = [
  { id: 'name', label: 'Campaign Name' },
  { id: 'status', label: 'Status' },
  { id: 'startDate', label: 'Start Date', width: 120 },
  { id: 'endDate', label: 'End Date', width: 120 },
  { id: '', width: 88 },
];

export function ProjectDetailsView({ id }: Props) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [projectId, setProjectId] = useState<string>('');
  const { action: getProject, data: project } = GQLMutation({
    mutation: PROJECT,
    resolver: 'project',
    toastmsg: false,
  });
  const { action: getCampaignsActive, data: campaignsActive } = GQLMutation({
    mutation: M_CAMPAIGNS_ACTIVE,
    resolver: 'm_campaigns',
    toastmsg: false,
  });

  const dialog = useBoolean();
  const [inputCreate, setInputCreate] = useState({
    name: '',
    jobDescription: '',
    jobQualification: '',
  });

  const { action: create, loading: creating } = GQLMutation({
    mutation: CAMPAIGN_CREATE,
    resolver: 'campaignCreate',
    toastmsg: true,
  });

  const router = useRouter();

  const loadProject = () => {
    if (id) {
      getProject({ variables: { input: { id } } });
    }
  };

  useEffect(() => loadProject(), [id]);

  useEffect(() => {
    if (project) {
      getCampaignsActive({ variables: { input: { projectId: project.id } } });
    }
  }, [project, getCampaignsActive]);

  useEffect(() => {
    if (project) {
      setProjectId(project.id);
    }
  }, [project]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleCreate = () => {
    if (projectId) {
      create({ variables: { input: { ...inputCreate, projectId } } });
    }
  };

  const handleDialogClose = () => {
    dialog.onFalse();
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
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {project?.name}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Start Date:</Typography>
                <Typography variant="body2">{project?.dateStart}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">End Date:</Typography>
                <Typography variant="body2">{project?.dateStop}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Description:</Typography>
                <Typography variant="body2">{project?.description}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Client:</Typography>
                <Typography variant="body2">{project?.clientTier2?.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Manager:</Typography>
                <Typography variant="body2">{project?.manager?.name}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {currentTab === 'campaigns' && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Button
              onClick={() => dialog.onTrue()}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ mb: 2 }}
            >
              New Campaign
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {CAMPAIGN_TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} style={{ width: headCell.width }}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaignsActive?.rows?.map((campaign: any) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.status}</TableCell>
                      <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => router.push(paths.v2.marketing.projects.campaign(campaign.id))}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
      <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>New Campaign</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            name="name"
            margin="dense"
            variant="outlined"
            label="Campaign Name"
            value={inputCreate.name}
            onChange={(e) =>
              setInputCreate({
                ...inputCreate,
                name: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            name="jobDescription"
            margin="dense"
            variant="outlined"
            label="Job Description"
            value={inputCreate.jobDescription}
            onChange={(e) =>
              setInputCreate({
                ...inputCreate,
                jobDescription: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            name="jobQualification"
            margin="dense"
            variant="outlined"
            label="Job Qualification"
            value={inputCreate.jobQualification}
            onChange={(e) =>
              setInputCreate({
                ...inputCreate,
                jobQualification: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={creating}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
