'use client';

import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';

import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
// import { HomeFAQs } from '../home-faqs';
import HomeMinimal from '../home-minimal';
// Clients
// import ClientsHero from '../clients/clients-hero';
// import HomeForDesigner from '../home-for-designer';
// import HomeAdvertisement from '../home-advertisement';
// import { HomeTestimonials } from '../home-testimonials';
// import { ClientsBrands } from '../clients/clients-brands';
// import { ClientsIndustries } from '../clients/clients-industries';

// ----------------------------------------------------------------------

// type StyledPolygonProps = {
//   anchor?: 'top' | 'bottom';
// };

// const StyledPolygon = styled('div')<StyledPolygonProps>(({ anchor = 'top', theme }) => ({
//   left: 0,
//   zIndex: 9,
//   height: 80,
//   width: '100%',
//   position: 'absolute',
//   clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
//   backgroundColor: theme.palette.background.default,
//   display: 'block',
//   lineHeight: 0,
//   ...(anchor === 'top' && {
//     top: -1,
//     transform: 'scale(-1, -1)',
//   }),
//   ...(anchor === 'bottom' && {
//     bottom: -1,
//     backgroundColor: theme.palette.grey[900],
//   }),
// }));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  // console.log(generateShortUniqueId("BRISK")+ "002", "UNIQUE ID")
  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        
        {/* <ClientsHero />
        <ClientsBrands />
        <ClientsIndustries /> */}

        <HomeMinimal />
        {/* <HomeIntegrations /> */}

        {/* <HomeForDesigner /> */}
        {/* <HomePricing /> */}

        {/* <HomeTestimonials /> */}
        {/* <HomeFAQs /> */}
        {/* <HomeAdvertisement /> */}

        {/* <HomeHighlightFeatures /> */}

        {/* <HomeHugePackElements /> */}

        {/* <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box> */}

        {/* <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricing />

        <HomeLookingFor />

        <HomeAdvertisement /> */}
      </Box>
    </MainLayout>
  );
}