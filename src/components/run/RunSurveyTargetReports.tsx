'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { IAgentTarget, ISurveyReportTarget } from '@/lib/interface/general.interface';
import { GQLMutation } from '@/lib/client';
import {
  M_SURVEY_REPORT_AGENTS_TARGET,
  SURVEY_REPORT_TARGET_CREATE,
} from '@/lib/mutations/survey.mutation';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { MutationButton } from '../MutationButton';
import { LoadingSpan } from '../LoadingSpan';
import { commafy } from '@/lib/helpers';

export const RunSurveyTargetReports: FC<ISurveyReportTarget> = ({ surveyId }) => {
  const {
    action: getAgentsTarget,
    loading: loadingAgentsTarget,
    data: agentsTarget,
  } = GQLMutation({
    mutation: M_SURVEY_REPORT_AGENTS_TARGET,
    resolver: 'surveyReportAgentsTarget',
    toastmsg: true,
  });
  const {
    action: upsert,
    loading: upserting,
    data: upserted,
  } = GQLMutation({
    mutation: SURVEY_REPORT_TARGET_CREATE,
    resolver: 'surveyReportTargetCreate',
    toastmsg: true,
  });

  const [totalTarget, setTotalTarget] = useState<number>(0);
  const [totalFilled, setTotalFilled] = useState<number>(0);
  const [targets, setTargets] = useState<IAgentTarget[]>([]);
  const [bulkFill, setBulkFill] = useState<boolean>(false);

  const loadAgentsTarget = () => {
    if (surveyId) getAgentsTarget({ variables: { input: { surveyId } } });
  };
  const handleUpsert = () => {
    if (surveyId && targets.length) {
      const t: IAgentTarget[] = [];

      for (let i = 0; i < targets.length; i++) {
        t.push({ agentId: targets[i].agentId, target: targets[i].target });
      }

      upsert({ variables: { input: { surveyId, targets: t } } });
    }
  };
  const handleChange = (agentId: string, event: any) => {
    const _curr: IAgentTarget[] = [...targets];

    let _totalTarget = 0;

    for (let i = 0; i < _curr.length; i++) {
      if (bulkFill) {
        _curr[i].target = parseInt(event.target.value) | 0;
      } else {
        if (_curr[i].agentId === agentId) {
          const newTarget = parseInt(event.target.value) | 0;

          _curr[i].target =
            newTarget < (_curr[i]._filled as number) ? (_curr[i]._filled as number) : newTarget;
        }
      }

      _totalTarget += _curr[i].target;
    }

    setTargets(_curr);
    setTotalTarget(_totalTarget);
  };

  useEffect(() => loadAgentsTarget(), [upserted]);
  useEffect(() => {
    if (agentsTarget?.rows) {
      const _targets: IAgentTarget[] = [];

      let _totalTarget = 0;
      let _totalFilled = 0;

      for (let i = 0; i < agentsTarget.rows.length; i++) {
        _targets.push({
          agentId: agentsTarget.rows[i].agent?.id,
          target: agentsTarget.rows[i].target,
          _filled: agentsTarget.rows[i].filled,
          _agent: agentsTarget.rows[i].agent,
        });

        _totalTarget += parseInt(agentsTarget.rows[i].target);
        _totalFilled += parseInt(agentsTarget.rows[i].filled);
      }

      setTargets(_targets);
      setTotalTarget(_totalTarget);
      setTotalFilled(_totalFilled);
    }
  }, [agentsTarget?.rows]);

  return (
    <>
      <div className="card border">
        <div className="card-body pb-0">
          <div className="row mb-2">
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-6">Target Reports</dt>
                <dd className="col-sm-6">
                  <span className="font-16 text-warning">{commafy(totalTarget)}</span>
                </dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-6">Submitted Reports</dt>
                <dd className="col-sm-6">
                  <span className="font-16 text-success">{commafy(totalFilled)}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            <span className="text-muted">Targets</span>

            {loadingAgentsTarget ? <LoadingSpan /> : undefined}

            <span className="float-end">
              <div className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="bulkFill"
                  onClick={() => setBulkFill(!bulkFill)}
                />
                <label className="form-check-label" htmlFor="bulkFill" style={{ marginTop: '3px' }}>
                  Bulk Fill
                </label>
              </div>
            </span>
          </h5>

          <hr className="mt-0 mb-1" />

          <div className="mb-2">
            {targets?.map((target: any, index: number) => (
              <div key={`allocation-${index}`}>
                <dl className="row mb-0">
                  <dt className="col-sm-8">
                    <span className="me-2">{index + 1}.</span>
                    <Image
                      className="me-2 mt-1 mb-1"
                      src={sourceImage(target._agent?.user?.profile?.photo)}
                      loader={() => sourceImage(target._agent?.user?.profile?.photo)}
                      alt=""
                      width={TABLE_IMAGE_WIDTH}
                      height={TABLE_IMAGE_HEIGHT}
                    />
                    {target._agent?.user?.name}
                  </dt>

                  <dd className="col-sm-4">
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control form-control-sm font-14"
                        disabled={true}
                        placeholder={`Submitted: ${target._filled}`}
                      />
                      <input
                        type="number"
                        className="form-control form-control-sm font-14"
                        min={target._filled}
                        value={target.target}
                        onChange={(e) => handleChange(target._agent?.id, e)}
                      />
                    </div>
                  </dd>
                </dl>

                <hr className="mt-0 mb-1" />
              </div>
            ))}
          </div>

          <MutationButton
            type="button"
            size="sm"
            label="Save"
            icon="mdi mdi-refresh"
            className="float-end"
            loading={upserting}
            onClick={handleUpsert}
          />
        </div>
      </div>
    </>
  );
};
