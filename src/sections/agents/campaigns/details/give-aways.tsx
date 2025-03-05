import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  campaignRunId?: string;
};

export default function GiveAways({ campaignRunId }: Props) {
  const [giveaways, setGiveaways] = useState([]);

  useEffect(() => {
    // Fetch giveaways data when API is ready
    if (campaignRunId) {
      // Add API call here
    }
  }, [campaignRunId]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
        Free Giveaway
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
          Available Items
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            🎁 Free Giveaway Coming Soon
          </Typography>
        </Box>
      </Box>
    </>
  );
}
