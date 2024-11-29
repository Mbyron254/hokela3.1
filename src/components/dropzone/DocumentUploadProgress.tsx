'use client';

import type { FC } from 'react';
import type { AxiosRequestConfig } from 'axios';
import type { IUploadState, IDocumentUploadProgress } from 'src/lib/interface/dropzone.type';

import axios from 'axios';
import { useRef, useState, useEffect } from 'react';

import { Box, Typography, LinearProgress } from '@mui/material';

import {
  SERVER_HOST_DEV,
  SERVER_HOST_PRO,
  HEADER_KEY_CLIENT,
  HEADER_VAL_CLIENT,
} from 'src/lib/constant';

import { DocumentHeader } from './DocumentHeader';

export const DocumentUploadProgress: FC<IDocumentUploadProgress> = (props) => {
  const uploadRef = useRef(false);

  const { file, onDelete, onUpload, hideProgressBar } = props;

  const [state, setState] = useState<IUploadState>({
    progress: 0,
    uploaded: 0,
  });

  useEffect(() => {
    const upload = async () => {
      const meta = await uploadFile(file, state, setState);

      onUpload(file, meta);
    };

    if (uploadRef.current) return;

    uploadRef.current = true;
    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.name]);

  const uploadFile = async (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    uploadFile: File,
    uploadState: IUploadState,
    onStateChange: (currentState: IUploadState) => void
  ) => {
    const config: AxiosRequestConfig = {
      headers: {
        [HEADER_KEY_CLIENT]: HEADER_VAL_CLIENT,
      },
      onUploadProgress(event: any) {
        const progress = Math.round((event.loaded * 100) / event.total);
        onStateChange({
          ...uploadState,
          progress,
          uploaded: event.loaded,
        });
      },
    };
    const formData = new FormData();

    formData.append('file', uploadFile);

    try {
      let url: string;

      switch (process.env.NODE_ENV) {
        case 'development':
          url = `${SERVER_HOST_DEV}/document/u-local`;
          break;
        case 'production':
          url = `${SERVER_HOST_PRO}/document/u-space`;
          break;
        default:
          url = `${SERVER_HOST_PRO}/document/u-space`;
      }
      return (await axios.post(url, formData, config))?.data;
    } catch (error) {
      console.log('~~~~~~~~~~~~~ FILE UPLOAD ERROR ~~~~~~~~~~~~~');
      console.log(error);
      return null;
    }
  };
  if (hideProgressBar) return null;
  return (
    <Box sx={{ mt: 2 }}>
      <DocumentHeader file={file} uploaded={state.uploaded} onDelete={onDelete} />

      <Box sx={{ width: '100%', my: 1 }}>
        <LinearProgress
          variant="determinate"
          value={state.progress}
          color={state.progress === 100 ? 'success' : 'primary'}
          sx={{
            height: 10,
            borderRadius: 1,
            '& .MuiLinearProgress-bar': {
              transition: 'transform 0.4s linear',
            },
          }}
        />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {state.progress}%
        </Typography>
      </Box>
    </Box>
  );
};

// return new Promise<string>((resolve, reject) => {
//   const xmlhttp = new XMLHttpRequest();
//   xmlhttp.open("POST", uploadURL);
//   xmlhttp.onload = () => {
//     resolve(JSON.parse(xmlhttp.responseText));
//   };
//   xmlhttp.onerror = (event) => reject(event);
//   xmlhttp.upload.onprogress = (event) => {
//     if (event.lengthComputable) {
//       const percentage = (event.loaded / event.total) * 100;
//       onStateChange({
//         ...state,
//         progress: Math.round(percentage),
//         uploaded: event.loaded,
//       });
//     }
//   };
//   const formData = new FormData();
//   formData.append("file", file);
//   xmlhttp.withCredentials = true;
//   xmlhttp.setRequestHeader(CLIENT_HEADER_KEY, "ADMIN");
//   xmlhttp.send(formData);
// });
