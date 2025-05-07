'use client';

import Image from 'next/image';

import {
  commafy,
  downloadCSVAgentsRunSalesCumulative,
  downloadCSVAgentsRunSalesDaily,
  downloadCSVSurveyReport,
  formatDate,
  formatTimeTo12Hr,
  slugify,
} from '@/lib/helpers';
import { sourceImage } from '@/lib/server';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from '@/lib/client';
import { M_RUN_REPORTS_SUMMARY } from '@/lib/mutations/general.mutation';
import { LoadingSpan } from '../LoadingSpan';
import {
  InputAgentRunDailySales,
  ISalesDownload,
  ISurveyReportBody,
} from '@/lib/interface/general.interface';
import { MutationButton } from '../MutationButton';
import {
  RUN_ACTIVITY_ROAD_SHOW,
  RUN_ACTIVITY_SALES,
  RUN_ACTIVITY_SAMPLING,
  RUN_ACTIVITY_STOCK_MAPPING,
  RUN_ACTIVITY_SURVEY,
} from '@/lib/constant';

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
  const [inputDailySales, setInputDailySales] = useState<InputAgentRunDailySales>({
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [downloading, setDownloading] = useState(false);
  const [downloadingSalesCumulative, setDownloadingSalesCumulative] = useState(false);
  const [downloadingSalesDaily, setDownloadingSalesDaily] = useState(false);

  const loadReportSummary = () => {
    if (run?.id) {
      getRunReportSummary({ variables: { input: { runId: run.id } } });
    }
  };
  const handleDownloadCSVSurveyReport = () => {
    downloadCSVSurveyReport(inputReport, setDownloading);
  };
  const handleDownloadDailySales = () => {
    if (run?.id) {
      downloadCSVAgentsRunSalesDaily({ ...inputDailySales, runId: run.id }, setDownloadingSalesDaily);
    }
  };

  useEffect(() => loadReportSummary(), [run?.id]);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card bg-primary">
            <div className="card-body profile-user-box">
              <div className="row">
                <div className="col-sm-8">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="avatar-lg">
                        <Image
                          className="rounded-circle img-thumbnail"
                          src={sourceImage(run?.poster?.fileName)}
                          loader={() => sourceImage(run?.poster?.fileName)}
                          alt=""
                          width={150}
                          height={150}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <h4 className="mt-1 mb-1 text-white">{run?.name}</h4>

                        <p className="font-13 text-white-50">
                          From
                          <strong className="mx-1">{formatDate(run.dateStart, 'dd MMMM yyyy')}</strong>to
                          <strong className="ms-1">{formatDate(run.dateStop, 'dd MMMM yyyy')}</strong>
                        </p>

                        <ul className="mb-0 list-inline text-light">
                          <li className="list-inline-item me-3">
                            <h5 className="mb-1">{formatTimeTo12Hr(run?.clockInTime)}</h5>
                            <p className="mb-0 font-13 text-white-50">Clock in</p>
                          </li>
                          <li className="list-inline-item">
                            <h5 className="mb-1">{formatTimeTo12Hr(run?.clockOutTime)}</h5>
                            <p className="mb-0 font-13 text-white-50">Clock out</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="text-center mt-sm-0 mt-3 text-sm-end">
                    {/* <button type="button" className="btn btn-light">
                          <i className="mdi mdi-account-edit me-1"></i> Edit Profile
                        </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body pb-2">
              <div className="text-start">
                <p className="text-muted">
                  <strong>Code :</strong> <span className="float-end ms-2">{run?.code}</span>
                </p>

                <p className="text-muted">
                  <strong>Clock In/Out :</strong>
                  <span className="float-end ms-2">{run?.clockType}</span>
                </p>

                <p className="text-muted">
                  <strong>Created On :</strong> <span className="float-end ms-2">{run?.created}</span>
                </p>

                <p className="text-muted">
                  <strong>Manager :</strong> <span className="float-end ms-2">{run?.manager?.name}</span>
                </p>

                <p className="text-muted mb-0">
                  <strong>Activities :</strong>
                  <hr />
                  {run?.types?.map((_type: any, i: number) => (
                    <span
                      key={`activity-${i}`}
                      className="badge badge-primary-lighten p-1 font-12 me-2 mb-2"
                    >
                      {_type.name}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {run?.types?.map((activity: any, i: number) => {
            switch (activity.name) {
              case RUN_ACTIVITY_SALES:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                Cumulative Sales
                              </a>
                            </div>
                            <div className="col-auto">
                              {downloadingSalesCumulative ? <LoadingSpan /> : undefined}
                              {run?.id && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  onClick={() =>
                                    downloadCSVAgentsRunSalesCumulative(
                                      { runId: run?.id },
                                      setDownloadingSalesCumulative,
                                    )
                                  }
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                Daily Sales Report
                              </a>
                            </div>
                            <div className="col-auto">
                              {downloadingSalesDaily ? <LoadingSpan /> : undefined}

                              {run?.id && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  data-bs-toggle="modal"
                                  data-bs-target="#downloadDailySales"
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                Sales Survey
                              </a>
                              <p className="mb-0">
                                {commafy(runReportSummary?.surveySales)}
                                <small className="ms-1">Reports</small>
                              </p>
                            </div>
                            <div className="col-auto">
                              {loadingReportSummary ? <LoadingSpan /> : undefined}

                              {runReportSummary && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  data-bs-toggle="modal"
                                  data-bs-target="#downloadReports"
                                  onClick={() =>
                                    setInputReport({
                                      ...inputReport,
                                      _reportName: `survey-sales${
                                        run?.name ? '-' + slugify(run?.name) : ''
                                      }`,
                                      salesSurveyId: runReportSummary?.salesSurveyId,
                                      surveyId: undefined,
                                      salesGiveawaySurveyId: undefined,
                                      freeGiveawaySurveyId: undefined,
                                    })
                                  }
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                Sales Giveaway
                              </a>
                              <p className="mb-0">
                                {commafy(runReportSummary?.surveyGiveaway)}
                                <small className="ms-1">Reports</small>
                              </p>
                            </div>
                            <div className="col-auto">
                              {loadingReportSummary ? <LoadingSpan /> : undefined}
                              {runReportSummary && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  data-bs-toggle="modal"
                                  data-bs-target="#downloadReports"
                                  onClick={() =>
                                    setInputReport({
                                      ...inputReport,
                                      _reportName: `sales-giveaway${
                                        run?.name ? '-' + slugify(run?.name) : ''
                                      }`,
                                      salesGiveawaySurveyId: runReportSummary?.salesGiveawaySurveyId,
                                      surveyId: undefined,
                                      salesSurveyId: undefined,
                                      freeGiveawaySurveyId: undefined,
                                    })
                                  }
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case RUN_ACTIVITY_SAMPLING:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                Sampling Survey
                              </a>
                              <p className="mb-0">
                                {commafy(runReportSummary?.surveySampling)}
                                <small className="ms-1">Reports</small>
                              </p>
                            </div>
                            <div className="col-auto">
                              {loadingReportSummary ? <LoadingSpan /> : undefined}
                              {runReportSummary && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  data-bs-toggle="modal"
                                  data-bs-target="#downloadReports"
                                  onClick={() =>
                                    setInputReport({
                                      ...inputReport,
                                      _reportName: `sampling${
                                        run?.name ? '-' + slugify(run?.name) : ''
                                      }`,
                                      freeGiveawaySurveyId: runReportSummary?.freeGiveawaySurveyId,
                                      surveyId: undefined,
                                      salesSurveyId: undefined,
                                      salesGiveawaySurveyId: undefined,
                                    })
                                  }
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case RUN_ACTIVITY_SURVEY:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <div className="card mb-3 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div className="avatar-sm">
                                <span className="avatar-title rounded">.xlsx</span>
                              </div>
                            </div>
                            <div className="col text-muted ps-0">
                              <a href="#" className="fw-bold">
                                General Survey
                              </a>
                              <p className="mb-0">
                                {commafy(runReportSummary?.survey)}
                                <small className="ms-1">Reports</small>
                              </p>
                            </div>
                            <div className="col-auto">
                              {loadingReportSummary ? <LoadingSpan /> : undefined}
                              {runReportSummary && (
                                <a
                                  href="#"
                                  className="btn btn-link btn-lg text-muted"
                                  data-bs-toggle="modal"
                                  data-bs-target="#downloadReports"
                                  onClick={() =>
                                    setInputReport({
                                      ...inputReport,
                                      _reportName: `general-survey${
                                        run?.name ? '-' + slugify(run?.name) : ''
                                      }`,
                                      surveyId: runReportSummary?.surveyId,
                                      salesSurveyId: undefined,
                                      salesGiveawaySurveyId: undefined,
                                      freeGiveawaySurveyId: undefined,
                                    })
                                  }
                                >
                                  <i className="dripicons-download"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case RUN_ACTIVITY_ROAD_SHOW:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <span className="text-warning">{activity.name} report not availlable</span>
                    </div>
                  </div>
                );

              case RUN_ACTIVITY_STOCK_MAPPING:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <span className="text-warning">{activity.name} report not availlable</span>
                    </div>
                  </div>
                );

              default:
                return (
                  <div className="row" key={`run-type-${i}`}>
                    <div className="col-md-6">
                      <p className="text-warning mb-3">
                        <i className="mdi mdi-alert me-2"></i>Other reports not availlable for now.
                        Please try again later
                      </p>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </div>

      <div
        tabIndex={-1}
        className="modal fade"
        id="downloadReports"
        role="dialog"
        aria-labelledby="DownloadReports"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="DownloadReports">
                Download
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="dateSalesSurveyReport">Date</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      id="dateSalesSurveyReport"
                      placeholder="Date"
                      defaultValue={inputReport.date?.toString()}
                      onChange={(e) =>
                        setInputReport({
                          ...inputReport,
                          date: e.target.value !== '' ? new Date(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="page">Page</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      id="page"
                      placeholder="Page"
                      defaultValue={inputReport.page}
                      onChange={(e) =>
                        setInputReport({
                          ...inputReport,
                          page: e.target.value !== '' ? parseInt(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="rows">Rows per page</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      id="rows"
                      placeholder="Page Size"
                      defaultValue={inputReport.pageSize}
                      onChange={(e) =>
                        setInputReport({
                          ...inputReport,
                          pageSize: e.target.value !== '' ? parseInt(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <MutationButton
                type="button"
                size="sm"
                label="Download"
                icon="mdi mdi-cloud-download"
                className="w-100"
                loading={downloading}
                onClick={handleDownloadCSVSurveyReport}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        tabIndex={-1}
        className="modal fade"
        id="downloadDailySales"
        role="dialog"
        aria-labelledby="DownloadDailySales"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="DownloadDailySales">
                Download Daily Sales
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateFrom">From Date</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      id="dateFrom"
                      placeholder="Date From"
                      defaultValue={inputDailySales.dateFrom?.toString()}
                      onChange={(e) =>
                        setInputDailySales({
                          ...inputDailySales,
                          dateFrom: e.target.value !== '' ? e.target.value : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateTo">To Date</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      id="dateTo"
                      placeholder="Date To"
                      defaultValue={inputDailySales.dateTo?.toString()}
                      onChange={(e) =>
                        setInputDailySales({
                          ...inputDailySales,
                          dateTo: e.target.value !== '' ? e.target.value : undefined,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <MutationButton
                type="button"
                size="sm"
                label="Download"
                icon="mdi mdi-cloud-download"
                className="w-100"
                loading={downloadingSalesDaily}
                onClick={handleDownloadDailySales}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
