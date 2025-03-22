'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';

import { GQLMutation } from 'src/lib/client';
import { ICampaignUpdate, ICampaignCreate } from 'src/lib/interface/campaign.interface';
import {
  M_CAMPAIGNS_ACTIVE,
  M_CAMPAIGNS_RECYCLED,
  M_CAMPAIGN,
  CAMPAIGN_CREATE,
  CAMPAIGN_UPDATE,
  CAMPAIGN_RECYCLE,
  CAMPAIGN_RESTORE,
} from 'src/lib/mutations/campaign.mutation';
import { DataGridCustom } from 'src/sections/data-grid-view/data-grid-custom';

export const CampaignListView: FC<{ projectId: string }> = ({ projectId }) => {
  const {
    action: getCampaignsActive,
    data: campaignsActive,
    loading: loadingCampaignsActive,
  } = GQLMutation({
    mutation: M_CAMPAIGNS_ACTIVE,
    resolver: 'm_campaigns',
    toastmsg: false,
  });
  const {
    action: getCampaignsRecycled,
    data: campaignsRecycled,
    loading: loadingCampaignsRecycled,
  } = GQLMutation({
    mutation: M_CAMPAIGNS_RECYCLED,
    resolver: 'm_campaignsRecycled',
    toastmsg: false,
  });
  const {
    action: getCampaign,
    loading: loadingCampaign,
    data: campaign,
  } = GQLMutation({
    mutation: M_CAMPAIGN,
    resolver: 'm_campaign',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: CAMPAIGN_CREATE,
    resolver: 'campaignCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: CAMPAIGN_UPDATE,
    resolver: 'campaignUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: CAMPAIGN_RECYCLE,
    resolver: 'campaignRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: CAMPAIGN_RESTORE,
    resolver: 'campaignRestore',
    toastmsg: true,
  });

  const _inputUpdate: ICampaignUpdate = {
    id: undefined,
    name: undefined,
    jobDescription: undefined,
    jobQualification: undefined,
  };
  const [inputCreate, setInputCreate] = useState<ICampaignCreate>({
    name: undefined,
    jobDescription: undefined,
    jobQualification: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const [tableData, setTableData] = useState<any[]>([]);

  const loadCampaignsActive = (page?: number, pageSize?: number) => {
    if (projectId) {
      getCampaignsActive({ variables: { input: { projectId, page, pageSize } } });
    }
  };
  const loadCampaignsRecycled = (page?: number, pageSize?: number) => {
    if (projectId) {
      getCampaignsRecycled({ variables: { input: { projectId, page, pageSize } } });
    }
  };
  const loadCampaign = (id: string) => {
    getCampaign({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (projectId) {
      create({ variables: { input: { ...inputCreate, projectId } } });
    }
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
  };
  const handleRecycle = () => {
    if (selectedActive.length) {
      recycle({ variables: { input: { ids: selectedActive } } });
    }
  };
  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  // useEffect(() => {
  //   if (campaignsActive && campaignsRecycled) {
  //     const activeCampaigns = transformCampaignData(campaignsActive.rows);
  //     const recycledCampaigns = transformRecycledCampaignData(campaignsRecycled.rows);
  //     setTableData([...activeCampaigns, ...recycledCampaigns]);
  //   }
  // }, [campaignsActive, campaignsRecycled]);

  const dialog = useBoolean();

  const handleDialogClose = () => {
    dialog.onFalse();
  };

  return (
    <Card sx={{ p: 5 }}>
      <CustomBreadcrumbs
        heading="Campaigns"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Projects', href: '/projects' },
          { name: 'Campaigns' },
        ]}
        action={
          <Button
            onClick={() => dialog.onTrue()}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add New Campaign
          </Button>
        }
      />
      <Tabs value={0} aria-label="campaign tabs">
        <Tab label="Active" />
        <Tab label="Recycled" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        <DataGridCustom
          data={tableData ?? []}
        />
      </Box>

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

      {loadingCampaign && <p>Loading...</p>}
    </Card>
  );
};

// Helper functions to transform campaign data
const transformCampaignData = (campaigns: Array<any>) =>
  campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    jobDescription: campaign.jobDescription,
    jobQualification: campaign.jobQualification,
    status: 'active',
  }));

const transformRecycledCampaignData = (campaigns: Array<any>) =>
  campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    jobDescription: campaign.jobDescription,
    jobQualification: campaign.jobQualification,
    status: 'recycled',
  }));
