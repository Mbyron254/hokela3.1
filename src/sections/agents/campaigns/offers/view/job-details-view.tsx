'use client';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
// import {  JOB_PUBLISH_OPTIONS } from 'src/_mock';

import { redirect } from 'next/navigation';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import { formatDate } from 'src/lib/helpers';
import { M_OPEN_JOB } from 'src/lib/mutations/campaign-run.mutation';
import { M_CAMPAIGN_RUN_APPLY } from 'src/lib/mutations/campaign-run-application.mutation';

import { Label } from 'src/components/label';

import { JobDetailsToolbar } from '../job-details-toolbar';
import { JobDetailsContent } from '../job-details-content';
import { JobDetailsCandidates } from '../job-details-candidates';

// ----------------------------------------------------------------------

export function JobDetailsView({ id }: { id: string }) {
  const JOB_DETAILS_TABS = [{ label: 'Job content', value: 'content' }];
  const JOB_PUBLISH_OPTIONS = [
    { value: 'Apply', label: 'Apply' },
    { value: 'Save as Draft', label: 'Save as Draft' },
  ];

  // Move all hooks before any conditional returns
  const tabs = useTabs('content');
  const [deadline, setDeadline] = useState({ date: '', time: '' });
  const [publish, setPublish] = useState('');

  const { action: getJob, data: job } = GQLMutation({
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

  const loadJob = useCallback(() => {
    getJob({ variables: { input: { id } } });
  }, [getJob, id]);

  const handleApply = useCallback(() => {
    apply({ variables: { input: { campaignRunId: id } } });
  }, [apply, id]);

  const handleChangePublish = useCallback(() => {
    console.log('handleChangePublish', id);
    handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleApply]);

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadJob]);

  useEffect(() => {
    if (job) {
      setDeadline({
        date: formatDate(job.closeAdvertOn).split(',')[0],
        time: formatDate(job.closeAdvertOn).split(',')[1],
      });
      setPublish(job.publish);
    }
  }, [job]);

  useEffect(() => {
    if (applied) redirect(`/agent/job-advertisements`);
  }, [applied]);

  if (!id) {
    return null;
  }

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
              <Label variant="filled">{job?.candidates?.length ?? 0}</Label>
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
        editLink={paths.v2.agent.campaigns.offers.details(id)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
        loading={applying}
      />
      {renderTabs}

      {tabs.value === 'content' && (
        <>
          <JobDetailsContent job={job} />
          <Box sx={{ mt: 3 }}>
            <Button
              size="large"
              variant="contained"
              onClick={handleApply}
              disabled={applying}
              sx={{ width: '100%' }}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </Button>
          </Box>
        </>
      )}

      {tabs.value === 'candidates' && <JobDetailsCandidates candidates={job?.candidates ?? []} />}
    </DashboardContent>
  );
}
