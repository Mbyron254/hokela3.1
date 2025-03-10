'use client';

import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';

import { MainLayout } from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';

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
        <HomeMinimal />
      </Box>
    </MainLayout>
  );
}
