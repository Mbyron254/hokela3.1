'use client';

import { RunSalesStockAllocation } from 'src/components/run/RunSalesStockAllocation';
import { RunKPIs } from 'src/components/run/RunKPIs';
import { RunPayroll } from 'src/components/run/RunPayroll';
import { RunPayRate } from 'src/components/run/RunPayRate';
import { RunProfile } from 'src/components/run/RunProfile';
import { RunSampling } from 'src/components/run/RunSampling';
import { GQLMutation } from 'src/lib/client';
import {
  RUN_ACTIVITY_ROAD_SHOW,
  RUN_ACTIVITY_SALES,
  RUN_ACTIVITY_SAMPLING,
  RUN_ACTIVITY_STOCK_MAPPING,
  RUN_ACTIVITY_SURVEY,
} from 'src/lib/constant';
import { M_CAMPAIGN_RUN } from 'src/lib/mutations/run.mutation';
import { useEffect } from 'react';
import { RunSalesGiveawayConfig } from 'src/components/run/RunSalesGiveawayConfig';
import { RunSalesGiveawayQuestions } from 'src/components/run/RunSalesGiveawayQuestions';
import { RunSalesQuestions } from 'src/components/run/RunSalesQuestions';
import { RunSurveyQuestions } from 'src/components/run/RunSurveyQuestions';
import { RunRollCall } from 'src/components/run/RunRollCall';
import { RunStockCounterEntry } from 'src/components/run/RunStockCounterEntry';
import { RunDashboardSurvey } from 'src/components/run/RunDashboardSurvey';
import { RunDashboardSales } from 'src/components/run/RunDashboardSales';
import { RunTeam } from 'src/components/run/RunTeam';

export default function Page({ params: { runId } }: any) {
  const { action: getRun, data: run } = GQLMutation({
    mutation: M_CAMPAIGN_RUN,
    resolver: 'm_run',
    toastmsg: false,
  });

  useEffect(() => {
    if (runId) {
      getRun({ variables: { input: { id: runId } } });
    }
  }, [runId, getRun]);

  return (
    <>
      <ul className="nav nav-pills bg-nav-pills nav-justified mb-3">
        <li className="nav-item">
          <a
            href="#profile1"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link rounded-0 active"
          >
            <span className="d-md-block">Profile</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#team" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <span className="d-md-block">Team</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#analytics" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <span className="d-md-block">Analytics</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#attendance"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link rounded-0"
          >
            <span className="d-md-block">Attendance</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#payroll" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <span className="d-md-block">Payroll</span>
          </a>
        </li>

        {run?.types?.map((activity: any, i: number) => {
          switch (activity.name) {
            case RUN_ACTIVITY_SALES:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#activity-${activity.id}`}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              );

            case RUN_ACTIVITY_SAMPLING:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#activity-${activity.id}`}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              );

            case RUN_ACTIVITY_SURVEY:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#activity-${activity.id}`}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              );

            case RUN_ACTIVITY_ROAD_SHOW:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#activity-${activity.id}`}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              );

            case RUN_ACTIVITY_STOCK_MAPPING:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href={`#activity-${activity.id}`}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">{activity.name}</span>
                  </a>
                </li>
              );

            default:
              return (
                <li className="nav-item" key={`run-type-${i}`}>
                  <a
                    href="#no-activity"
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link rounded-0"
                  >
                    <span className="d-md-block">No Activity</span>
                  </a>
                </li>
              );
          }
        })}
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="profile1">
          {run && <RunProfile run={run} />}
        </div>

        <div className="tab-pane" id="team">
          {run && <RunTeam run={run} />}
        </div>

        <div className="tab-pane" id="analytics">
          <ul className="nav nav-tabs nav-bordered mb-3">
            {run?.types?.map((activity: any, i: number) => {
              switch (activity.name) {
                case RUN_ACTIVITY_SALES:
                  return (
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
                  );

                case RUN_ACTIVITY_SAMPLING:
                  return (
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
                  );

                case RUN_ACTIVITY_SURVEY:
                  return (
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
                  );

                case RUN_ACTIVITY_ROAD_SHOW:
                  return (
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
                  );

                case RUN_ACTIVITY_STOCK_MAPPING:
                  return (
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
                  );

                default:
                  return (
                    <li className="nav-item" key={`run-type-${i}`}>
                      <a
                        href={`#run-dashboard-${i}`}
                        data-bs-toggle="tab"
                        aria-expanded={i === 0}
                        className={`nav-link ${i === 0 ? 'active' : ''}`}
                      >
                        <span className="d-md-block">Unsupported Run Activity</span>
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
                      id={`run-dashboard-${i}`}
                      key={`run-dash-${i}`}
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
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
                      {run?.id ? <RunDashboardSurvey runId={run.id} /> : null}
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

        <div className="tab-pane" id="attendance">
          {run && <RunRollCall run={run} />}
        </div>

        <div className="tab-pane" id="payroll">
          <ul className="nav nav-tabs nav-bordered mb-3">
            <li className="nav-item">
              <a href="#payrates" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                <span className="d-md-block">Pay Rates</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#kpis" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                <span className="d-md-block">KPI&apos;s</span>
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
              {run?.id && <RunPayRate runId={run.id} />}
            </div>

            <div className="tab-pane" id="kpis">
              {run?.id && <RunKPIs runId={run.id} />}
            </div>

            <div className="tab-pane" id="agent-scores">
              {run?.id && <RunPayroll runId={run.id} />}
            </div>
          </div>
        </div>

        {run?.types?.map((activity: any, i: number) => {
          switch (activity.name) {
            case RUN_ACTIVITY_SALES:
              return (
                <div className="tab-pane" id={`activity-${activity.id}`} key={`run-type-${i}`}>
                  <ul className="nav nav-tabs nav-bordered mb-3">
                    <li className="nav-item">
                      <a
                        href="#sales-questions"
                        data-bs-toggle="tab"
                        aria-expanded="true"
                        className="nav-link active"
                      >
                        <span className="d-md-block">Sales Questions</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#sales-stock-allocation"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link"
                      >
                        <span className="d-md-block">Sales Stock Allocation</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#giveaway-questions"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link"
                      >
                        <span className="d-md-block">Giveaway Questions</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#giveaway-config"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link"
                      >
                        <span className="d-md-block">Giveaway Configuration</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#stock-correction"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link"
                      >
                        <span className="d-md-block">Stock Correction</span>
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div className="tab-pane show active" id="sales-questions">
                      {run?.id ? <RunSalesQuestions runId={run.id} /> : null}
                    </div>

                    <div className="tab-pane" id="sales-stock-allocation">
                      {run?.id && run?.campaign?.project?.clientTier2?.id ? (
                        <RunSalesStockAllocation
                          runId={run.id}
                          clientTier2Id={run.campaign.project.clientTier2.id}
                        />
                      ) : null}
                    </div>

                    <div className="tab-pane" id="giveaway-questions">
                      {run?.id ? <RunSalesGiveawayQuestions runId={run.id} /> : null}
                    </div>

                    <div className="tab-pane" id="giveaway-config">
                      {run?.id && run?.campaign?.project?.clientTier2?.id ? (
                        <RunSalesGiveawayConfig
                          runId={run.id}
                          clientTier2Id={run.campaign.project.clientTier2.id}
                        />
                      ) : null}
                    </div>

                    <div className="tab-pane" id="stock-correction">
                      {run?.id ? (
                        <RunStockCounterEntry
                          runId={run.id}
                          clientTier2Id={run.campaign.project.clientTier2.id}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );

            case RUN_ACTIVITY_SAMPLING:
              return (
                <div className="tab-pane" id={`activity-${activity.id}`} key={`run-type-${i}`}>
                  {run?.id && run?.campaign?.project?.clientTier2?.id ? (
                    <RunSampling runId={run.id} clientTier2Id={run.campaign.project.clientTier2.id} />
                  ) : null}
                </div>
              );

            case RUN_ACTIVITY_SURVEY:
              return (
                <div className="tab-pane" id={`activity-${activity.id}`} key={`run-type-${i}`}>
                  {run?.id && run?.campaign?.project?.clientTier2?.id ? (
                    <RunSurveyQuestions
                      runId={run.id}
                      clientTier2Id={run.campaign.project.clientTier2.id}
                    />
                  ) : null}
                </div>
              );

            case RUN_ACTIVITY_ROAD_SHOW:
              return (
                <div className="tab-pane" id={`activity-${activity.id}`} key={`run-type-${i}`}>
                  <h4>{activity.name}</h4>
                </div>
              );

            case RUN_ACTIVITY_STOCK_MAPPING:
              return (
                <div className="tab-pane" id={`activity-${activity.id}`} key={`run-type-${i}`}>
                  <h4>{activity.name}</h4>
                </div>
              );

            default:
              return (
                <div className="tab-pane" id="no-activity" key={`run-type-${i}`}>
                  <h4>No Activity Chosen</h4>
                </div>
              );
          }
        })}
      </div>
    </>
  );
}
