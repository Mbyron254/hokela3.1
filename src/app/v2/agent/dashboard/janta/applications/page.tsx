'use client'

import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useRouter } from 'src/routes/hooks';
import { Button,Typography } from '@mui/material';

export default function Page() {
  const router = useRouter()
  const applications: any[] = [];

  function ApplicationItem({ application, onView }: { application: any, onView: () => void }) {
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

  const handleView = useCallback(
    (id: string) => {
      router.push(`/v2/agent/dashboard/janta/${id}`);
    },
    [router]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {applications.map((application) => (
          <ApplicationItem
            key={application.id}
            application={application}
            onView={() => handleView(application.id)}
          />
        ))}
      </Box>

      {applications.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
