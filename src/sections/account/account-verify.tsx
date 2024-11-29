import type { IDocumentWrapper } from 'src/lib/interface/dropzone.type';
import type { IAgentOriginContext } from 'src/lib/interface/general.interface';

import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography, CardContent } from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import { agentContext } from 'src/lib/helpers';
import { M_AGENT_UPDATE_SELF } from 'src/lib/mutations/agent.mutation';

import { DropZone } from 'src/components/dropzone/DropZone';

export default function AccountVerification({ agent }: { agent: any }) {
  const [context, setContext] = useState<IAgentOriginContext>();
  const [documentsNin, setDocumentsNin] = useState<IDocumentWrapper[]>([]);
  const [documentsTin, setDocumentsTin] = useState<IDocumentWrapper[]>([]);
  const [documentsHin, setDocumentsHin] = useState<IDocumentWrapper[]>([]);
  const [documentsSsn, setDocumentsSsn] = useState<IDocumentWrapper[]>([]);

  const { action: update, loading: updating } = GQLMutation({
    mutation: M_AGENT_UPDATE_SELF,
    resolver: 'agentUpdateSelf',
    toastmsg: true,
  });

  const handleUpdate = (_key: string, _value: string) => {
    update({ variables: { input: { [_key]: _value } } });
  };

  useEffect(() => {
    if (agent?.phone) {
      setContext(agentContext(agent.phone.substring(0, 3)));
    }
  }, [agent?.phone]);

  useEffect(() => {
    if (documentsNin?.length) {
      handleUpdate('ninId', documentsNin[documentsNin.length - 1].meta?.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentsNin]);

  useEffect(() => {
    if (documentsTin?.length) {
      handleUpdate('tinId', documentsTin[documentsTin.length - 1].meta?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentsTin]);

  useEffect(() => {
    if (documentsHin?.length) {
      handleUpdate('hinId', documentsHin[documentsHin.length - 1].meta?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentsHin]);

  useEffect(() => {
    if (documentsSsn?.length) {
      handleUpdate('ssnId', documentsSsn[documentsSsn.length - 1].meta?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentsSsn]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Identity Verification (KYC)</Typography>

          {updating && (
            <LoadingButton loading variant="contained">
              Uploading
            </LoadingButton>
          )}

          {!agent?.lockNin && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                {!agent?.nin?.originalName && (
                  <>Please upload the latest copy of your {context?.nin?.title}</>
                )}
              </Typography>
              <DropZone
                name={`Copy of your ${context?.nin?.title}`}
                classes="dropzone text-center mt-2 mb-2"
                acceptedImageTypes={['.png', '.jpeg', '.jpg', '.ico', '.pdf']}
                maxSize={1375000000}
                multiple={false}
                hideProgressBar={false}
                files={documentsNin}
                setFiles={setDocumentsNin}
                reference="ninId"
              />
              {agent?.nin?.originalName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {agent.nin.originalName}
                </Typography>
              )}
            </div>
          )}

          {!agent?.lockTin && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                {!agent?.tin?.originalName && (
                  <>Please upload the latest copy of your {context?.tin?.title}</>
                )}
              </Typography>
              <DropZone
                name={`Copy of your ${context?.tin?.title}`}
                classes="dropzone text-center mt-2 mb-2"
                acceptedImageTypes={['.png', '.jpeg', '.jpg', '.ico', '.pdf']}
                maxSize={1375000000}
                multiple={false}
                hideProgressBar={false}
                files={documentsTin}
                setFiles={setDocumentsTin}
                reference="tinId"
              />
              {agent?.tin?.originalName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {agent.tin.originalName}
                </Typography>
              )}
            </div>
          )}

          {!agent?.lockHin && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                {!agent?.hin?.originalName && (
                  <>Please upload the latest copy of your {context?.hin?.title}</>
                )}
              </Typography>
              <DropZone
                name={`Copy of your ${context?.hin?.title}`}
                classes="dropzone text-center mt-2 mb-2"
                acceptedImageTypes={['.png', '.jpeg', '.jpg', '.ico', '.pdf']}
                maxSize={1375000000}
                multiple={false}
                hideProgressBar={false}
                files={documentsHin}
                setFiles={setDocumentsHin}
                reference="hinId"
              />
              {agent?.hin?.originalName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {agent.hin.originalName}
                </Typography>
              )}
            </div>
          )}

          {!agent?.lockSsn && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                {!agent?.ssn?.originalName && (
                  <>Please upload the latest copy of your {context?.ssn?.title}</>
                )}
              </Typography>
              <DropZone
                name={`Copy of your ${context?.ssn?.title}`}
                classes="dropzone text-center mt-2 mb-2"
                acceptedImageTypes={['.png', '.jpeg', '.jpg', '.ico', '.pdf']}
                maxSize={1375000000}
                multiple={false}
                hideProgressBar={false}
                files={documentsSsn}
                setFiles={setDocumentsSsn}
                reference="ssnId"
              />
              {agent?.ssn?.originalName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {agent.ssn.originalName}
                </Typography>
              )}
            </div>
          )}

          <div>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Current Status
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2">
                {context?.nin?.title}: {agent?.nationalIdNo || '-'}
              </Typography>
              <Typography variant="body2">
                {context?.tin?.title}: {agent?.taxIdNo || '-'}
              </Typography>
              <Typography variant="body2">
                {context?.hin?.title}: {agent?.healthIdNo || '-'}
              </Typography>
              <Typography variant="body2">
                {context?.ssn?.title}: {agent?.socialSecurityNo || '-'}
              </Typography>
            </Stack>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
