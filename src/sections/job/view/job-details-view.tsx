'use client';

import { redirect } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Image from 'next/image';
import { sourceImage } from 'src/lib/server';
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
import { JobDetailsCandidates } from '../job-details-candidates';

// ----------------------------------------------------------------------

type Props = {
  params: {
    id: string;
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
    if (applied) redirect(`/v2/agent/dashboard/janta/applied`);
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
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <Image
                  className="card-img-top"
                  src={sourceImage(run?.poster?.fileName)}
                  loader={() => sourceImage(run?.poster?.fileName)}
                  alt=""
                  width={200}
                  height={200}
                />
                <div className="card-body">
                  <div className="text-start">
                    <p className="text-muted mb-2 font-16">
                      <strong>
                        <i className="mdi mdi-tag text-muted me-1"/>
                      </strong>
                      <span className="ms-2 ">{run?.name}</span>
                    </p>
                    <p className="text-muted mb-2 font-14">
                      <strong>
                        <i className="mdi mdi-google-my-business text-muted me-1"/>
                      </strong>
                      <span className="ms-2 ">{run?.campaign?.project?.clientTier2?.clientTier1?.name}</span>
                    </p>
                    <p className="text-muted mb-0 font-14">
                      <strong>
                        <i className="mdi mdi-calendar-remove-outline text-muted me-1"/>
                      </strong>
                      <span className="text-warning ms-2">
                        {deadline.date}
                        <small>{deadline.time}</small>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
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
            </div>

            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-uppercase">Description</h5>
                  <hr />
                  <div
                    className="mb-1"
                    style={{ textAlign: 'justify' }}
                    dangerouslySetInnerHTML={{
                      __html: run?.campaign?.jobDescription,
                    }}
                  />
                  <h5 className="text-uppercase mt-3">Qualifications</h5>
                  <hr />
                  <div
                    className="mb-0"
                    style={{ textAlign: 'justify' }}
                    dangerouslySetInnerHTML={{
                      __html: run?.campaign?.jobQualification,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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
