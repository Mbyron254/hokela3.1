'use client';

import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Card, Typography } from '@mui/material';
import { GQLMutation } from 'src/lib/client';
import {
  RUN_ACTIVITY_ROAD_SHOW,
  RUN_ACTIVITY_SALES,
  RUN_ACTIVITY_SAMPLING,
  RUN_ACTIVITY_STOCK_MAPPING,
  RUN_ACTIVITY_SURVEY,
} from 'src/lib/constant';
import { M_CAMPAIGN_RUN } from 'src/lib/mutations/campaign-run.mutation';
import { RunProfile } from 'src/components/RunProfile';
// import { RunRollCall } from 'src/components/RunRollCall';
// import { RunDashboardSurvey } from 'src/components/run/RunDashboardSurvey';
import { RunDashboardSales } from 'src/components/run/RunDashboardSales';
import { RunSalesStockAllocation } from 'src/components/run/RunSalesStockAllocation';
import { RunSurveyQuestions } from 'src/components/run/RunSurveyQuestions';
// import { RunKPIs } from 'src/components/run/RunKPIs';
// import { RunPayroll } from 'src/components/run/RunPayroll';
// import { RunPayRate } from 'src/components/run/RunPayRate';
// import { RunSampling } from 'src/components/run/RunSampling';
// import { RunSalesGiveawayConfig } from 'src/components/run/RunSalesGiveawayConfig';
// import { RunSalesGiveawayQuestions } from 'src/components/run/RunSalesGiveawayQuestions';
// import { RunSalesQuestions } from 'src/components/run/RunSalesQuestions';
// import { RunSurveyQuestions } from 'src/components/run/RunSurveyQuestions';
// import { RunStockCounterEntry } from 'src/components/run/RunStockCounterEntry';
// import { RunTeam } from 'src/components/run/RunTeam';

export default function Page({ params: { runId } }: any) {
  const { action: getRun, data: run } = GQLMutation({
    mutation: M_CAMPAIGN_RUN,
    resolver: 'm_run',
    toastmsg: false,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [activeSalesSubTab, setActiveSalesSubTab] = useState(0);

  useEffect(() => {
    if (runId) {
      getRun({ variables: { input: { id: runId } } });
    }
  }, [getRun, runId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSalesSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveSalesSubTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Run Details
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Profile" />
        <Tab label="Team" />
        <Tab label="Analytics" />
        <Tab label="Attendance" />
        <Tab label="Payroll" />
        {run?.types?.map((activity: any, i: number) => (
          <Tab key={`run-type-${i}`} label={activity.name || 'No Activity'} />
        ))}
      </Tabs>

      <Card sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            {run && <RunProfile run={run} />}
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            {/* {run && <RunTeam run={run} />} */}
            <p>Team</p>
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <ul className="nav nav-tabs nav-bordered mb-3">
              {run?.types?.map((activity: any, i: number) => (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#run-dashboard-${i}`}
                    data-bs-toggle="tab"
                    aria-expanded={i === 0}
                    className={`nav-link ${i === 0 ? 'active' : ''}`}
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="tab-content">
              {run?.types?.map((activity: any, i: number) => {
                switch (activity.name) {
                  case RUN_ACTIVITY_SALES:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        {run?.id ? <RunDashboardSales runId={run.id} /> : null}
                      </div>
                    );

                  case RUN_ACTIVITY_SAMPLING:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        <h4>Dashboard Sampling</h4>
                      </div>
                    );

                  case RUN_ACTIVITY_SURVEY:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        {/* {run?.id ? <RunDashboardSurvey runId={run.id} /> : null} */}
                        <p>Survey</p>
                      </div>
                    );

                  case RUN_ACTIVITY_ROAD_SHOW:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        <h4>Dashboard Road Show</h4>
                      </div>
                    );

                  case RUN_ACTIVITY_STOCK_MAPPING:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        <h4>Dashboard Stock Mapping</h4>
                      </div>
                    );

                  default:
                    return (
                      <div
                        className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                        id={`run-dashboard-${i}`}
                        key={`run-dash-${i}`}
                      >
                        <h4>Unsupported Run Activity</h4>
                      </div>
                    );
                }
              })}
            </div>
          </Box>
        )}
        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            {/* {run && <RunRollCall run={run} />} */}
            <p>Attendance</p>
          </Box>
        )}
        {activeTab === 4 && (
          <Box sx={{ p: 2 }}>
            <ul className="nav nav-tabs nav-bordered mb-3">
              <li className="nav-item">
                <a href="#payrates" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                  <span className="d-md-block">Pay Rates</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#kpis" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                  <span className="d-md-block">KPIs</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#agent-scores" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                  <span className="d-md-block">Scores & Earnings</span>
                </a>
              </li>
            </ul>

            <div className="tab-content">
              <div className="tab-pane show active" id="payrates">
                {/* {run?.id && <RunPayRate runId={run.id} />} */}
                <p>Pay Rates</p>
              </div>

              <div className="tab-pane" id="kpis">
                {/* {run?.id && <RunKPIs runId={run.id} />} */}
                <p>KPI&apos;s</p>
              </div>

              <div className="tab-pane" id="agent-scores">
                {/* {run?.id && <RunPayroll runId={run.id} />} */}
                <p>Scores & Earnings</p>
              </div>
            </div>
          </Box>
        )}
        {run?.types?.map((activity: any, i: number) => (
          activeTab === i + 5 && (
            <Box sx={{ p: 2 }} key={`activity-content-${i}`}>
              <Typography variant="h6">{activity.name} Content</Typography>
              {activity.name === RUN_ACTIVITY_SALES && (
                <div>
                  <Tabs
                    value={activeSalesSubTab}
                    onChange={handleSalesSubTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="sales sub-tabs"
                  >
                    <Tab label="Questions" />
                    <Tab label="Stock Allocation" />
                    <Tab label="Giveaway Questions" />
                    <Tab label="Giveaway Config" />
                    <Tab label="Stock Counter Entry" />
                  </Tabs>

                  <div>
                    {activeSalesSubTab === 0 && 
                    // <RunSalesQuestions runId={run.id} />
                    <p>Questions</p>
                    }
                    {activeSalesSubTab === 1 && (
                    <RunSalesStockAllocation runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                    // <p>Stock Allocation</p>
                    )}
                    {activeSalesSubTab === 2 && 
                    // <RunSalesGiveawayQuestions runId={run.id} />
                    <p>Giveaway Questions</p>
                    }
                    {activeSalesSubTab === 3 && (
                    // <RunSalesGiveawayConfig runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                    <p>Giveaway Config</p>
                    )}
                    {activeSalesSubTab === 4 && (
                      // <RunStockCounterEntry runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                      <p>Stock Correction.</p>
                    )}
                  </div>
                </div>
              )}
              {activity.name === RUN_ACTIVITY_SAMPLING && (
                // <RunSampling runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                <p>Sampling</p>
              )}
              {activity.name === RUN_ACTIVITY_SURVEY && (
                <RunSurveyQuestions runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                // <p>Survey</p>
              )}
            </Box>
          )
        ))}
      </Card>
    </Box>
  );
}