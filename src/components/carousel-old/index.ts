// export * from './classes';

// export * from './carousel';

// export type * from './types';

// export * from './breakpoints';

// export * from './hooks/use-carousel';

// export * from './components/carousel-slide';

// export * from './components/carousel-thumbs';

// export * from './components/carousel-dot-buttons';

// export * from './components/carousel-progress-bar';

// export * from './components/carousel-arrow-buttons';
import Carousel from 'react-slick';

export { default as useCarousel } from './use-carousel';
export { default as CarouselDots } from './carousel-dots';
export { default as CarouselArrows } from './carousel-arrows';

export { default as CarouselArrowIndex } from './carousel-arrow-index';

export default Carousel;