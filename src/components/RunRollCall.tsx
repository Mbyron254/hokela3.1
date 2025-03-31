'use client';

import { FC } from 'react';
import { RunRouteSetPoints } from './RunRouteSetPoints';
// import { RunRouteSetAreas } from './RunRouteSetAreas';
// import { RunRouteSetDirections } from './RunRouteSetDirections';
// import { RunAttendanceMap } from './RunAttendanceMap';
// import { RunClockLogsAll } from './RunClockLogsAll';
// import { RunClockLogsLatest } from './RunClockLogsLatest';

export function RunRollCall({ run }: { run: any }) {
  return (
    <>
      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a
            href="#attendance-list"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link rounded-0 active"
          >
            <span className="d-md-block">Clock Logs List</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#attendance-map"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link rounded-0"
          >
            <span className="d-md-block">Clock Logs Map</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#route-setting"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link rounded-0"
          >
            <span className="d-md-block">Routes Configuration</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="attendance-list">
          <ul className="nav nav-pills bg-nav-pills mb-2">
            <li className="nav-item">
              <a
                href="#clock-logs-latest"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link rounded-0 active"
              >
                <i className="mdi mdi-account-circle d-md-none d-block"/>
                <span className="d-none d-md-block">Agent Last Log</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#clock-logs-all"
                data-bs-toggle="tab"
                aria-expanded="false"
                className="nav-link rounded-0"
              >
                <i className="mdi mdi-home-variant d-md-none d-block"/>
                <span className="d-none d-md-block">All Logs</span>
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane show active" id="clock-logs-latest">
              {/* {run && <RunClockLogsLatest run={run} />} */}
              <div>Latest</div>
            </div>

            <div className="tab-pane" id="clock-logs-all">
              {/* {run && <RunClockLogsAll run={run} />} */}
              <div>All</div>
            </div>
          </div>
        </div>

        <div className="tab-pane" id="attendance-map">
          {/* {run && <RunAttendanceMap run={run} />} */}
          <div>Map</div>
        </div>

        <div className="tab-pane" id="route-setting">
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
              {/* {run && <RunRouteSetAreas run={run} />} */}
              <div>Areas</div>
            </div>

            <div className="tab-pane" id="route-directions">
              {/* {run && <RunRouteSetDirections run={run} />} */}
              <div>Directions</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
