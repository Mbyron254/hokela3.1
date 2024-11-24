import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

import { carouselClasses } from '../classes';
import type { CarouselProgressBarProps } from '../types';

// ----------------------------------------------------------------------

const StyledRoot = styled(Box)(({ theme }) => ({
  height: 6,
  maxWidth: 120,
  width: '100%',
  borderRadius: 6,
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.text.primary, // Updated here
  backgroundColor: varAlpha(theme.palette.grey[500], 0.2), // Updated here
}));

const StyledProgress = styled(Box)(() => ({
  top: 0,
  bottom: 0,
  width: '100%',
  left: '-100%',
  position: 'absolute',
  backgroundColor: 'currentColor',
}));

// ----------------------------------------------------------------------

export function CarouselProgressBar({
  sx,
  value,
  className,
  ...other
}: BoxProps & CarouselProgressBarProps) {
  return (
    <StyledRoot
      sx={sx}
      className={carouselClasses.progress.concat(className ? ` ${className}` : '')}
      {...other}
    >
      <StyledProgress
        className={carouselClasses.progressBar}
        sx={{
          transform: `translate3d(${value}%, 0px, 0px)`,
        }}
      />
    </StyledRoot>
  );
}
