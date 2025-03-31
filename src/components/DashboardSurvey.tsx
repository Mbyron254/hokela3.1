'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import { M_SURVEY_MINI, M_SURVEY_REPORTS } from 'src/lib/mutations/survey.mutation';
import { FC, useEffect, useState } from 'react';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { TEDashboardSurvey } from 'src/components/TEDashboardSurvey';
import { downloadCSVReport } from 'src/lib/helpers';

export const DashboardSurvey: FC<{ campaignRunId: string }> = ({ campaignRunId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: M_SURVEY_MINI,
    resolver: 'survey',
    toastmsg: false,
  });
  const {
    action: getSurveyReports,
    loading: loadingSurveyReports,
    data: surveyReports,
  } = GQLMutation({
    mutation: M_SURVEY_REPORTS,
    resolver: 'surveyReports',
    toastmsg: false,
  });

  const [inputReport, setInputReport] = useState<{ date?: Date; page?: number; pageSize?: number }>({
    date: undefined,
    page: 1,
    pageSize: 100,
  });

  const loadSurveyReports = (page?: number, pageSize?: number) => {
    if (survey?.id) {
      getSurveyReports({
        variables: { input: { surveyId: survey.id, page, pageSize } },
      });
    }
  };

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'AGENT',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.agent?.user?.name,
      cell: (row: any) => (
          <>
            <Image
              className="me-3 mt-1 mb-1 rounded-circle"
              src={sourceImage(row.agent?.user?.profile?.photo?.fileName)}
              loader={() => sourceImage(row.agent?.user?.profile?.photo?.fileName)}
              alt=""
              width={TABLE_IMAGE_WIDTH}
              height={TABLE_IMAGE_HEIGHT}
            />
            <div className="w-100 overflow-hidden">
              <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
              <span className="font-13">{row.agent?.user?.accountNo}</span>
            </div>
          </>
        ),
    },
    {
      name: 'REPORT DATE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
  ];

  useEffect(() => {
    if (campaignRunId) {
      getSurvey({ variables: { input: { campaignRunId } } });
    }
  }, [campaignRunId, getSurvey]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <h4 className="header-title">{survey?.name}</h4>
            <hr />
            <p className="text-muted font-14 mb-3">{survey?.description}</p>

            <div className="row">
              <div className="col-md-6">
                <dl className="row mb-0">
                  <dt className="col-sm-6">Questions</dt>
                  <dd className="col-sm-6">
                    {survey?.questionnaireFields?.length}
                    <small className="text-muted ms-1">Questions</small>
                  </dd>
                  <dt className="col-sm-6">Reports</dt>
                  <dd className="col-sm-6">
                    {survey?.reports?.length}
                    <small className="text-muted ms-1">Reports</small>
                  </dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row mb-0">
                  <dt className="col-sm-6">Created</dt>
                  <dd className="col-sm-6">{survey?.created}</dd>
                  <dt className="col-sm-6">Updated</dt>
                  <dd className="col-sm-6">{survey?.updated}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            {survey?.id && (
              <>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <p id="dateSalesSurveyReport">Date</p>
                      <input
                        type="date"
                        className="form-control mb-3"
                        id="dateSalesSurveyReport"
                        placeholder="Date"
                        defaultValue={inputReport.date?.toString()}
                        onChange={(e) =>
                          setInputReport({ ...inputReport, date: new Date(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p id="page">Page Number</p>
                      <input
                        type="number"
                        className="form-control mb-3"
                        id="page"
                        placeholder="Page"
                        defaultValue={inputReport.page}
                        onChange={(e) =>
                          setInputReport({
                            ...inputReport,
                            page: e.target.value !== '' ? parseInt(e.target.value, 10) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p id="rows">Number of Rows Per Page</p>
                      <input
                        type="number"
                        className="form-control mb-3"
                        id="rows"
                        placeholder="Page Size"
                        defaultValue={inputReport.pageSize}
                        onChange={(e) =>
                          setInputReport({
                            ...inputReport,
                            pageSize: e.target.value !== '' ? parseInt(e.target.value, 10) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => downloadCSVReport({ ...inputReport, surveyId: survey.id }, 'general')}
                >
                  <i className="mdi mdi-cloud-download me-1"/>Download CSV
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <Button variant="outlined" size="small" className="float-end mb-3">
          <i className="mdi mdi-check-decagram me-1"/>Verify Selected
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.name}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {surveyReports?.rows.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.index}</TableCell>
                  <TableCell>
                    <Image
                      className="me-3 mt-1 mb-1 rounded-circle"
                      src={sourceImage(row.agent?.user?.profile?.photo?.fileName)}
                      loader={() => sourceImage(row.agent?.user?.profile?.photo?.fileName)}
                      alt=""
                      width={TABLE_IMAGE_WIDTH}
                      height={TABLE_IMAGE_HEIGHT}
                    />
                    <div className="w-100 overflow-hidden">
                      <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
                      <span className="font-13">{row.agent?.user?.accountNo}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
