import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';

import { _mock } from 'src/_mock';

import { SectionTitle } from './components/section-title';

// ----------------------------------------------------------------------

const varFade = () => ({
    in: {
        opacity: 1,
        transition: { duration: 0.5 },
    },
    out: {
        opacity: 0,
    },
});

export function ClientsIndustries({ sx, ...other }: BoxProps) {
    const [slidesToShow, setSlidesToShow] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateSlidesToShow = () => {
                const width = window.innerWidth;

                if (width < 768) {
                    setSlidesToShow(1);
                } else if (width < 992) {
                    setSlidesToShow(2);
                } else if (width < 1200) {
                    setSlidesToShow(3);
                } else {
                    setSlidesToShow(4);
                }
            };

            updateSlidesToShow();
            window.addEventListener('resize', updateSlidesToShow);

            // Cleanup on unmount
            return () => window.removeEventListener('resize', updateSlidesToShow);
        }

        return undefined;
    }, []);

    const renderDescription = (
        <SectionTitle
            caption="Industries"
            title="Industries we"
            txtGradient="serve"
            sx={{ mb: { xs: 3, md: 5 }, textAlign: 'center' }}
        />
    );

    const renderContent = (
        <Stack sx={{ position: 'relative', py: { xs: 1, md: 2 }, textAlign: 'center' }}>
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)', // 3 columns for mobile
                    sm: 'repeat(2, 1fr)', // 3 columns for small screens
                    md: 'repeat(4, 1fr)', // 4 columns for medium screens
                }}
                gap={2}
            >
                {BRANDS.slice(0, 12).map((item) => (
                    <m.div
                        key={item.id}
                        variants={varFade()} // Use the fade-in animation
                        initial="hidden"
                        animate="visible"
                    >
                        <Stack
                            alignItems="center" // Center the text and image horizontally
                            sx={{ textAlign: 'center', mx: { xs: 'auto', md: 0 } }}
                        >
                            {/* Responsive image dimensions */}
                            <Box
                                component="img"
                                src={item.image}
                                alt={item.category}
                                sx={{
                                    width: { xs: '100%', sm: '80%', md: '430px' },  // Responsive width
                                    height: { xs: 'auto', md: '200px' },            // Responsive height
                                    objectFit: 'contain',                           // Maintain aspect ratio
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />
                            <Stack spacing={1} sx={{ typography: 'subtitle2', alignItems: 'center' }}> {/* Center text */}
                                {item.category}
                            </Stack>
                        </Stack>
                    </m.div>
                ))}

            </Box>
        </Stack>
    );

    return (
        <Box component="section" sx={{ py: 1, position: 'relative', ...sx }} {...other}>
            <Container>
                {renderDescription}
                {renderContent}
            </Container>
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
        category: 'Food and Beverage',
        image: '/assets/images/industries/food-bev-2.jpg', // Add image property
    },
    {
        ...base(2),
        category: 'Marketing',
        image: '/assets/images/industries/digital-marketing.jpg',
    },
    {
        ...base(3),
        category: 'Product and Event Promotion',
        image: '/assets/images/industries/event.webp',
    },
    {
        ...base(4),
        category: 'Technology and Software',
        image: '/assets/images/industries/softw.png',
    },
];
