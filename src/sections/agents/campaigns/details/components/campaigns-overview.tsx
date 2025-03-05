'use client';

import { Grid, Button } from '@mui/material';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';

interface RunDetails {
  name: string;
  agent_name: string;
  campaign?: any; // Adjust the type as needed
}
export function CampaignsOverview({ campaign }: any) {
  console.log(campaign, 'CAMPAIGNS OVERVIEW');
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${campaign?.agent.user.name}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
