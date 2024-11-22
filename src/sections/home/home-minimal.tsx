import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import FaqsCategory from 'src/sections/faqs/faqs-category-copy';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: ' /assets/icons/home/ic_make_brand.svg',
    title: 'Merchandising',
    description: 'Help get you product to your target right client.',
  },
  {
    icon: ' /assets/icons/home/ic_design.svg',
    title: 'Sales',
    description:
      "With a seamless point of sale, you can track you sales and get analytical view of company's performance ",
  },
  {
    icon: ' /assets/icons/home/ic_development.svg',
    title: 'Inventory Management',
    description: 'Track your inventory, with real time data.',
  },
];

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            Hokela Interactive
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            All the features you need  <br /> in one place.
          </Typography>
         
        </m.div>
        <Typography sx={{ color: 'text.secondary' }}>
            We offer packages consisting of various complete services, <br />Choose acording to your needs. 
          </Typography>
      </Stack>
      
      <FaqsCategory />
      {/* <AboutWhat/> */}
      
    </Container>
  );
}
