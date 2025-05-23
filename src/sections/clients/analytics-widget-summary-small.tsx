import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

type Props = {
  title: string;
  total: number;
  color?: string;
  icon: React.ReactNode;
};

export function AnalyticsWidgetSummarySmall({ icon, title, total, color = 'primary' }: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...bgGradient({
          // @ts-expect-error
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 1,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        height: '200px',
      }}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>
      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
      <Box sx={{ typography: 'h4' }}>{fShortenNumber(total)}</Box>
    </Card>
  );
}
