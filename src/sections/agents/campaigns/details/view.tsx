'use client';

import type { IGeoLocation } from 'src/lib/interface/general.interface';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Dialog,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/theme/styles';
import { GQLMutation } from 'src/lib/client';
import { getGeoLocation } from 'src/lib/helpers';
import { DashboardContent } from 'src/layouts/dashboard';
import { LOCATION_PING_INTERVAL_MS } from 'src/lib/constant';
import { M_CAMPAIGN_RUN_OFFER } from 'src/lib/mutations/campaign-run-offer.mutation';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
// import RHFCamera from 'src/components/hook-form';

type Props = {
  campaignId?: string;
};

export type TUserProfile = {
  photo: string | null;
  __typename: 'TUserProfile';
};

export type TUser = {
  id: string;
  name: string;
  profile: TUserProfile;
  __typename: 'TUser';
};

export type TAgent = {
  user: TUser;
  __typename: 'TAgent';
};

export type TClientTier1 = {
  name: string;
  __typename: 'TClientTier1';
};

export type TClientTier2 = {
  name: string;
  clientTier1: TClientTier1;
  __typename: 'TClientTier2';
};

export type TCampaign = {
  name: string;
  clientTier2: TClientTier2;
  __typename: 'TCampaign';
};

export type TCampaignRun = {
  id: string;
  code: string;
  dateStart: string; // ISO 8601 string
  dateStop: string; // ISO 8601 string
  checkInAt: string; // Time string (e.g., "08:30")
  checkOutAt: string; // Time string (e.g., "17:30")
  project: string | null;
  campaign: TCampaign;
  __typename: 'TCampaignRun';
};

export type TCampaignRunOffer = {
  id: string;
  created: string; // Date string (e.g., "2024 Nov 27, 08:44 AM")
  agent: TAgent;
  campaignRun: TCampaignRun;
  __typename: 'TCampaignRunOffer';
};

// Define the RunDetails type
interface RunDetails {
  name: string;
  agent_name: string;
  campaign: any; // Adjust the type as needed
}

export function CampaignDetailsView({ campaignId }: Props) {
  const [tabValue, setTabValue] = useState('overview');
  const [campaign, setCampaign] = useState<RunDetails>();
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();
  const dialog = useBoolean();

  const router = useRouter();

  // -------------------------------------------------
  const { action: getOffer, data: offer } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFER,
    resolver: 'm_campaignRunOffer',
    toastmsg: false,
  });

  const loadOffer = useCallback(() => {
    if (campaignId) {
      getOffer({ variables: { input: { id: campaignId } } });
    }
  }, [campaignId, getOffer]);

  // -------------------------------------------------

  useEffect(
    () => {
      loadOffer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // console.log('OFFER', offer);
  useEffect(() => {
    if (offer) {
      const runInfo: RunDetails = {
        name: offer?.campaignRun?.name || 'Unknown', // Ensure the name property is included
        agent_name: offer?.agent?.name,
        campaign: offer.campaignRun,
      };
      setCampaign(runInfo);
    }
  }, [offer]);

  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    router.replace(paths.v2.agent.root);
  };
  const renderTitle = (
    <Grid xs={12} display="flex" justifyContent="space-between">
      <Typography variant="h5">
        Checkin to{' '}
        <Box component="span" sx={{ color: 'success.main' }}>
          {offer?.campaignRun?.campaign.name ?? 'Campaign'}
        </Box>
      </Typography>

      <Button
        id="back"
        onClick={handleBack}
        variant="outlined"
        color="error"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
      >
        Back
      </Button>
    </Grid>
  );
  const handleDialogOpen = () => {
    dialog.onTrue();
  };
  const handleDialogClose = () => {
    dialog.onFalse();
  };
  const defaultValues = useMemo(() => ({ checkin: '' }), []);
  const cameraSchema = Yup.object().shape({
    checkin: Yup.string().required('Outlet name is required'),
  });
  const methods = useForm();

  const takePhoto = ({ photo }: any) => {
    console.log(photo, 'PHOTO');
  };

  const renderCheckin = (
    <Grid xs={12} md={5}>
      <Card sx={{ mt: 3, p: 3, position: 'relative', width: '100%', height: '400px' }}>
        {/* <Backdrop
          sx={{
            bgcolor: (t) => t.palette.background.paper,
            position: 'absolute',
            zIndex: (t) => t.zIndex.drawer + 1,
          }}
          open={userLocation.loading}
        >
          {userLocation.loading && <CircularProgress color="inherit" />}
        </Backdrop> */}

        <CardContent component={Stack} justifyContent="center" alignItems="center" rowGap={2}>
          <Typography color="success" sx={{ width: '100%', fontWeight: 'bold' }} variant="body2">
            Location : Nairobi
          </Typography>
          <Label color="primary">
            <span>Accuracy : </span> 60%
            {/* {`${accuracy} %`} */}
          </Label>
          <Button fullWidth id="activity" variant="contained" color="primary" size="large">
            Activity Logs
          </Button>
          <Button
            fullWidth
            id="checkin"
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 1 }}
            onClick={handleDialogOpen}
          >
            Check In
          </Button>
        </CardContent>

        <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>Checkin</DialogTitle>
          <DialogContent>
            <Typography>Agent Photo On Site</Typography>
            {/* <FormProvider {...methods}>
              <RHFCamera
                name="checkin"
                title="CheckIn"
                action={(photo: string) => takePhoto(photo)}
              />
            </FormProvider> */}
          </DialogContent>
        </Dialog>
      </Card>
    </Grid>
  );

  return (
    <DashboardContent>
      <Box
        sx={{
          p: 2,
          width: 1,
          // height: 600,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
        }}
      >
        {renderTitle}
        {renderCheckin}
        {/* <TabContext value={tabValue}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overview" value="overview" />
              <Tab label="Sales" value="sales" />
              <Tab label="Giveaways" value="giveaways" />
              <Tab label="Surveys" value="surveys" />
            </Tabs>
            <TabPanel value="overview">
              <CampaignsOverview campaign={offer} />
            </TabPanel>
            <TabPanel value="sales">
              <Typography>Sales</Typography>
            </TabPanel>
            <TabPanel value="giveaways">
              <Typography>Giveaways</Typography>
            </TabPanel>
            <TabPanel value="surveys">
              <Typography>Surveys</Typography>
            </TabPanel>
          </TabContext> */}
      </Box>
    </DashboardContent>
  );
}
