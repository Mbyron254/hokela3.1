import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

const LOGOS = [
  {
    title: 'The Scale We Operate In',
    logos: [
      '/assets/images/flags/Kenya.png',
      '/assets/images/flags/Tanzania.png',
      '/assets/images/flags/Uganda.png',
      '/assets/images/flags/Rwanda.png',
      '/assets/images/flags/Ethiopia.png',
      '/assets/images/flags/Kenya.png',
      '/assets/images/flags/Tanzania.png',
      '/assets/images/flags/Uganda.png',
      '/assets/images/flags/Rwanda.png',
      '/assets/images/flags/Ethiopia.png',
    ],
  },
];

// ----------------------------------------------------------------------

export function ClientsCarsl2() {
  const theme = useTheme();

  return (
    <Box>
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <Stack
            spacing={5}
            alignItems={{ xs: 'center', md: 'center' }} // Center items on both small and large screens
            direction={{ xs: 'column', md: 'row' }} // Stack vertically on small screens
            sx={{ mt: 5, color: 'common.white' }}
          >
            {LOGOS.map((brand) => (
              <Stack key={brand.title} sx={{ maxWidth: 280 }}>
                <m.div variants={varFade().in}>
                  <Typography variant="h6" gutterBottom>
                    {brand.title}
                  </Typography>
                </m.div>

                <m.div variants={varFade().inRight}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center" // Center logos on all screens
                    sx={{ width: '100%', flexWrap: 'wrap', justifyContent: 'center' }} // Ensure logos wrap and are centered
                  >
                    {brand.logos.map((logo, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={logo}
                        alt={`flag-${index}`}
                        sx={{
                          width: { xs: 50, sm: 70, md: 100 },  // Responsive width: small devices, medium, large
                          height: { xs: 30, sm: 45, md: 60 },  // Responsive height
                          objectFit: 'contain',
                        }}
                      />
                    ))}
                  </Stack>
                </m.div>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TextAnimateProps = BoxProps &
  MotionProps & {
    text: string;
  };

function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}
