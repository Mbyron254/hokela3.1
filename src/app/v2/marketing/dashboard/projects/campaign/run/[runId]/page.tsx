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

  const [activeTab, setActiveTab] = useState(0);

  const loadRun = () => {
    if (runId) {
      getRun({ variables: { input: { id: runId } } });
    }
  };

  useEffect(() => loadRun(), []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Page Title
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
        <Tab label="Payroll" />
        {run?.types?.map((activity: any, i: number) => (
          <Tab key={`run-type-${i}`} label={activity.name || 'No Activity'} />
        ))}
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
            {/* Placeholder for Dashboards Content */}
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Roll Call Content</Typography>
            {/* {run && <RunRollCall run={run} />} */}
            {run && <p>Run Roll Call</p>}
          </Box>
        )}
        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Payroll Content</Typography>
            {/* Placeholder for Payroll Content */}
            {run && <p>Run Payroll</p>}
          </Box>
        )}
        {run?.types?.map((activity: any, i: number) => (
          activeTab === i + 4 && (
            <Box sx={{ p: 2 }} key={`activity-content-${i}`}>
              <Typography variant="h6">{activity.name} Content</Typography>
              {/* Placeholder for Activity Content */}
              {run && <p>Run Activity</p>}
            </Box>
          )
        ))}
      </Card>

      {/* Regular Button Example */}
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary">
          Regular Button
        </Button>
      </Box>
    </Box>
  );
}