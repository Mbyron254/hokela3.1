'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { IAgentTarget, ISurveyReportTarget } from 'src/lib/interface/general.interface';
import { GQLMutation } from 'src/lib/client';
import {
  M_SURVEY_REPORT_AGENTS_TARGET,
  SURVEY_REPORT_TARGET_CREATE,
} from 'src/lib/mutations/survey.mutation';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { sourceImage } from 'src/lib/server';
import { commafy } from 'src/lib/helpers';
import { MutationButton } from '../MutationButton';
import { LoadingSpan } from '../LoadingSpan';

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

  const handleUpsert = () => {
    if (surveyId && targets.length) {
      const t: IAgentTarget[] = [];

      for (let i = 0; i < targets.length; i+=1) {
        t.push({ agentId: targets[i].agentId, target: targets[i].target });
      }

      upsert({ variables: { input: { surveyId, targets: t } } });
    }
  };
  const handleChange = (agentId: string, event: any) => {
    const _curr: IAgentTarget[] = [...targets];

    let _totalTarget = 0;

    for (let i = 0; i < _curr.length; i+=1) {
      if (bulkFill) {
        _curr[i].target = parseInt(event.target.value, 10) || 0;
      } else if (_curr[i].agentId === agentId) {
          const newTarget = parseInt(event.target.value, 10) || 0;

          _curr[i].target =
            newTarget < (_curr[i]._filled as number) ? (_curr[i]._filled as number) : newTarget;
        
      }

      _totalTarget += _curr[i].target;
    }

    setTargets(_curr);
    setTotalTarget(_totalTarget);
  };

  useEffect(() => {
    if (surveyId) getAgentsTarget({ variables: { input: { surveyId } } });
  }, [surveyId, getAgentsTarget]);
  useEffect(() => {
    if (agentsTarget?.rows) {
      const _targets: IAgentTarget[] = [];

      let _totalTarget = 0;
      let _totalFilled = 0;

      for (let i = 0; i < agentsTarget.rows.length; i+=1) {
        _targets.push({
          agentId: agentsTarget.rows[i].agent?.id,
          target: agentsTarget.rows[i].target,
          _filled: agentsTarget.rows[i].filled,
          _agent: agentsTarget.rows[i].agent,
        });

        _totalTarget += parseInt(agentsTarget.rows[i].target, 10);
        _totalFilled += parseInt(agentsTarget.rows[i].filled, 10);
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
                <p className="form-check-label" style={{ marginTop: '3px' }}>
                  Bulk Fill
                </p>
              </div>
            </span>
          </h5>

          <hr className="mt-0 mb-1" />

          <div className="mb-2">
            {targets?.map((target: IAgentTarget, index: number) => (
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
                        disabled
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
