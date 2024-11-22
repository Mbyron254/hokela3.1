import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { alpha } from '@mui/system';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const FAQs = [
  {
    question: 'What is Hokela? ',
    answer: (
      <Typography>
        Hokela is a digital platform designed to revolutionize retail distribution in emerging markets. We empower consumer brands with tools to manage field sales activities and distribute their products across Africa.
      </Typography>
    ),
  },
  {
    question: 'Who can benefit from Hokela?',
    answer: (
      <Typography>
        Hokela is beneficial for consumer brands, informal merchants, and businesses looking to streamline their distribution and sales processes. Our tools help merchants easily source inventory, place orders, and make payments.
      </Typography>
    ),
  },
  {
    question: 'How does Hokela work?',
    answer: (
      <Typography>
        Hokela connects consumer brands with informal merchants through a user-friendly digital platform. Brands can monitor sales activities and optimize distribution.
      </Typography>
    ),
  },
  {
    question: 'Is there a fee to use Hokela?',
    answer: (
      <Typography>
        While some services may incur fees, our platform is designed to offer various pricing options that cater to different business needs. For detailed pricing information, please contact our support team.
      </Typography>
    ),
  },
  {
    question: 'How can I create an account on Hokela?',
    answer: (
      <Typography>
        To create an account, visit our website and click on the Sign Up button. You will be prompted to provide your details and create a secure password.
      </Typography>
    ),
  },
  {
    question: 'Is my personal information safe with Hokela?',
    answer: (
      <Typography>
        Absolutely! At Hokela, we prioritize your privacy and data security. We use advanced encryption methods and secure payment gateways to protect your personal information.
      </Typography>
    ),
  },
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const [expanded, setExpanded] = useState<string | false>(FAQs[0].question);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = (
    <SectionTitle
      caption="FAQs"
      title="We’ve got the"
      txtGradient="answers"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = (
    <Stack
      spacing={1}
      sx={{
        mt: 8,
        mx: 'auto',
        maxWidth: 720,
        mb: { xs: 5, md: 8 },
      }}
    >
  {FAQs.map((item, index) => (
  <Accordion
    key={item.question}
    component={m.div}
    variants={varFade({ distance: 24 }).inUp}
    expanded={expanded === item.question}
    onChange={handleChange(item.question)}
    sx={{
      borderRadius: 2,
      transition: (theme) =>
        theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.short,
        }),
      '&::before': { display: 'none' },
      '&:hover': {
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), // Changed varAlpha to alpha
      },
      '&:first-of-type, &:last-of-type': { borderRadius: 2 },
      [`&.${accordionClasses.expanded}`]: {
        m: 0,
        borderRadius: 2,
        boxShadow: 'none',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08), // Changed varAlpha to alpha
      },
      [`& .${accordionSummaryClasses.root}`]: {
        py: 3,
        px: 2.5,
        minHeight: 'auto',
        [`& .${accordionSummaryClasses.content}`]: {
          m: 0,
          [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
        },
      },
      [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
    }}
  >
    <AccordionSummary
      expandIcon={
        <Iconify
          width={20}
          icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'}
        />
      }
      aria-controls={`panel${index}bh-content`}
      id={`panel${index}bh-header`}
    >
      <Typography variant="h6">{item.question}</Typography>
    </AccordionSummary>
    <AccordionDetails>{item.answer}</AccordionDetails>
  </Accordion>
))}

    </Stack>
  );

  const renderContact = (
    <Stack
      alignItems="center"
      sx={{
        px: 3,
        py: 8,
        textAlign: 'center',
        background: (theme) =>
          `linear-gradient(270deg, ${alpha(theme.palette.grey[500], 0.08)}, ${alpha(theme.palette.grey[500], 0)})`, // Changed varAlpha to alpha
      }}
    >
      <m.div variants={varFade().in}>
        <Typography variant="h4">Still have questions?</Typography>
      </m.div>
  
      <m.div variants={varFade().in}>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
          Describe your case to receive the most accurate advice
        </Typography>
      </m.div>
  
      <m.div variants={varFade().in}>
        <Button
          color="inherit"
          variant="contained"
          href="mailto:info@hokela.co.ke"
          startIcon={<Iconify icon="fluent:mail-24-filled" />}
        >
          Contact us
        </Button>
      </m.div>
    </Stack>
  );
  

  return (
    <Box component="section" sx={{ ...sx }} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        <TopLines />

        <Container>
          {renderDescription}
          {renderContent}
        </Container>

        <Stack sx={{ position: 'relative' }}>
          <BottomLines />
          {renderContact}
        </Stack>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TopLines() {
  return (
    <>
      <Stack
        spacing={8}
        alignItems="center"
        sx={{
          top: 64,
          left: 80,
          position: 'absolute',
          transform: 'translateX(-15px)',
        }}
      >
        <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
        <FloatTriangleDownIcon
          sx={{
            position: 'static',
            opacity: 0.24,
            width: 30,
            height: 15,
          }}
        />
      </Stack>
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );
}

function BottomLines() {
  return (
    <>
      <FloatLine sx={{ top: 0, left: 0 }} />
      <FloatLine sx={{ bottom: 0, left: 0 }} />
      <FloatPlusIcon sx={{ top: -8, left: 72 }} />
      <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
    </>
  );
}
