import type { IJobItem } from 'src/types/job';

import { useMemo } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { _roles, JOB_BENEFIT_OPTIONS, JOB_EMPLOYMENT_TYPE_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { RHFEditor, RHFSwitch, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';
// ----------------------------------------------------------------------

// export type NewJobSchemaType = zod.infer<typeof NewJobSchema>;

// export const NewJobSchema = zod.object({
//   title: zod.string().min(1, { message: 'Title is required!' }),
//   content: zod.string().min(1, { message: 'Content is required!' }),
//   employmentTypes: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
//   role: zod.objectOrNull<string | null>({
//     message: { required_error: 'Role is required!' },
//   }),
//   skills: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
//   workingSchedule: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
//   locations: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
//   expiredDate: zod.date({ message: { required_error: 'Expired date is required!' } }),
//   salary: zod.object({
//     price: zod.number().min(1, { message: 'Price is required!' }),
//     // Not required
//     type: zod.string(),
//     negotiable: zod.boolean(),
//   }),
//   benefits: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
//   // Not required
//   experience: zod.string(),
// });

// ----------------------------------------------------------------------

type Props = {
  currentJob?: IJobItem;
};

export function JobNewEditForm({ currentJob }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: '',
      content: '',
      employmentTypes: [],
      experience: '1 year exp',
      role: _roles[1],
      skills: [],
      workingSchedule: [],
      locations: [],
      expiredDate: null,
      salary: { type: 'Hourly', price: 0, negotiable: false },
      benefits: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentJob]
  );

  // const methods = useForm<NewJobSchemaType>({
  //   mode: 'all',
  //   resolver: zodResolver(NewJobSchema),
  //   defaultValues,
  // });

  // const {
  //   reset,
  //   control,
  //   handleSubmit,
  //   formState: { isSubmitting },
  // } = methods;

  // useEffect(() => {
  //   if (currentJob) {
  //     reset(defaultValues);
  //   }
  // }, [currentJob, defaultValues, reset]);

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     reset();
  //     toast.success(currentJob ? 'Update success!' : 'Create success!');
  //     router.push(paths.v2.agent.campaigns.root);
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Title</Typography>
          <RHFTextField name="title" placeholder="Ex: Software Engineer..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <RHFEditor name="content" sx={{ maxHeight: 480 }} />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Employment type</Typography>
          <RHFMultiCheckbox
            row
            name="employmentTypes"
            options={JOB_EMPLOYMENT_TYPE_OPTIONS}
            sx={{ gap: 4 }}
          />
        </Stack>
        {/* 
        <Stack spacing={1}>
          <Typography variant="subtitle2">Experience</Typography>
          <RHFRadioGroup
            row
            name="experience"
            options={JOB_EXPERIENCE_OPTIONS}
            sx={{ gap: 4 }}
          />
        </Stack> */}

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Role</Typography>
          <RHFAutocomplete
            name="role"
            autoHighlight
            options={_roles.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Stack> */}

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Skills</Typography>
          <RHFAutocomplete
            name="skills"
            placeholder="+ Skills"
            multiple
            disableCloseOnSelect
            options={JOB_SKILL_OPTIONS.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack> */}

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Working schedule</Typography>
          <RHFAutocomplete
            name="workingSchedule"
            placeholder="+ Schedule"
            multiple
            disableCloseOnSelect
            options={JOB_WORKING_SCHEDULE_OPTIONS.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Locations</Typography>
          <RHFSelect multiple name="locations" placeholder="+ Locations" />
        </Stack> */}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Expired</Typography>

          {/* <RHFDatePicker name="expiredDate" /> */}
        </Stack>

        <Stack spacing={2}>
          <Typography variant="subtitle2">Salary</Typography>

          <Controller
            name="salary.type"
            // @ts-ignore
            control={control}
            render={({ field }) => (
              <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                {[
                  {
                    label: 'Hourly',
                    icon: <Iconify icon="solar:clock-circle-bold" width={32} sx={{ mb: 2 }} />,
                  },
                  {
                    label: 'Custom',
                    icon: <Iconify icon="solar:wad-of-money-bold" width={32} sx={{ mb: 2 }} />,
                  },
                ].map((item) => (
                  <Paper
                    component={ButtonBase}
                    variant="outlined"
                    key={item.label}
                    onClick={() => field.onChange(item.label)}
                    sx={{
                      p: 2.5,
                      borderRadius: 1,
                      typography: 'subtitle2',
                      flexDirection: 'column',
                      ...(item.label === field.value && {
                        borderWidth: 2,
                        borderColor: 'text.primary',
                      }),
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Paper>
                ))}
              </Box>
            )}
          />

          <RHFTextField
            name="salary.price"
            placeholder="0.00"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                </InputAdornment>
              ),
            }}
          />
          <RHFSwitch name="salary.negotiable" label="Salary is negotiable" />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Benefits</Typography>
          <RHFMultiCheckbox
            name="benefits"
            options={JOB_BENEFIT_OPTIONS}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ flexGrow: 1, pl: 3 }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        // loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentJob ? 'Create job' : 'Save changes'}
      </LoadingButton>
    </Box>
  );

  return (
    // @ts-ignore
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </FormProvider>
  );
}
