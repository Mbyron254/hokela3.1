'use client';

import { GQLMutation } from 'src/lib/client';
import { agentContext } from 'src/lib/helpers';
import { InputAgentKYC } from 'src/lib/interface/auth.interface';
import {
  IAgentOriginContext,
  IManageAgentKYC,
} from 'src/lib/interface/general.interface';
import { M_AGENT, M_AGENT_UPDATE_ALIEN } from 'src/lib/mutations/agent.mutation';
import { useEffect, useState } from 'react';
import { MutationButton } from '../MutationButton';
import { streamFileDownload } from 'src/lib/download';
import { Card, CardContent, FormControlLabel, Checkbox, TextField, Button, Stack, Typography } from '@mui/material';
import { Iconify } from '../iconify';

export default function ManageAgentKYC({ agentId, phone }: IManageAgentKYC) {
  const { action: getAgent, data: agent } = GQLMutation({
    mutation: M_AGENT,
    resolver: 'agent',
    toastmsg: false,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: M_AGENT_UPDATE_ALIEN,
    resolver: 'agentUpdateAlien',
    toastmsg: true,
  });

  const [context, setContext] = useState<IAgentOriginContext>();
  const [input, setInput] = useState<InputAgentKYC>({
    id: undefined,
    nationalIdNo: undefined,
    lockNin: undefined,
    taxIdNo: undefined,
    lockTin: undefined,
    healthIdNo: undefined,
    lockHin: undefined,
    socialSecurityNo: undefined,
    lockSsn: undefined,
  });

  const loadAgent = () => {
    if (agentId) getAgent({ variables: { input: { id: agentId } } });
  };
  const handleUpdate = () => {
    update({ variables: { input } });
  };

  useEffect(() => loadAgent(), [agentId, updated]);
  useEffect(() => {
    if (phone) {
      setContext(agentContext(phone.substring(0, 3)));
    }
  }, [phone]);
  useEffect(() => {
    if (agent) {
      setInput({
        id: agent?.id,
        nationalIdNo: agent?.nationalIdNo,
        lockNin: agent?.lockNin,
        taxIdNo: agent?.taxIdNo,
        lockTin: agent?.lockTin,
        healthIdNo: agent?.healthIdNo,
        lockHin: agent?.lockHin,
        socialSecurityNo: agent?.socialSecurityNo,
        lockSsn: agent?.lockSsn,
      });
    }
  }, [agent]);

  const renderIdField = (
    title: string | undefined,
    abbreviation: string | undefined,
    value: string | undefined,
    fileId: string | undefined,
    isLocked: boolean | undefined,
    onValueChange: (value: string) => void,
    onLockChange: () => void
  ) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pt: 2, pb: '8px !important' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {title ? `${title} Number` : ''}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            onClick={() => { console.log(fileId);/*streamFileDownload(fileId || '');*/ }}
            startIcon={<Iconify icon="mdi:cloud-download" />}
          />
          <TextField
            fullWidth
            size="small"
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLocked || false}
              onChange={onLockChange}
              size="small"
            />
          }
          label={`Lock ${abbreviation || ''} upload by agent`}
        />
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={2}>
      {renderIdField(
        context?.nin.title,
        context?.nin.abbreviation,
        input.nationalIdNo,
        agent?.nin?.id,
        input.lockNin,
        (value) => setInput({ ...input, nationalIdNo: value }),
        () => setInput({ ...input, lockNin: !input.lockNin })
      )}

      {renderIdField(
        context?.tin.title,
        context?.tin.abbreviation,
        input.taxIdNo,
        agent?.tin?.id,
        input.lockTin,
        (value) => setInput({ ...input, taxIdNo: value }),
        () => setInput({ ...input, lockTin: !input.lockTin })
      )}

      {renderIdField(
        context?.hin.title,
        context?.hin.abbreviation,
        input.healthIdNo,
        agent?.hin?.id,
        input.lockHin,
        (value) => setInput({ ...input, healthIdNo: value }),
        () => setInput({ ...input, lockHin: !input.lockHin })
      )}

      {renderIdField(
        context?.ssn.title,
        context?.ssn.abbreviation,
        input.socialSecurityNo,
        agent?.ssn?.id,
        input.lockSsn,
        (value) => setInput({ ...input, socialSecurityNo: value }),
        () => setInput({ ...input, lockSsn: !input.lockSsn })
      )}

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          disabled={updating}
          onClick={handleUpdate}
          startIcon={<Iconify icon="mdi:refresh" />}
        >
          Update
        </Button>
      </Stack>
    </Stack>
  );
}