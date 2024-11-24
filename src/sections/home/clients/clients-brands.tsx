import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/system';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import type { BoxProps } from '@mui/material/Box';

import { _mock } from 'src/_mock';

import { Carousel } from 'src/components/carousel-old/carousel';
import { varFade, MotionViewport } from 'src/components/animate';
import { useCarousel } from 'src/components/carousel-old/hooks/use-carousel';
import { carouselBreakpoints } from 'src/components/carousel-old/breakpoints';
import { CarouselDotButtons } from 'src/components/carousel-old/components/carousel-dot-buttons';
import { CarouselArrowBasicButtons } from 'src/components/carousel-old/components/carousel-arrow-buttons';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function ClientsBrands({ sx, ...other }: BoxProps) {
    const [slidesToShow, setSlidesToShow] = useState<number | undefined>(undefined);

    const renderLines = (
        <>
            <Stack
                spacing={8}
                alignItems="center"
                sx={{ top: 64, left: 80, position: 'absolute', transform: 'translateX(-15px)' }}
            >
                <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
                <FloatTriangleDownIcon sx={{ width: 30, height: 15, opacity: 0.24, position: 'static' }} />
            </Stack>
            <FloatLine vertical sx={{ top: 0, left: 80 }} />
        </>
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateSlidesToShow = () => {
                const width = window.innerWidth;

                if (width < 768) {
                    setSlidesToShow(2); // Show 1 slide for mobile devices
                } else if (width < 992) {
                    setSlidesToShow(3);
                } else if (width < 1200) {
                    setSlidesToShow(4);
                } else {
                    setSlidesToShow(6);
                }
            };

            updateSlidesToShow();
            window.addEventListener('resize', updateSlidesToShow);

            // Cleanup on unmount
            return () => window.removeEventListener('resize', updateSlidesToShow);
        }

        return undefined;
    }, []);

    const carousel = useCarousel({
        align: 'center', // Center the slides
        slidesToShow,
        breakpoints: {
            [carouselBreakpoints.sm]: { slideSpacing: '4px' },
            [carouselBreakpoints.md]: { slideSpacing: '10px' },
        },
    });

    const renderDescription = (
        <SectionTitle
            caption="Our Clients"
            title="Brands we have"
            txtGradient="grown"
            sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}
        />
    );

    const horizontalDivider = (position: 'top' | 'bottom') => (
        <Divider
            component="div"
            sx={{
                width: 1,
                opacity: 0.16,
                height: '1px',
                border: 'none',
                position: 'absolute',
                background: (theme) =>
                    `linear-gradient(to right, ${alpha(theme.palette.grey[500], 0)} 0%, ${theme.palette.grey[500]} 50%, ${alpha(
                        theme.palette.grey[500],
                        0
                    )} 100%)`,
                ...(position === 'top' && { top: 0 }),
                ...(position === 'bottom' && { bottom: 0 }),
            }}
        />
    );

    const renderContent = (
        <Stack sx={{ position: 'relative', py: { xs: 1, md: 2 }, textAlign: 'center' }}>
            {horizontalDivider('top')}

            <Carousel carousel={carousel} sx={{ justifyContent: 'center', alignItems: 'center', mx: 'auto' }}>
                {BRANDS.map((item) => (
                    <Stack
                        key={item.id}
                        component={m.div}
                        variants={varFade().in}
                        sx={{ textAlign: 'center', mx: 'auto', justifyContent: 'center', alignItems: 'center' }} // Center logos
                    >
                        {/* Make images responsive and centered */}
                        <Box
                            component="img"
                            src={item.image}
                            alt={item.category}
                            sx={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'contain',
                                borderRadius: 2,
                                mb: 2,
                                mx: 'auto', // Ensure image is centered
                            }}
                        />
                        <Stack spacing={1} sx={{ typography: 'subtitle2', mx: 'auto', textAlign: 'center' }}>
                            {item.category}
                        </Stack>
                    </Stack>
                ))}
            </Carousel>

            {/* Center the dot buttons */}
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: { xs: 2, md: 3 }, mx: 'auto' }}>
                <CarouselDotButtons
                    variant="rounded"
                    scrollSnaps={carousel?.dots?.scrollSnaps}
                    selectedIndex={carousel?.dots?.selectedIndex}
                    onClickDot={carousel?.dots?.onClickDot}
                />
            </Stack>

            {/* Adjust arrow buttons as well */}
           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: { xs: 1, md: 2 } }}>
  <CarouselArrowBasicButtons
    onClickNext={carousel.arrows.onClickNext}  // Correct handler for the 'next' button
    onClickPrev={carousel.arrows.onClickPrev}  // Correct handler for the 'prev' button
    options={carousel.options}
    disableNext={carousel.arrows.disableNext}  // Disable the next button when applicable
    disablePrev={carousel.arrows.disablePrev}  // Disable the previous button when applicable
  />
</Stack>



        </Stack>
    );


    return (
        <Box component="section" sx={{ py: 5, position: 'relative', ...sx }} {...other}>
            <MotionViewport>
                {renderLines}

                <Container>
                    {renderDescription}

                    {renderContent}
                </Container>
            </MotionViewport>
        </Box>
    );
}

// ----------------------------------------------------------------------

const base = (index: number) => ({
    id: _mock.id(index),
    name: _mock.fullName(index),
    avatar: _mock.image.avatar(index),
});

const BRANDS = [
    {
        ...base(1),
        category: 'Unilever',
        image: '/assets/images/logos/unilever.svg', // Add image property
    },
    {
        ...base(2),
        category: 'Brisk',
        image: '/assets/images/logos/brisk.jpg',
    },
    {
        ...base(3),
        category: 'BAT',
        image: '/assets/images/logos/british-american-tobacco.svg',
    },
    {
        ...base(4),
        category: 'Canon',
        image: '/assets/images/logos/canon.svg',
    },
    {
        ...base(5),
        category: 'Diageo',
        image: '/assets/images/logos/diageo.svg',
    },
    {
        ...base(6),
        category: 'Tetra Pak',
        image: '/assets/images/logos/tetrapak.png',
    },
    {
        ...base(7),
        category: 'Brown-Forman',
        image: '/assets/images/logos/brown-forman.svg',
    },
    {
        ...base(8),
        category: 'Jambojet',
        image: '/assets/images/logos/jambojet.png',
    },
    {
        ...base(9),
        category: 'Multichoice',
        image: '/assets/images/logos/multichoice.jpg',
    },
    {
        ...base(10),
        category: 'Jetlak Foods Limited',
        image: '/assets/images/logos/jetlak.png',
    },
    {
        ...base(11),
        category: '4G Capital',
        image: '/assets/images/logos/4G-capital.png',
    },
    {
        ...base(12),
        category: 'Sense',
        image: '/assets/images/logos/sense.png',
    },
    {
        ...base(13),
        category: 'Capwell',
        image: '/assets/images/logos/capwell.jpg',
    },
    {
        ...base(14),
        category: 'Bidco',
        image: '/assets/images/logos/bidco.png',
    },
    {
        ...base(15),
        category: 'after6',
        image: '/assets/images/logos/a6.png',
    },
    {
        ...base(16),
        category: 'Vooma',
        image: '/assets/images/logos/vooma.png',
    },
];
