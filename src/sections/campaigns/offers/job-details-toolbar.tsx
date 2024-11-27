import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  loading: boolean;
  backLink: string;
  editLink: string;
  liveLink: string;
  publish: string;
  onChangePublish: (newValue: string) => void;
  publishOptions: {
    value: string;
    label: string;
  }[];
};

export function JobDetailsToolbar({
  loading,
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  sx,
  ...other
}: Props) {
  return (
    <>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, ...sx }} {...other}>
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* {publish === 'published' && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip> */}

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={loading}
          loadingIndicator="Loading…"
          onClick={() => onChangePublish('Apply')}
          sx={{ textTransform: 'capitalize' }}
        >
          Apply
        </LoadingButton>
      </Stack>
    </>
  );
}
