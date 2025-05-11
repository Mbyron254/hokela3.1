'use client';

import { FC } from 'react';
import { RunRouteSetPoints } from './RunRouteSetPoints';
import { RunRouteSetAreas } from './RunRouteSetAreas';
import { RunRouteSetDirections } from './RunRouteSetDirections';
import { RunAttendanceMap } from './RunAttendanceMap';
import { RunClockLogsAll } from './RunClockLogsAll';
import { RunClockLogsLatest } from './RunClockLogsLatest';

export const RunRollCall: FC<{
  run: any;
}> = ({ run }) => (
    <>
      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a
            href="#logs-running"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link rounded-0 active"
          >
            <i className="mdi mdi-account-circle d-md-none d-block"/>
            <span className="d-none d-md-block">Running Logs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#logs-all" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <i className="mdi mdi-home-variant d-md-none d-block"/>
            <span className="d-none d-md-block">All Logs</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#logs-mapped"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link rounded-0"
          >
            <span className="d-md-block">Mapped Logs</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#route-configuration"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link rounded-0"
          >
            <span className="d-md-block">Route Configuration</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="logs-running">
          {run && <RunClockLogsLatest run={run} />}
        </div>

        <div className="tab-pane" id="logs-all">
          {run && <RunClockLogsAll run={run} />}
        </div>

        <div className="tab-pane" id="logs-mapped">
          {run && <RunAttendanceMap run={run} />}
        </div>

        <div className="tab-pane" id="route-configuration">
          <ul className="nav nav-pills bg-nav-pills mb-2">
            <li className="nav-item">
              <a
                href="#route-points"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link rounded-0 active"
              >
                <span className="d-md-block">
                  <i className="mdi mdi-map-marker-circle me-2"/>Points
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#route-areas"
                data-bs-toggle="tab"
                aria-expanded="false"
                className="nav-link rounded-0"
              >
                <span className="d-md-block">
                  <i className="mdi mdi-shape-polygon-plus me-2"/>Areas
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#route-directions"
                data-bs-toggle="tab"
                aria-expanded="false"
                className="nav-link rounded-0"
              >
                <span className="d-md-block">
                  <i className="mdi mdi-map-marker-path me-2"/>Directions
                </span>
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane show active" id="route-points">
              {run && <RunRouteSetPoints run={run} />}
            </div>

            <div className="tab-pane" id="route-areas">
              {run && <RunRouteSetAreas run={run} />}
            </div>

            <div className="tab-pane" id="route-directions">
              {run && <RunRouteSetDirections run={run} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
