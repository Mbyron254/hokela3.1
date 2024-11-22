/* eslint-disable react-hooks/rules-of-hooks */
import { m } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/system';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { maxLine, textGradient } from 'src/theme/styles';

import { Carousel } from 'src/components/carousel/carousel';
import { varFade, MotionViewport } from 'src/components/animate';
import { useCarousel } from 'src/components/carousel/hooks/use-carousel';
import { carouselBreakpoints } from 'src/components/carousel/breakpoints';
import { CarouselDotButtons } from 'src/components/carousel/components/carousel-dot-buttons';
import { CarouselArrowBasicButtons } from 'src/components/carousel/components/carousel-arrow-buttons';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------



export function HomeTestimonials({ sx, ...other }: BoxProps) {

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

    // Add a return statement outside the condition
    return undefined;
  }, []);




  const carousel = useCarousel({
    align: 'start',
    slidesToShow,
    breakpoints: {
      [carouselBreakpoints.sm]: { slideSpacing: '24px' },
      [carouselBreakpoints.md]: { slideSpacing: '40px' },
    },
  });

  const renderDescription = (
    <SectionTitle
      caption="testimonials"
      title="Rumors are flying"
      txtGradient="that..."
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
          `linear-gradient(to right, ${alpha(theme.palette.grey[500], 0)} 0%, ${theme.palette.grey[500]
          } 50%, ${alpha(theme.palette.grey[500], 0)} 100%)`,
        ...(position === 'top' && { top: 0 }),
        ...(position === 'bottom' && { bottom: 0 }),
      }}
    />
  );

  const verticalDivider = (
    <Divider
      component="div"
      orientation="vertical"
      flexItem
      sx={{
        width: '1px',
        opacity: 0.16,
        border: 'none',
        background: (theme) =>
          `linear-gradient(to bottom, ${alpha(theme.palette.grey[500], 0)} 0%, ${theme.palette.grey[500]
          } 50%, ${alpha(theme.palette.grey[500], 0)} 100%)`,
        display: { xs: 'none', md: 'block' },
      }}
    />
  );

  const renderContent = (
    <Stack sx={{ position: 'relative', py: { xs: 5, md: 8 } }}>
      {horizontalDivider('top')}

      <Carousel carousel={carousel}>
        {TESTIMONIALS.map((item) => (
          <Stack key={item.id} component={m.div} variants={varFade().in}>
            <Stack spacing={1} sx={{ typography: 'subtitle2' }}>
              <Rating size="small" name="read-only" value={item.rating} precision={0.5} readOnly />
              {item.category}
            </Stack>

            <Typography
              sx={(theme) => ({
                ...maxLine({ line: 4, persistent: theme.typography.body1 }),
                mt: 2,
                mb: 3,
              })}
            >
              {item.content}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar alt={item.name} src={item.avatar} sx={{ width: 48, height: 48 }} />
              <Stack sx={{ typography: 'subtitle1' }}>
                <Box component="span">{item.name}</Box>
                <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
                  {fToNow(new Date(item.postedAt))}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Carousel>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: { xs: 5, md: 8 } }}
      >
        <CarouselDotButtons
          variant="rounded"
          scrollSnaps={carousel?.dots?.scrollSnaps}
          selectedIndex={carousel?.dots?.selectedIndex}
          onClickDot={carousel?.dots?.onClickDot}
        />

        <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
      </Stack>
    </Stack>
  );

  const renderNumber = (
    <Stack sx={{ py: { xs: 5, md: 8 }, position: 'relative' }}>
      {horizontalDivider('top')}
  
      <Stack spacing={5} direction={{ xs: 'column', md: 'row' }} divider={verticalDivider}>
        {[
          { label: 'Network Agents', value: 15000 },
          { label: 'Brands we work with', value: 100 },
          { label: 'Retail outlets mapped', value: 200000 },
          { label: 'Operational countries', value: 5 },
        ].map((item) => {
          const [displayValue, setDisplayValue] = useState(0);
          const [isVisible, setIsVisible] = useState(false);
          const ref = useRef(null); // Create a ref for the intersection observer
  
          // Use effect to observe the element
          useEffect(() => {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsVisible(true); // Element is in view
                  observer.disconnect(); // Stop observing once the element is visible
                }
              });
            });
  
            if (ref.current) {
              observer.observe(ref.current); // Observe the current element
            }
  
            return () => {
              if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current); // Cleanup the observer on unmount
              }
            };
          }, []);
  
          // Counting logic
          useEffect(() => {
            if (!isVisible) return; // Do not start counting if not visible
            
            let currentVal = 0;
            const increment = Math.ceil(item.value / 50);
  
            const interval = setInterval(() => {
              currentVal += increment;
              if (currentVal >= item.value) {
                currentVal = item.value;
                clearInterval(interval);
              }
              setDisplayValue(currentVal);
            }, 50);
  
            // eslint-disable-next-line consistent-return
            return () => clearInterval(interval);
          }, [isVisible, item.value]);
  
          return (
            <Stack key={item.label} spacing={2} sx={{ textAlign: 'center', width: 1 }} ref={ref}>
              <m.div variants={varFade({ distance: 24 }).inUp}>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 'fontWeightBold',
                    fontSize: { xs: 40, md: 64 },
                    lineHeight: { xs: 50 / 40, md: 80 / 64 },
                    fontFamily: (theme) => theme.typography.fontSecondaryFamily,
                  }}
                >
                  {displayValue.toLocaleString()}
                  {item.label !== 'Operational countries' && '+'}
                </Box>
              </m.div>
  
              <m.div variants={varFade({ distance: 24 }).inUp}>
                <Box
                  component="span"
                  sx={(theme) => ({
                    ...textGradient(
                      `90deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.2)}`
                    ),
                    opacity: 0.4,
                    typography: 'h6',
                  })}
                >
                  {item.label}
                </Box>
              </m.div>
            </Stack>
          );
        })}
      </Stack>
  
      {horizontalDivider('bottom')}
    </Stack>
  );
  return (
    <Box component="section" sx={{ py: 10, position: 'relative', ...sx }} {...other}>
      <MotionViewport>
        {renderLines}

        <Container>
          {renderDescription}

          {renderContent}

          {renderNumber}
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------


const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah K', // Replace with the actual name
    avatar: '/path/to/avatar1.jpg', // Replace with the actual avatar URL
    category: 'Ease of Use',
    content: `"The platform is super user-friendly. I could use Hokela without any hassle."`,
    rating: 5,
    postedAt: 'April 20, 2024 23:15:30',
  },
  {
    id: '2',
    name: 'Mike A', // Replace with the actual name
    avatar: '/path/to/avatar2.jpg', // Replace with the actual avatar URL
    category: 'Customer Experience',
    content: `"Hokela offers an exceptional customer experience. The team was responsive and supportive throughout."`,
    rating: 5,
    postedAt: 'March 19, 2024 23:15:30',
  },
  {
    id: '3',
    name: 'James R', // Replace with the actual name
    avatar: '/path/to/avatar3.jpg', // Replace with the actual avatar URL
    category: 'Design Quality',
    content: `"Amazing design and functionality! Everything works perfectly, and it’s visually stunning."`,
    rating: 5,
    postedAt: 'January 19, 2024 23:15:30',
  },
  {
    id: '4',
    name: 'Emily T', // Replace with the actual name
    avatar: '/path/to/avatar4.jpg', // Replace with the actual avatar URL
    category: 'Timely Delivery',
    content: ` "Impressed by the speed and quality of service."`,
    rating: 4.95,
    postedAt: 'December 19, 2023 23:15:30',
  },
  {
    id: '5',
    name: 'David K', // Replace with the actual name
    avatar: '/path/to/avatar5.jpg', // Replace with the actual avatar URL
    category: 'Customer Support',
    content: '"Incredible customer support! Highly recommend!"',
    rating: 4.95,
    postedAt: 'June 19, 2023 23:15:30',
  },
  {
    id: '6',
    name: 'Emma M', // Replace with the actual name
    avatar: '/path/to/avatar6.jpg', // Replace with the actual avatar URL
    category: 'Innovation',
    content: '"Hokela innovative approach to retail is refreshing. They make data analysis so much easier."',
    rating: 5,
    postedAt: 'November 19, 2023 23:15:30',
  },
  {
    id: '7',
    name: 'Chris M', // Replace with the actual name
    avatar: '/path/to/avatar7.jpg', // Replace with the actual avatar URL
    category: 'Reliability',
    content: '"I can always rely on Hokela for quality products and reliable delivery."',
    rating: 5,
    postedAt: 'August 19, 2023 23:15:30',
  },
  {
    id: '8',
    name: 'Sophia T', // Replace with the actual name
    avatar: '/path/to/avatar8.jpg', // Replace with the actual avatar URL
    category: 'Business Impact',
    content: '"Hokela has significantly improved my business operations."',
    rating: 4.75,
    postedAt: 'September 19, 2023 23:15:30',
  },
];
