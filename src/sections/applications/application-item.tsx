import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type ApplicationItemProps = {
  application: {
    id: string;
    name: string;
    // Add other relevant fields here
  };
  onView: () => void;
};

export function ApplicationItem({ application, onView }: ApplicationItemProps) {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Typography variant="h6">{application.name}</Typography>
      {/* Add other application details here */}
      <Button variant="contained" color="primary" onClick={onView}>
        View
      </Button>
    </Box>
  );
} 