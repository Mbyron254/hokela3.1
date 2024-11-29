'use client';

import type { FC } from 'react';
import type { FileError } from 'react-dropzone';
import type { IDocumentUploadError } from 'src/lib/interface/dropzone.type';

import { Box, Typography, LinearProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { DocumentHeader } from './DocumentHeader';

export const DocumentUploadError: FC<IDocumentUploadError> = (props) => {
  const { file, errors, onDelete } = props;

  return (
    <Box sx={{ mt: 2 }}>
      <DocumentHeader file={file} onDelete={onDelete} />
      
      <Box sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={100}
          color="error"
          sx={{
            height: 10,
            bgcolor: 'error.lighter',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'error.main',
              backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
              backgroundSize: '1rem 1rem',
              animation: 'progress-bar-stripes 1s linear infinite',
            },
          }}
        />
      </Box>

      {errors.map((error: FileError, index: number) => (
        <Typography 
          key={`error_${index}`}
          color="error"
          sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center' }}
        >
          <Iconify icon="mdi:alert-circle" sx={{ mr: 1 }} />
          {error.message}
        </Typography>
      ))}
    </Box>
  );
};
