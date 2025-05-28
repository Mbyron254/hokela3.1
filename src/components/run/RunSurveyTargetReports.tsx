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
import { Card, CardContent, Typography, Checkbox, FormControlLabel, TextField, Button, Divider, Grid } from '@mui/material';
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
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" component="div">Target Reports</Typography>
              <Typography variant="body1" color="textSecondary">{commafy(totalTarget)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" component="div">Submitted Reports</Typography>
              <Typography variant="body1" color="textSecondary">{commafy(totalFilled)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Targets
            {loadingAgentsTarget ? <LoadingSpan /> : undefined}
            <FormControlLabel
              control={<Checkbox checked={bulkFill} onChange={() => setBulkFill(!bulkFill)} />}
              label="Bulk Fill"
              style={{ float: 'right' }}
            />
          </Typography>

          <Divider />

          <div style={{ marginTop: '16px' }}>
            {targets?.map((target: IAgentTarget, index: number) => (
              <div key={`allocation-${index}`}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="body1" component="div">
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
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      inputProps={{ min: target._filled }}
                      value={target.target}
                      onChange={(e) => handleChange(target._agent?.id, e)}
                      label={`Submitted: ${target._filled}`}
                    />
                  </Grid>
                </Grid>

                <Divider style={{ margin: '16px 0' }} />
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<i className="mdi mdi-refresh" />}
            style={{ float: 'right' }}
            disabled={upserting}
            onClick={handleUpsert}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
