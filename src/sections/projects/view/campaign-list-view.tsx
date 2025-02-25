'use client';

import { Button } from '@mui/material';
import { useCallback } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

export function CampaignListView({ id }: { id: string }) {
  const isEdit = useBoolean();

  const dialog = useBoolean();

  const handleNewRow = useCallback(
    () => {
      isEdit.onFalse();
      dialog.onTrue();
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.v2.marketing.root },
            { name: 'Projects', href: paths.v2.marketing.projects.list },
            { name: 'Campaigns' },
          ]}
          action={
            <Button
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Campaign
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>
    </>
  );
}
