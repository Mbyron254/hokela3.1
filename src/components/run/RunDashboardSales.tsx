'use client';

import dynamic from 'next/dynamic';

import { GQLQuery } from '@/lib/client';
import { FC } from 'react';
import { Q_RUN_SALES_CHART } from '@/lib/queries/inventory.query';
import { commafy } from '@/lib/helpers';
import { Q_ANALYZE_RUN_SALES } from '@/lib/queries/analytics.query';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const RunDashboardSales: FC<{ runId: string }> = ({ runId }) => {
  const { data: salesChart } = GQLQuery({
    query: Q_RUN_SALES_CHART,
    queryAction: 'runSalesChart',
    variables: { input: { runId } },
  });
  const { data: salesAnalytics } = GQLQuery({
    query: Q_ANALYZE_RUN_SALES,
    queryAction: 'analyzeRunSales',
    variables: { input: { runId } },
  });

  return (
    <>
      <pre>{JSON.stringify(salesAnalytics, null, 2)}</pre>

      {salesAnalytics && (
        <div className="row">
          {/*
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
                      {commafy(salesAnalytics?.totalStockValueAllocated?.toFixed(2))}
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
          </div> */}

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h5 className="text-muted fw-normal mt-0 text-truncate" title="Sold Units">
                      Sold Units
                    </h5>
                    <h4 className="my-2 py-1">{commafy(salesAnalytics?.totalUnitsSold)}</h4>
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
                      Sold Value
                    </h5>
                    <h4 className="my-2 py-1">{commafy(salesAnalytics?.totalValueSold?.toFixed(2))}</h4>
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
      )}

      <div className="card">
        <div className="card-body">
          <Chart
            type="line"
            width={'100%'}
            height={350}
            series={[
              {
                name: 'Volume (Bags)',
                type: 'column',
                data: salesChart?.dailyVolume || [],
              },
              {
                name: 'Amount (ksh)',
                type: 'line',
                data: salesChart?.dailyAmount || [],
              },
            ]}
            options={{
              chart: {
                height: 350,
                type: 'line',
              },
              stroke: {
                width: [2, 2],
                curve: 'smooth',
              },
              colors: ['#2478ff', '#00d784'],
              dataLabels: {
                enabled: true,
                enabledOnSeries: [1],
              },
              labels: salesChart?.labels || [],
              yaxis: [
                {
                  title: {
                    text: 'Volume (Bags)',
                  },
                },
                {
                  opposite: true,
                  title: {
                    text: 'Amount (ksh)',
                  },
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
};
