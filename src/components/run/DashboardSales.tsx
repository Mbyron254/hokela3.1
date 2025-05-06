'use client';

import { GQLMutation } from '@/lib/client';
import { FC, useEffect, useState } from 'react';
import { M_ANALYZE_RUN_SHOPS } from '@/lib/mutations/analytics-sales.mutation';
import { commafy } from '@/lib/helpers';
import { SALES_SURVEY } from '@/lib/mutations/sales-survey.mutation';
import { LoadingDiv } from '../LoadingDiv';
import { LoadingSpan } from '../LoadingSpan';
import { M_RUN_SHOPS_DISTRIBUTION } from '@/lib/mutations/analytics.mutation';
import { IPoint } from '@/lib/interface/point.interface';
import { GoogleMapPoint } from '../GoogleMapPoint';

export const DashboardSales: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getSurvey,
    loading: loadingSurvey,
    data: survey,
  } = GQLMutation({
    mutation: SALES_SURVEY,
    resolver: 'salesSurvey',
    toastmsg: false,
  });
  const {
    action: getSalesAnalytics,
    loading: loadingAnalytics,
    data: salesAnalytics,
  } = GQLMutation({
    mutation: 'M_ANALYZE_RUN_SALES',
    resolver: 'analyzeRunSales',
    toastmsg: false,
  });
  const {
    action: getSalesShops,
    loading: loadingSalesShops,
    data: salesShops,
  } = GQLMutation({
    mutation: M_ANALYZE_RUN_SHOPS,
    resolver: 'analyzeRunShops',
    toastmsg: false,
  });
  const {
    action: getShopsDistribution,
    loading: loadingShopsDistribution,
    data: shopsDistribution,
  } = GQLMutation({
    mutation: M_RUN_SHOPS_DISTRIBUTION,
    resolver: 'analyzeRunShopsDistribution',
    toastmsg: false,
  });

  const [page, setPage] = useState(1);
  const [inputReport, setInputReport] = useState<{ date?: Date; page?: number; pageSize?: number }>({
    date: undefined,
    page: 1,
    pageSize: 100,
  });
  const [locations, setLocations] = useState<IPoint[]>([]);

  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const loadSalesAnalytics = () => {
    if (runId) {
      getSalesAnalytics({ variables: { input: { runId } } });
    }
  };
  const loadSalesShops = () => {
    if (runId) {
      getSalesShops({ variables: { input: { runId, page, pageSize: 50 } } });
    }
  };
  const loadRunShopsDistribution = () => {
    if (runId) {
      getShopsDistribution({ variables: { input: { runId } } });
    }
  };

  useEffect(() => loadSurvey(), []);
  useEffect(() => {
    loadSalesAnalytics();
    loadRunShopsDistribution();
  }, [runId]);
  useEffect(() => loadSalesShops(), [runId, page]);
  useEffect(() => {
    if (shopsDistribution) {
      const _locations: IPoint[] = [];

      for (let i = 0; i < shopsDistribution.length; i++) {
        _locations.push({ lat: shopsDistribution[i].lat, lng: shopsDistribution[i].lng });
      }
      setLocations(_locations);
    }
  }, [shopsDistribution]);

  return (
    <>
      {/* {loadingAnalytics && <LoadingDiv />}

      {salesAnalytics && (
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h5
                      className="text-muted fw-normal text-truncate mt-0"
                      title="Total Allocated Stock"
                    >
                      Allocated Stock Units
                    </h5>
                    <h4 className="my-2 py-1">{commafy(salesAnalytics?.totalStockUnitsAllocated)}</h4>
                    <p className="mb-0 text-muted">Units</p>
                  </div>
                   <div className="col-6">
                  <div className="text-end">
                    <div id="campaign-sent-chart" data-colors="#727cf5"></div>
                  </div>
                </div> 
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h5 className="text-muted fw-normal mt-0 text-truncate" title="Total Stock Value">
                      Allocated Stock Value
                    </h5>
                    <h4 className="my-2 py-1">
                      {commafy(salesAnalytics?.totalStockValueAllocated.toFixed(2))}
                    </h4>
                    <p className="mb-0 text-muted">
                      <span className="me-1">ksh</span>
                    </p>
                  </div>
                   <div className="col-6">
                  <div className="text-end">
                    <div id="deals-chart" data-colors="#727cf5"></div>
                  </div>
                </div> 
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h5 className="text-muted fw-normal mt-0 text-truncate" title="Total Sold Stock">
                      Sold Stock Units
                    </h5>
                    <h4 className="my-2 py-1">{commafy(salesAnalytics?.totalStockUnitsSold)}</h4>
                    <p className="mb-0 text-muted">Units</p>
                  </div>
                   <div className="col-6">
                  <div className="text-end">
                    <div id="new-leads-chart" data-colors="#0acf97"></div>
                  </div>
                </div> 
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h5 className="text-muted fw-normal mt-0 text-truncate" title="Sold Value">
                      Sold Stock Value
                    </h5>
                    <h4 className="my-2 py-1">
                      {commafy(salesAnalytics?.totalStockValueSold.toFixed(2))}
                    </h4>
                    <p className="mb-0 text-muted">
                      <span className="me-1">ksh</span>
                    </p>
                  </div>
                   <div className="col-6">
                  <div className="text-end">
                    <div id="booked-revenue-chart" data-colors="#0acf97"></div>
                  </div>
                </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="row">
        <div className="col-md-3">
          {loadingSurvey && <LoadingDiv />}

          {survey?.id && (
            <button
              type="button"
              className="btn btn-outline-info w-100 mb-3"
              data-bs-toggle="modal"
              data-bs-target="#downloadSalesSurveyReports"
            >
              <i className="mdi mdi-cloud-download-outline me-1"></i>Download Survey Reports
            </button>
          )}

          <div className="card tilebox-one">
            <div className="card-body">
              <i className="mdi mdi-bank-outline float-end"></i>
              <h6 className="text-uppercase mt-0">New Shops Mapped</h6>
              <h2 className="my-2" id="active-users-count">
                {loadingAnalytics && <LoadingSpan />}

                {salesAnalytics?.totalNewShopsMapped}
              </h2>
              <p className="mb-0 text-muted">
                <span className="text-info me-2">
                  <span className="mdi mdi-arrow-up-bold"></span> ---%
                </span>
                <span className="text-nowrap">Since yesterday</span>
              </p>
            </div>
          </div>

          <div className="card tilebox-one">
            <div className="card-body">
              <i className="mdi mdi-bank-outline float-end"></i>
              <h6 className="text-uppercase mt-0">Total Shops Visited</h6>
              <h2 className="my-2" id="active-views-count">
                {loadingAnalytics && <LoadingSpan />}

                {salesAnalytics?.totalShopsVisited}
              </h2>
              <p className="mb-0 text-muted">
                <span className="text-info me-2">
                  <span className="mdi mdi-arrow-down-bold"></span> ---%
                </span>
                <span className="text-nowrap">Since yesterday</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <ul className="nav nav-tabs nav-bordered mb-3">
            <li className="nav-item">
              <a
                href="#shop-mapping"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link active"
              >
                <i className="mdi mdi-account-circle d-md-none d-block"></i>
                <span className="d-none d-md-block">Shops Visited</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#shops-distribution"
                data-bs-toggle="tab"
                aria-expanded="false"
                className="nav-link"
              >
                <i className="mdi mdi-settings-outline d-md-none d-block"></i>
                <span className="d-none d-md-block">Shops Distribution</span>
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane show active" id="shop-mapping">
              {loadingSalesShops && <LoadingDiv />}

              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive mb-0">
                    <table className="table table-centered table-nowrap table-hover mb-0">
                      <tbody>
                        {salesShops?.data.map((shop: any, index: number) => (
                          <tr key={`mapped-shop-${index}`}>
                            <td>
                              <h5 className="font-14 my-1">
                                <a href="#" className="text-body">
                                  {index + 1}. {shop?.metadata?.name}
                                </a>
                              </h5>
                              <span className="text-muted font-13">
                                Visited by <strong>{shop.agents?.length}</strong> agents
                              </span>
                            </td>
                            <td>
                              <span className="text-muted font-13">Total sold units</span>
                              <h5 className="font-14 mt-1 fw-normal">{shop.totalSoldUnits}</h5>
                            </td>
                            <td>
                              <span className="text-muted font-13">Total sold value</span>
                              <h5 className="font-14 mt-1 fw-normal">
                                <small className="text-muted me-1">ksh</small>
                                {commafy(shop.totalSoldValue.toFixed(2))}
                              </h5>
                            </td>
                            <td>
                              <span className="text-muted font-13">Mapped by</span>
                              <h5 className="font-14 mt-1 fw-normal">{shop.metadata?.user?.name}</h5>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="btn-group mb-2">
                  <input
                    type="text"
                    className="btn btn-light"
                    value={`Total Rows ${salesShops?.total}`}
                    disabled={true}
                  />
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={!salesShops?.previousPage}
                    onClick={() => setPage((_page) => (_page > 2 ? _page - 1 : 1))}
                  >
                    Prev
                  </button>
                  <select
                    className="form-select"
                    id="example-select"
                    onChange={(e) => setPage(parseInt(e.target.value))}
                  >
                    {Array(salesShops?.totalPages || 0)
                      .fill(null)
                      .map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={!salesShops?.nextPage}
                    onClick={() => setPage((_page) => _page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="tab-pane" id="shops-distribution">
              {loadingShopsDistribution && <LoadingDiv />}
              <h5 className="card-title">{shopsDistribution?.length} Shops</h5>
              <GoogleMapPoint locations={locations} />
            </div>
          </div>
        </div>
      </div>

      <div
        tabIndex={-1}
        className="modal fade"
        id="downloadSalesSurveyReports"
        role="dialog"
        aria-labelledby="DownloadSalesSurveyReport"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="DownloadSalesSurveyReport">
                Download Sales Survey Reports
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
                        setInputReport({ ...inputReport, date: new Date(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="page">Page Number</label>
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
                    <label htmlFor="rows">Number of Rows Per Page</label>
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
              {/* <button
                className="btn btn-outline-secondary btn-rounded w-100"
                type="button"
                onClick={() => downloadCSVReport({ ...inputReport, salesSurveyId: survey.id }, 'sales')}
              >
                <i className="mdi mdi-cloud-download me-1"></i>Download CSV
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
