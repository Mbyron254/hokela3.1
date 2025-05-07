'use client';

import { FC } from 'react';
import { RunRouteSetPoints } from './RunRouteSetPoints';
import { RunRouteSetAreas } from './RunRouteSetAreas';
import { RunRouteSetDirections } from './RunRouteSetDirections';
import { RunAttendanceMap } from './RunAttendanceMap';
import { RunClockLogsAll } from './RunClockLogsAll';
import { RunClockLogsLatest } from './RunClockLogsLatest';

export const RunRollCallRunManager: FC<{
  run: any;
}> = ({ run }) => {
  return (
    <>
      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a
            href="#logs-running"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link rounded-0 active"
          >
            <i className="mdi mdi-account-circle d-md-none d-block"></i>
            <span className="d-none d-md-block">Running Logs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#logs-all" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <i className="mdi mdi-home-variant d-md-none d-block"></i>
            <span className="d-none d-md-block">All Logs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#logs-map" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
            <span className="d-md-block">Mapped Logs</span>
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

        <div className="tab-pane" id="logs-map">
          {run && <RunAttendanceMap run={run} />}
        </div>
      </div>
    </>
  );
};
