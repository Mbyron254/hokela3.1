'use client';

import type { FC } from 'react';
import type { IDocumentHeader } from 'src/lib/interface/dropzone.type';

import { Box, Typography, Link as MuiLink } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export const DocumentHeader: FC<IDocumentHeader> = (props) => {
  const { file, uploaded, onDelete } = props;

  return (
    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          {file.name}
        </Typography>
        {/* {uploaded ? (
          <Typography variant="body2" color="text.secondary">
            ( {parseBytes(uploaded)} / {parseBytes(file.size)} )
          </Typography>
        ) : null} */}
      </Box>
      <MuiLink
        component="button"
        color="error"
        onClick={() => onDelete(file)}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        <Iconify icon="mdi:trash-can-outline" sx={{ mr: 1 }} />
        Remove
      </MuiLink>
    </Box>
  );
};
