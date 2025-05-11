'use client';

import { FC, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_AGENT_RUN_SALES_CHART } from 'src/lib/queries/inventory.query';  
import { AGENT_RUN_SALES } from 'src/lib/mutations/inventory.mutation';
import { sourceImage } from 'src/lib/server';
import { LoadingSpan } from 'src/components/LoadingSpan';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const RunAgentHistoricSales: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getAgentRunSales,
    loading: loadingAgentRunSales,
    data: agentRunSales,
  } = GQLMutation({
    mutation: AGENT_RUN_SALES,
    resolver: 'agentRunSales',
    toastmsg: false,
  });
  const { data: salesChart } = GQLQuery({
    query: Q_AGENT_RUN_SALES_CHART,
    queryAction: 'agentRunSalesChart',
    variables: { input: { runId } },
  });

  useEffect(() => {
    if (runId) {
      getAgentRunSales({ variables: { input: { runId } } });
    }
  }, [runId, getAgentRunSales]);

  return (
    <div className="row">
      <div className="col-md-12">
        {loadingAgentRunSales && <LoadingSpan />}

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-borderless table-centered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    {/* <th>Total Amount</th> */}
                  </tr>
                </thead>
                <tbody>
                  {agentRunSales?.map((sale: any, index: number) => (
                    <tr key={`sale-${index}`}>
                      <td>
                        <img
                          className="rounded me-3"
                          src={sourceImage(sale.packaging?.product?.photos[0]?.id)}
                          alt=""
                          height="64"
                        />
                        <p className="m-0 d-inline-block align-middle font-16">
                          <a href="apps-ecommerce-products-details.html" className="text-body">
                            {sale.packaging?.product?.name}
                          </a>
                          <br />
                          <small className="me-2">
                            <b className="me-1">Packaging:</b>
                            <span className="me-1">{sale.packaging?.unitQuantity}</span>
                            {sale.packaging?.unit?.name}
                          </small>
                        </p>
                      </td>
                      <td>
                        {sale.quantity}
                        <span className="text-muted ms-1">{sale.packaging?.unit?.abbreviation}</span>
                      </td>
                      {/* <td>$743.30</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card">
          <div className="card-body p-1">
            <Chart
              type="line"
              width='100%'
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
      </div>
    </div>
  );
};
