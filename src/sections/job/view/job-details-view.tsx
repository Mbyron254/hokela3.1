'use client';

import type { IJobItem } from 'src/types/job';

import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import { GQLMutation } from 'src/lib/client';
import { formatDate } from 'src/lib/helpers';
import { M_CAMPAIGN_RUN_APPLY } from 'src/lib/mutations/campaign-run-application.mutation';
import { M_OPEN_JOB } from 'src/lib/mutations/campaign-run.mutation';

import { Label } from 'src/components/label';

import { JobDetailsToolbar } from '../job-details-toolbar';
import { JobDetailsContent } from '../job-details-content';
import { JobDetailsCandidates } from '../job-details-candidates';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
  };
};

export function JobDetailsView({ params }: Props) {
  const tabs = useTabs('content');

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

  const [deadline, setDeadline] = useState({ date: '', time: '' });

  const loadJob = () => {
    getJob({ variables: { input: { id: params.id } } });
  };
  const handleApply = () => {
    apply({ variables: { input: { campaignRunId: params.id } } });
  };

  useEffect(() => {
    loadJob();
  }, []);
  useEffect(() => {
    if (job) {
      setDeadline({
        date: formatDate(job.closeAdvertOn).split(',')[0],
        time: formatDate(job.closeAdvertOn).split(',')[1],
      });
    }
  }, [job]);
  useEffect(() => {
    if (applied) redirect(`/agent/job-advertisements`);
  }, [applied]);
  const [publish, setPublish] = useState(job?.publish);
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
              <Label variant="filled">{job?.candidates.length}</Label>
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
        editLink={paths.v2.agent.campaigns.offers.details(`${job?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === 'content' && <JobDetailsContent job={job} />}

      {tabs.value === 'candidates' && <JobDetailsCandidates candidates={job?.candidates ?? []} />}
    </DashboardContent>
  );
}
