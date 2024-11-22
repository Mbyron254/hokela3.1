/* eslint-disable react/display-name */
import type { MotionProps } from 'framer-motion';
import { useRef, useState, forwardRef } from 'react';
import { m, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Container from '@mui/material/Container';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme, createTheme } from '@mui/material/styles';

import { useClientRect } from 'src/hooks/use-client-rect';
import type { UseClientRectReturn } from 'src/hooks/use-client-rect';

import { stylesMode } from 'src/theme/styles';
import PRIMARY_COLOR from 'src/theme/with-settings/primary-color.json';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const customTheme = createTheme({
  palette: {
    primary: {
      lighter: '#8e99f3',
      main: '#1976d2',
      darker: '#004ba0',
      contrastText: '#ffffff',
      lighterChannel: 'rgb', // or 'hsl' or 'hsv'
      darkerChannel: 'rgb', // or 'hsl' or 'hsv'
    },
    background: {
      neutral: '#f4f6f8',
    },
    grey: {
      500: '#9e9e9e',
    },
  },
});


export function HomeHighlightFeatures({ sx, ...other }: BoxProps) {
  const containerRoot = useClientRect();

  const renderLines = (
    <>
      <FloatPlusIcon sx={{ top: 72, left: 72 }} />
      <FloatLine sx={{ top: 80, left: 0 }} />
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        pt: { xs: 10, md: 20 },
        ...sx,
      }}
      {...other}
    >
      <MotionViewport>
        {renderLines}

        <Container>
          <Stack
            ref={containerRoot.elementRef}
            spacing={5}
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <SectionTitle caption="App Features" title="Highlight" txtGradient="features" />

            <SvgIcon
              component={m.svg}
              variants={varFade({ distance: 24 }).inDown}
              sx={{ width: 28, height: 28, color: 'grey.500' }}
            >
              <path
                d="M13.9999 6.75956L7.74031 0.5H20.2594L13.9999 6.75956Z"
                fill="currentColor"
                opacity={0.12}
              />
              <path
                d="M13.9998 23.8264L2.14021 11.9668H25.8593L13.9998 23.8264Z"
                fill="currentColor"
                opacity={0.24}
              />
            </SvgIcon>
          </Stack>
        </Container>
      </MotionViewport>

      <ScrollContent containerRoot={containerRoot} />
    </Box>
  );
}

// ----------------------------------------------------------------------

const StyledRoot = styled(
  forwardRef((props: BoxProps & MotionProps, ref) => <Box ref={ref} component={m.div} {...props} />)
)(({ theme }) => ({
  zIndex: 9,
  position: 'relative',
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: { paddingTop: theme.spacing(8) },
}));

const StyledContainer = styled((props: MotionProps & Omit<BoxProps, 'style'>) => (
  <Box component={m.div} {...props} />
))(({ theme }) => ({
  top: 0,
  height: '100vh',
  display: 'flex',
  position: 'sticky',
  overflow: 'hidden',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: theme.transitions.create(['background-color']),
  '&[data-scrolling="true"]': { justifyContent: 'center' },
}));

const StyledContent = styled(
  forwardRef((props: BoxProps & MotionProps, ref) => (
    <Box ref={ref} component={m.div} transition={{ ease: 'linear', duration: 0.25 }} {...props} />
  ))
)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(5),
  paddingLeft: theme.spacing(3),
  transition: theme.transitions.create(['margin-left', 'margin-top']),
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(8),
    paddingLeft: theme.spacing(0),
  },
}));

// ----------------------------------------------------------------------

type ScrollContentProps = {
  containerRoot: UseClientRectReturn;
};

function ScrollContent({ containerRoot }: ScrollContentProps) {
  const theme = useTheme();

  const containerRef = useRef(null);
  const containeRect = useClientRect(containerRef);

  const scrollRef = useRef(null);
  const scrollRect = useClientRect(scrollRef);

  const { scrollYProgress } = useScroll({ target: containerRef });

  const [startScroll, setStartScroll] = useState(false);

  const physics = { damping: 16, mass: 0.12, stiffness: 80 };

  const scrollRange = -scrollRect.scrollWidth + containeRect.width / 2;

  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, scrollRange]), physics);

  const background = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.48, 0.58, 0.62, 0.72, 0.92],
    [
      `transparent`,
      `linear-gradient(180deg, ${customTheme.palette.primary.light ?? '#ffffff'}, ${customTheme.palette.primary.dark ?? '#000000'})`,
      `linear-gradient(180deg, ${PRIMARY_COLOR.cyan.light}, ${PRIMARY_COLOR.cyan.dark})`,
      `linear-gradient(180deg, ${PRIMARY_COLOR.purple.light}, ${PRIMARY_COLOR.purple.dark})`,
      `linear-gradient(180deg, ${PRIMARY_COLOR.blue.light}, ${PRIMARY_COLOR.blue.dark})`,
      `linear-gradient(180deg, ${PRIMARY_COLOR.orange.light}, ${PRIMARY_COLOR.orange.dark})`,
      `linear-gradient(180deg, ${PRIMARY_COLOR.red.light}, ${PRIMARY_COLOR.red.dark})`,
      `linear-gradient(180deg, ${customTheme.palette.background.neutral ?? '#f4f6f8'}, ${customTheme.palette.background.neutral ?? '#f4f6f8'})`,
    ]
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setStartScroll(latest !== 0 && latest !== 1);
  });

  return (
    <StyledRoot ref={containerRef} sx={{ height: scrollRect.scrollWidth, minHeight: '100vh' }}>
      <StyledContainer style={{ background }} data-scrolling={startScroll}>
        <StyledContent ref={scrollRef} style={{ x }} layout sx={{ ml: `${containerRoot.left}px` }}>
          {ITEMS.map((item) => (
            <Item key={item.title} item={item} />
          ))}
        </StyledContent>
      </StyledContainer>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: (typeof ITEMS)[number];
};

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box sx={{ flexShrink: 0, ...sx }} {...other}>
      <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
        <Iconify width={28} icon={item.icon} sx={{ mt: '10px' }} />
        <Stack spacing={2}>
          <Typography variant="h3">{item.title}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{item.subtitle}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={{ xs: 5, md: 8 }}>
        {item.imgUrl.map((url) => (
          <Box
            key={url}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: (theme) =>
                theme?.palette
                  ? `-40px 40px 80px 0px ${alpha(theme.palette.grey[500], 0.16)}`
                  : 'none',
              [stylesMode.dark]: {
                boxShadow: (theme) =>
                  theme?.palette
                    ? `-40px 40px 80px 0px ${alpha(theme.palette.grey[500], 0.3)}`
                    : 'none',
              },
            }}
          >
            <img alt={item.title} src={url} style={{ width: '100%', height: 'auto' }} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// Define your ITEMS array here



// ----------------------------------------------------------------------

const ITEMS = [
  {
    title: 'Management',
    subtitle: 'Provide Effective Management System',
    icon: 'carbon:screen',
    imgUrl: ['https://zone-assets-api.vercel.app/assets/images/home/management_1.jpg'],
  },
  {
    title: 'CRM & Collaboration',
    subtitle: 'Enable Communications With Clients',
    icon: 'carbon:devices',
    imgUrl: ['https://zone-assets-api.vercel.app/assets/images/home/crm.jpg'],
  },
];
