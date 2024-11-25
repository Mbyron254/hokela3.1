import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import { varFade, MotionContainer } from 'src/components/animate';

import { SectionTitle } from './components/section-title';

const COUNTRIES = [
  {
    title: ' ',
    flags: [
      '/assets/images/flags/Kenya.png',
      '/assets/images/flags/Tanzania.png',
      '/assets/images/flags/Uganda.png',
      '/assets/images/flags/Rwanda.png',
      '/assets/images/flags/Ethiopia.png',
    ],
  },
];

export default function ClientsHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
        }),
        py: { xs: 10, md: 8 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="text.secondary">
          HOKELA INTERACTIVE
        </Typography>

        <SectionTitle
            title="Scale we operate"
            txtGradient="in"
            sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}
        />

        <Stack
          spacing={5}
          alignItems="center"
          justifyContent="center"
          sx={{ color: 'common.white', textAlign: 'center' }}
        >
          {COUNTRIES.map((country) => (
            <Stack key={country.title} alignItems="center">
              <m.div variants={varFade().in}>
                <Typography variant="h6" gutterBottom>
                  {country.title}
                </Typography>
              </m.div>

              <m.div variants={varFade().inRight}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {country.flags.map((flag, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={flag}
                      alt={`flag-${index}`}
                      sx={{
                        width: { xs: 50, sm: 70, md: 100 },
                        height: { xs: 30, sm: 45, md: 60 },
                        objectFit: 'contain',
                      }}
                    />
                  ))}
                </Stack>
              </m.div>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

type TextAnimateProps = BoxProps & MotionProps & {
  text: string;
};

function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h3',
        fontWeight: 700,
        display: 'inline-flex',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      {text.split(' ').map((word, index) => (
        <m.span key={index} variants={variants || varFade().inUp} style={{ marginRight: 4 }}>
          {word}
        </m.span>
      ))}
    </Box>
  );
}
