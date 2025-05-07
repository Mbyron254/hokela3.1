'use client';

import { redirect } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { GQLMutation } from 'src/lib/client';
import { formatDate } from 'src/lib/helpers';
import { DashboardContent } from 'src/layouts/dashboard';
import { JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';
import { M_OPEN_JOB } from 'src/lib/mutations/run.mutation';
import { M_CAMPAIGN_RUN_APPLY } from 'src/lib/mutations/run-application.mutation';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { JobDetailsToolbar } from '../job-details-toolbar';
import { JobDetailsContent } from '../job-details-content';
import { JobDetailsCandidates } from '../job-details-candidates';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
    job: any;
  };
};

export function JobDetailsView({ params }: Props) {
  const tabs = useTabs('content');

  const { action: getJob, data: run } = GQLMutation({
    mutation: M_OPEN_JOB,
    resolver: 'openJob',
    toastmsg: false,
  });
  const {
    action: apply,
    loading: applying,
    data: applied,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_APPLY,
    resolver: 'applyAgencyJob',
    toastmsg: false,
  });

  const [deadline, setDeadline] = useState({ date: '', time: '' });

  const loadJob = useCallback(() => {
    getJob({ variables: { input: { id: params.id } } });
  }, [getJob, params.id]);

  const handleApply = useCallback(() => {
    apply({ variables: { input: { runId: params.id } } });
  }, [apply, params.id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  useEffect(() => {
    if (run) {
      setDeadline({
        date: formatDate(run.closeAdvertOn).split(',')[0],
        time: formatDate(run.closeAdvertOn).split(',')[1],
      });
    }
  }, [run]);

  useEffect(() => {
    if (applied) redirect(`/agent/janta/applied`);
  }, [applied]);

  const [publish, setPublish] = useState(run?.publish);
  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'candidates' ? (
              <Label variant="filled">{run?.candidates.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      <JobDetailsToolbar
        backLink={paths.v2.agent.campaigns.offers.root}
        editLink={paths.v2.agent.campaigns.offers.details(`${run?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === 'content' && (
        <>
          <JobDetailsContent job={run} />
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleApply}
            disabled={applying}
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{
              mt: 3,
              position: 'relative',
              zIndex: 1,
              width: 'auto',
              display: 'flex',
              margin: '24px auto',
            }}
          >
            {applying ? 'Applying...' : 'Apply for this Position'}
          </Button>
        </>
      )}

      {tabs.value === 'candidates' && (
        <>
          <JobDetailsCandidates candidates={run?.candidates ?? []} />
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleApply}
            disabled={applying}
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{
              mt: 3,
              position: 'relative',
              zIndex: 1,
              width: 'auto',
              display: 'flex',
              margin: '24px auto',
            }}
          >
            {applying ? 'Applying...' : 'Apply for this Position'}
          </Button>
        </>
      )}
    </DashboardContent>
  );
}
