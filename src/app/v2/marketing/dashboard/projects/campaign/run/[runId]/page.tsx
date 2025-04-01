'use client';

import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Card, Typography, Button } from '@mui/material';
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
import { RunRollCall } from 'src/components/RunRollCall';
import { DashboardSurvey } from 'src/components/DashboardSurvey';
// import { RunSalesGiveawayConfig } from 'src/components/run/RunSalesGiveawayConfig';
// import { RunSalesGiveawayQuestions } from 'src/components/run/RunSalesGiveawayQuestions';
// import { RunSalesQuestions } from 'src/components/run/RunSalesQuestions';
// import { RunSurveyQuestions } from 'src/components/run/RunSurveyQuestions';
// import { RunRollCall } from 'src/components/run/RunRollCall';
// import { RunStockCounterEntry } from 'src/components/run/RunStockCounterEntry';
// import { RunDashboardSurvey } from 'src/components/run/RunDashboardSurvey';
// import { RunKPIs } from 'src/components/run/RunKPIs';
// import { RunPayment } from 'src/components/run/RunPayment';
// import { RunPayRate } from 'src/components/run/RunPayRate';
// import { RunProfile } from 'src/components/run/RunProfile';
// import { RunSampling } from 'src/components/run/RunSampling';
// import { RunSalesStockAllocation } from 'src/components/run/RunSalesStockAllocation';

export default function Page({ params: { runId } }: any) {
  const { action: getRun, data: run } = GQLMutation({
    mutation: M_CAMPAIGN_RUN,
    resolver: 'm_run',
    toastmsg: false,
  });

  // const run = {
  //   id: "run-123456",
  //   name: "Summer Promotion 2023",
  //   code: "SUM2023",
  //   dateStart: "2023-06-01T00:00:00Z",
  //   dateStop: "2023-08-31T23:59:59Z",
  //   clockType: "STANDARD",
  //   clockInPhotoLabel: "Store Front",
  //   clockOutPhotoLabel: "Completed Display",
  //   clockInTime: "09:00",
  //   clockOutTime: "17:00",
  //   locationPingFrequency: 15,
  //   closeAdvertOn: "2023-05-15T00:00:00Z",
  //   forceClose: false,
  //   created: "2023-04-01T10:30:00Z",
  //   campaign: {
  //     id: "camp-789012",
  //     name: "Retail Summer Campaign",
  //     project: {
  //       clientTier2: {
  //         id: "ct2-345678",
  //         name: "Regional Marketing",
  //         clientTier1: {
  //           id: "ct1-901234",
  //           name: "Global Brands Inc."
  //         }
  //       }
  //     }
  //   },
  //   types: [
  //     {
  //       id: "type-567890",
  //       name: "Sales"
  //     },
  //     {
  //       id: "type-567891",
  //       name: "In-Store Promotion"
  //     },
  //     {
  //       id: "type-678901",
  //       name: "Product Sampling"
  //     }
  //   ],
  //   manager: {
  //     id: "mgr-234567",
  //     name: "Jane Smith"
  //   },
  //   poster: {
  //     id: "pst-456789",
  //     fileName: "summer_campaign_poster.jpg"
  //   },
  //   applications: [
  //     { id: "app-123456" },
  //     { id: "app-234567" },
  //     { id: "app-345678" }
  //   ],
  //   offers: [
  //     { id: "off-123456" },
  //     { id: "off-234567" }
  //   ]
  // };

  console.log('run:', run);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (runId) {
      getRun({ variables: { input: { id: runId } } });
    }
  }, [getRun, runId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
        <Tab label="Dashboards" />
        <Tab label="Roll Call" />
        <Tab label="Stock Management" />
        <Tab label="Surveys" />
        <Tab label="Payroll" />
        {/* {run?.types?.map((activity: any, i: number) => (
          <Tab key={`run-type-${i}`} label={activity.name || 'No Activity'} />
        ))} */}
      </Tabs>

      <Card sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Profile Content</Typography>
            {run && <RunProfile run={run} />}
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Dashboards Content</Typography>
            <div className="tab-pane" id="dashboards">
              <ul className="nav nav-tabs nav-bordered mb-3">
                {run?.types?.map((activity: any, i: number) => {
                  switch (activity.name) {
                    case RUN_ACTIVITY_SALES:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">{activity.name}</span>
                          </a>
                        </li>
                      );

                    case RUN_ACTIVITY_SAMPLING:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">{activity.name}</span>
                          </a>
                        </li>
                      );

                    case RUN_ACTIVITY_SURVEY:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">{activity.name}</span>
                          </a>
                        </li>
                      );

                    case RUN_ACTIVITY_ROAD_SHOW:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">{activity.name}</span>
                          </a>
                        </li>
                      );

                    case RUN_ACTIVITY_STOCK_MAPPING:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">{activity.name}</span>
                          </a>
                        </li>
                      );

                    default:
                      return (
                        <li className="nav-item" key={`run-type-${i}`}>
                          <a
                            href={`#run-dashboard-${i}`}
                            data-bs-toggle="tab"
                            aria-expanded={i === 0 }
                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                          >
                            <i className="mdi mdi-account-circle d-md-none d-block"/>
                            <span className="d-none d-md-block">Unsupported Run Activity</span>
                          </a>
                        </li>
                      );
                  }
                })}
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
                          <h4>Dashboard Sales</h4>
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
                          <h4>Dashboard Survey</h4>
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
            </div>
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Roll Call Content</Typography>
            {run && <RunRollCall run={run} />}
          </Box>
        )}
        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Stock Management</Typography>
            {/* Placeholder for Stock Management Content */}
            {run && <p>Stock Management</p>}
          </Box>
        )}
        {activeTab === 4 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Surveys</Typography>
            {/* Surveys Content */}
            {run?.id && <DashboardSurvey campaignRunId={run.id} />}
          </Box>
        )}
        {run?.types?.map((activity: any, i: number) => (
          activeTab === i + 5 && (
            <Box sx={{ p: 2 }} key={`activity-content-${i}`}>
              <Typography variant="h6">{activity.name} Content</Typography>
              {/* Placeholder for Activity Content */}
              {run && <p>Run Activity</p>}
            </Box>
          )
        ))}
      </Card>
    </Box>
  );
}