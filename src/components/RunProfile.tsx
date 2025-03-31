'use client';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_RUN_REPORTS_SUMMARY } from 'src/lib/mutations/general.mutation';
import { ISurveyReportBody } from 'src/lib/interface/general.interface';
import { commafy, downloadCSVSurveyReport, formatDate, formatTimeTo12Hr, slugify } from 'src/lib/helpers';
import { sourceImage } from 'src/lib/server';

// Material UI imports
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

// Iconify imports
import { Icon } from '@iconify/react';

import {
  RUN_ACTIVITY_ROAD_SHOW,
  RUN_ACTIVITY_SALES,
  RUN_ACTIVITY_SAMPLING,
  RUN_ACTIVITY_STOCK_MAPPING,
  RUN_ACTIVITY_SURVEY,
} from 'src/lib/constant';

export const RunProfile: FC<{
  run: any;
}> = ({ run }) => {
  const {
    action: getRunReportSummary,
    loading: loadingReportSummary,
    data: runReportSummary,
  } = GQLMutation({
    mutation: M_RUN_REPORTS_SUMMARY,
    resolver: 'runReportsSummary',
    toastmsg: false,
  });

  const [inputReport, setInputReport] = useState<ISurveyReportBody>({
    _reportName: undefined,
    date: undefined,
    page: undefined,
    pageSize: undefined,
    surveyId: undefined,
    salesSurveyId: undefined,
    salesGiveawaySurveyId: undefined,
    freeGiveawaySurveyId: undefined,
  });
  const [downloading, setDownloading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleDownloadCSVSurveyReport = () => {
    downloadCSVSurveyReport(inputReport, setDownloading);
  };

  useEffect(() => {
    if (run?.id) getRunReportSummary({ variables: { input: { runId: run.id } } });
  }, [run?.id, getRunReportSummary]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={
                <Avatar
                  alt={run?.name}
                  src={sourceImage(run?.poster?.fileName)}
                  sx={{ width: 150, height: 150 }}
                />
              }
              title={<Typography variant="h4">{run?.name}</Typography>}
              subheader={
                <Typography variant="body2" color="textSecondary">
                  From <strong>{formatDate(run.dateStart, 'dd MMMM yyyy')}</strong> to{' '}
                  <strong>{formatDate(run.dateStop, 'dd MMMM yyyy')}</strong>
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6">{formatTimeTo12Hr(run?.clockInTime)}</Typography>
                  <Typography variant="body2" color="textSecondary">Clock in</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{formatTimeTo12Hr(run?.clockOutTime)}</Typography>
                  <Typography variant="body2" color="textSecondary">Clock out</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                <strong>Code:</strong> {run?.code}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Clock In/Out:</strong> {run?.clockType}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Created On:</strong> {run?.created}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Manager:</strong> {run?.manager?.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Activities:</strong>
              </Typography>
              {run?.types?.map((_type: any, i: number) => (
                <p key={`activity-${i}`} style={{ marginBottom: '8px', border: '1px solid #ccc', padding: '8px', borderRadius: '25px', backgroundColor: '#f0f0f0'}}>{_type.name}</p>
              ))}
            </CardContent>
          </Card>

          {/* ---------- DOWNLOAD REPORTS ---------- */}

          {run?.types?.map((activity: any, i: number) => {
            switch (activity.name) {
              case RUN_ACTIVITY_SALES:
                return (
                  <Card key={`run-type-${i}`} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={2}>
                          <Avatar>.xlsx</Avatar>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body1" className="fw-bold">
                            Sales Survey
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {commafy(runReportSummary?.surveySales)} Reports
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {loadingReportSummary ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Button
                              onClick={() => {
                                setInputReport({
                                  ...inputReport,
                                  _reportName: `sales-survey-${slugify(run?.name || run?.campaign?.name)}`,
                                  salesSurveyId: runReportSummary?.salesSurveyId,
                                  surveyId: undefined,
                                  salesGiveawaySurveyId: undefined,
                                  freeGiveawaySurveyId: undefined,
                                });
                                setOpenModal(true);
                              }}
                            >
                              <Icon icon="mdi:download" />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );

              case RUN_ACTIVITY_SAMPLING:
                return (
                  <Card key={`run-type-${i}`} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={2}>
                          <Avatar>.xlsx</Avatar>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body1" className="fw-bold">
                            Sampling Survey
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {commafy(runReportSummary?.surveySampling)} Reports
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {loadingReportSummary ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Button
                              onClick={() => {
                                setInputReport({
                                  ...inputReport,
                                  _reportName: `sampling-${slugify(run?.name || run?.campaign?.name)}`,
                                  freeGiveawaySurveyId: runReportSummary?.freeGiveawaySurveyId,
                                  surveyId: undefined,
                                  salesSurveyId: undefined,
                                  salesGiveawaySurveyId: undefined,
                                });
                                setOpenModal(true);
                              }}
                            >
                              <Icon icon="mdi:download" />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );

              case RUN_ACTIVITY_SURVEY:
                return (
                  <Card key={`run-type-${i}`} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={2}>
                          <Avatar>.xlsx</Avatar>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body1" className="fw-bold">
                            General Survey
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {commafy(runReportSummary?.survey)} Reports
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {loadingReportSummary ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Button
                              onClick={() => {
                                setInputReport({
                                  ...inputReport,
                                  _reportName: `survey-${slugify(run?.name || run?.campaign?.name)}`,
                                  surveyId: runReportSummary?.surveyId,
                                  salesSurveyId: undefined,
                                  salesGiveawaySurveyId: undefined,
                                  freeGiveawaySurveyId: undefined,
                                });
                                setOpenModal(true);
                              }}
                            >
                              <Icon icon="mdi:download" />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );

              case RUN_ACTIVITY_ROAD_SHOW:
                return (
                  <Typography key={`run-type-${i}`} variant="body2" color="warning.main">
                    {activity.name} report not available
                  </Typography>
                );

              case RUN_ACTIVITY_STOCK_MAPPING:
                return (
                  <Typography key={`run-type-${i}`} variant="body2" color="warning.main">
                    {activity.name} report not available
                  </Typography>
                );

              default:
                return (
                  <></>
                );
            }
          })}
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Additional content can be added here */}
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="download-reports-modal"
        aria-describedby="modal-to-download-reports"
      >
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
          <CardHeader title="Download" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  defaultValue={inputReport.date?.toString()}
                  onChange={(e) =>
                    setInputReport({
                      ...inputReport,
                      date: e.target.value !== '' ? new Date(e.target.value) : undefined,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Page"
                  type="number"
                  defaultValue={inputReport.page}
                  onChange={(e) =>
                    setInputReport({
                      ...inputReport,
                      page: e.target.value !== '' ? parseInt(e.target.value, 10) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rows per page"
                  type="number"
                  defaultValue={inputReport.pageSize}
                  onChange={(e) =>
                    setInputReport({
                      ...inputReport,
                      pageSize: e.target.value !== '' ? parseInt(e.target.value, 10) : undefined,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleDownloadCSVSurveyReport}
              disabled={downloading}
            >
              {downloading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Icon icon="mdi:download" />
                  Download
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </Container>
  );
};
