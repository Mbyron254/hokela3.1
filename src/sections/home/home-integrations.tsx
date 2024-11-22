import { m } from 'framer-motion';
 
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2'; // Import Button from MUI
import type { BoxProps } from '@mui/material/Box';

// 
import { varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatDotIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomeIntegrations({ sx, ...other }: BoxProps) {
  const renderLines = (
    <>
      <Stack
        spacing={8}
        alignItems="center"
        sx={{
          top: 64,
          left: 80,
          zIndex: 2,
          bottom: 64,
          position: 'absolute',
          transform: 'translateX(-7px)',
          '& span': { position: 'static', opacity: 0.12 },
        }}
      >
        <FloatDotIcon />
        <FloatDotIcon sx={{ opacity: 0.24, width: 14, height: 14 }} />
        <Box sx={{ flexGrow: 1 }} />
        <FloatDotIcon sx={{ opacity: 0.24, width: 14, height: 14 }} />
        <FloatDotIcon />
      </Stack>
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );

  const renderDescription = (
    <SectionTitle
      caption="Clients"
      title="Helping you move forward"
      txtGradient="digitally."
      description={
        <>
          <Box component="span" sx={{ mb: 1, display: 'block' }}>
            We are partnered with leading brands and organizations.
          </Box>
          <Box
            component="span"
            sx={{ fontStyle: 'italic', color: 'text.disabled', typography: 'caption' }}
          >
            * We offer support.
            <br />* We offer free training for first-time clients.
          </Box>
        </>
      }
      sx={{ textAlign: { xs: 'center', md: 'left' } }}
    />
  );

  const renderImg = (
    <Box
      component={m.img}
      variants={{ ...varScale().in, initial: { scale: 0.8, opacity: 0 } }}
      alt="Integration"
      src="/assets/illustrations/illustration-dashboard.webp"
      sx={{ width: 420, objectFit: 'cover', aspectRatio: '1/1' }}
    />
  );

  return (
    <Box component="section" sx={{ pt: 10, position: 'relative', ...sx }} {...other}>
      <MotionViewport>
        {renderLines}

        <Container>
          <Grid disableEqualOverflow container spacing={{ xs: 5, md: 8 }}>
            <Grid xs={12} md={6} lg={5}>
              {renderDescription}
              {/* Add the button here */}
              <Button 
                variant="contained" 
                color="primary" 
                href="/clients" // Link to the clients page
                sx={{ mt: 2 }} // Margin top for spacing
              >
                View Clients
              </Button>
            </Grid>

            <Grid xs={12} md={6} lg={7} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              {renderImg}
            </Grid>
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}
