'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ComingSoonIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function ComingSoonView() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Coming soon!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          We are currently working hard on this page!
        </Typography>

        <ComingSoonIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------
