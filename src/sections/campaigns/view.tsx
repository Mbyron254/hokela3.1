'use client';

import { useEffect, useState } from 'react';
import { IGeoLocation } from 'src/lib/interface/general.interface';
import { M_JANTAS } from 'src/lib/mutations/run-offer.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { LOCATION_PING_INTERVAL_MS } from 'src/lib/constant';
import { Box, Typography, Card, CardContent, Grid, Alert, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { RunAgent } from 'src/components/run/RunAgent';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from "src/layouts/dashboard";
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { getGeoLocation } from 'src/lib/helpers';

export function CampaignsView({ title = 'Blank' }: { title?: string }) {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const {
    action: getOffers,
    loading: loadingOffers,
    data: offers,
  } = GQLMutation({
    mutation: M_JANTAS,
    resolver: 'jantas',
    toastmsg: false,
  });

  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();

  useEffect(() => {
    if (session?.user?.agent?.id) {
      getOffers({ variables: { input: { agentId: session.user.agent.id } } });
    }
  }, [session?.user?.agent?.id]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContent title={title}>
      <Box>
        <Typography variant="h1">Campaigns</Typography>
      </Box>

      {(!offers?.rows?.length || !geoLocation?.lat || !geoLocation?.lng) && (
        <Alert severity="info">
          <List>
            <ListItem>
              <ListItemIcon>
                <IconButton>
                  <Iconify
                    icon={geoLocation?.lat && geoLocation?.lng ? 'mdi:check-decagram' : 'mdi:cancel'}
                    color={geoLocation?.lat && geoLocation?.lng ? 'success' : 'error'}
                  />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={
                  geoLocation?.lat && geoLocation?.lng
                    ? 'Confirmed your location.'
                    : 'Confirming your location. Please wait...'
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <IconButton>
                  <Iconify
                    icon={offers?.rows?.length ? 'mdi:check-decagram' : 'mdi:cancel'}
                    color={offers?.rows?.length ? 'success' : 'error'}
                  />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={
                  loadingOffers
                    ? 'Loading my campaigns...'
                    : !offers?.rows?.length
                    ? 'You have not been offered any campaigns to participate in. Apply with Janta or check back later'
                    : 'Loaded your campaigns.'
                }
              />
            </ListItem>
          </List>
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item md={8}>
          {offers?.rows?.length > 0 && geoLocation?.lat && geoLocation?.lng && (
            <>
              {offers?.rows?.map((offer: any, index: number) => (
                <RunAgent
                  key={`janta-${index}`}
                  offer={offer}
                  lat={geoLocation.lat!}
                  lng={geoLocation.lng!}
                />
              ))}
            </>
          )}
        </Grid>

        <Grid item md={4}>
          <Card>
            <CardContent>
              {/* Additional content can be added here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
