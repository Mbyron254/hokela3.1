import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { maxLine } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Label, labelClasses } from 'src/components/label';
import { Carousel, useCarousel } from 'src/components/carousel';
import { CarouselArrowBasicButtons } from 'src/components/carousel/components/carousel-arrow-buttons';

// ----------------------------------------------------------------------

type JobType = {
  index: number;
  id: string;
  closeAdvertOn: string;
  campaign: {
    id: string;
    name: string;
    jobDescription: string;
    jobQualification: string;
    clientTier2: {
      name: string;
      clientTier1: {
        name: string;
        __typename: 'TClientTier1';
      };
      __typename: 'TClientTier2';
    };
    __typename: 'TCampaign';
  };
  __typename: 'TCampaignRun';
};

type Props = BoxProps & {
  title: string;
  jobs: JobType[];
 
};

export function CourseFeatured({ title, jobs,  sx, ...other }: Props) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: '40%', xl: '30%' },
  });

  return (
    <Box sx={sx} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <CarouselArrowBasicButtons {...carousel.arrows} />
      </Box>

      <Carousel
        carousel={carousel}
        slotProps={{
          slide: { py: 3 },
        }}
        sx={{ px: 0.5 }}
      >
        {jobs?.length ? (
          jobs.map((job) => (
            <JobCarouselItem key={job.id} job={job} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', p: 3 }}>
            No featured campaign offers available
          </Box>
        )}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

type JobCarouselItemProps = CardProps & {
  job: JobType;
};

function JobCarouselItem({ job, sx, ...other }: JobCarouselItemProps) {
  const renderLabels = (
    <Box
      sx={{
        gap: 1,
        mb: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        [`& .${labelClasses.root}`]: {
          typography: 'caption',
          color: 'text.secondary',
        },
      }}
    >
      <Label startIcon={<Iconify width={12} icon="solar:calendar-date-bold" />}>
        Closes: {new Date(job.closeAdvertOn).toLocaleDateString()}
      </Label>

      <Label startIcon={<Iconify width={12} icon="solar:building-bold" />}>
        {job.campaign.clientTier2.name}
      </Label>
    </Box>
  );

  return (
    <Card sx={{ width: 1, ...sx }} {...other}>
      <Box sx={{ px: 2, py: 2.5 }}>
        {renderLabels}

        <Link
          variant="subtitle2"
          color="inherit"
          underline="none"
          sx={(theme) => ({
            ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
            mb: 1,
          })}
        >
          {job.campaign.name}
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={(theme) => ({
            ...maxLine({ line: 3, persistent: theme.typography.body2 }),
            mb: 2,
          })}
        >
          {job.campaign.jobDescription}
        </Typography>

        <Button
          variant="contained"
          size="small"
          fullWidth
          href={paths.v2.agent.campaigns.offers.details(job.id)}
        >
          Apply Now
        </Button>
      </Box>
    </Card>
  );
}
