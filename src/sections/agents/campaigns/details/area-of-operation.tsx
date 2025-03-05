import { useState } from 'react';

import { Box, alpha, Typography } from '@mui/material';

type Props = {
  campaignRunId?: string;
};

export default function AreaOfOperation({ campaignRunId }: Props) {
  const [viewMode, setViewMode] = useState('list');
  const [showMapNewShop, setShowMapNewShop] = useState(false);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
        Area of Operation Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          Quick Stats
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {/* Quick stats boxes */}
          <Box
            sx={{
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
            }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main' }}>
              Total Shops Visited
            </Typography>
            <Typography variant="h4">0</Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
              borderRadius: 2,
            }}
          >
            <Typography variant="overline" sx={{ color: 'success.main' }}>
              Distance Covered
            </Typography>
            <Typography variant="h4">0 km</Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
              borderRadius: 2,
            }}
          >
            <Typography variant="overline" sx={{ color: 'info.main' }}>
              Time in Field
            </Typography>
            <Typography variant="h4">0 hrs</Typography>
          </Box>
        </Box>
      </Box>

      {/* Rest of the Area of Operation content */}
      {/* ... Copy the shops visited section ... */}
    </>
  );
}
