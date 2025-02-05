import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_AGENT_UPDATE_SELF } from 'src/lib/mutations/agent.mutation';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  id: zod.string().optional(),
  passwordCurrent: zod.string().optional(),
  name: zod.string().optional(),
  email: zod.string().optional(),
  phone: zod.string().optional(),
  photoId: zod.string().optional(),
  password: zod.string().optional(),
  passwordConfirmation: zod.string().optional(),
});

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export type TUserProfile = {
  __typename: 'TUserProfile';
  photo: null | any; // Update this type based on actual photo structure
};

export type TRole = {
  __typename: 'TRole';
  clientTier1: null | any;
  clientTier2: null | any;
};

export type TAgent = {
  __typename: 'TAgent';
  id: string;
};

export type TUser = {
  __typename: 'TUser';
  name: string;
  email: string;
  phone: string;
  profile: TUserProfile;
  role: TRole;
  agent: TAgent;
};

export function AccountGeneral({ agent }: { agent: TUser }) {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const defaultValues = {
    displayName: session?.sessionSelf?.user?.name || agent?.name || '',
    email: session?.sessionSelf?.user?.email || agent?.email || '',
    phoneNumber: session?.sessionSelf?.user?.phone || agent?.phone || '',
    passwordCurrent: '',
    password: '',
    passwordConfirmation: '',
    id: session?.sessionSelf?.user?.agent?.id || agent?.agent?.id || '',
  };

  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: M_AGENT_UPDATE_SELF,
    resolver: 'agentUpdateSelf',
    toastmsg: true,
  });

  const [input, setInput] = useState<UpdateUserSchemaType>({
    id: undefined,
    passwordCurrent: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    photoId: undefined,
    password: undefined,
    passwordConfirmation: undefined,
  });

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (session?.user) {
      setInput({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        photoId: session.user.profile?.photo?.id,
      });
    }
  }, [session?.user]);

  useEffect(() => {
    console.log('Session User:', session?.sessionSelf?.user);
    console.log('Agent:', agent);
  }, [session, agent]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.passwordCurrent) {
        enqueueSnackbar('Current password is required', { variant: 'error' });
        return;
      }

      if (data.password && data.password !== data.passwordConfirmation) {
        enqueueSnackbar('New passwords do not match', { variant: 'error' });
        return;
      }

      await update({
        variables: {
          input: {
            name: data?.displayName,
            email: data.email,
            phone: data?.phoneNumber,
            currentPassword: data.passwordCurrent,
            password: data.password || undefined,
            confirmPassword: data.passwordConfirmation || undefined,
          },
        },
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to update profile', {
        variant: 'error',
      });
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete user
            </Button> */}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="displayName" label="Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.Text
                name="passwordCurrent"
                label="Current Password"
                type="password"
                required
              />
              <Field.Text name="password" label="New Password" type="password" />
              <Field.Text
                name="passwordConfirmation"
                label="Confirm New Password"
                type="password"
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
