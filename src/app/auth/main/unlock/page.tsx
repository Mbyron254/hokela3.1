'use client';

import { z as zod } from 'zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';

import { sourceImage } from 'src/lib/server';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { USER_LOGOUT, USER_UN_LOCK } from 'src/lib/mutations/user.mutation';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';

// ----------------------------------------------------------------------

const UnlockSchema = zod.object({
  password: zod.string().min(1, { message: '🔑 Password is required!' }),
});

type UnlockSchemaType = zod.infer<typeof UnlockSchema>;

// ----------------------------------------------------------------------

function UnlockView() {
  const [errorMsg, setErrorMsg] = useState('');

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const { action: signout } = GQLMutation({
    mutation: USER_LOGOUT,
    resolver: 'logout',
    toastmsg: true,
    callback: () => window.location.reload(),
  });

  const { action: unlock, loading } = GQLMutation({
    mutation: USER_UN_LOCK,
    resolver: 'sessionUnlock',
    toastmsg: true,
    callback: () => window.location.reload(),
  });

  const methods = useForm<UnlockSchemaType>({
    resolver: zodResolver(UnlockSchema),
    defaultValues: {
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await unlock({
        variables: {
          input: {
            keyPrivate: data.password,
          },
        },
        onCompleted: () => {
          setErrorMsg('');
        },
        onError: (error: any) => {
          console.error('🚫 Unlock error:', error);
          setErrorMsg(error.message);
        },
      });
    } catch (error) {
      console.error('🚫 Unlock error:', error);
      setErrorMsg(typeof error === 'string' ? error : (error as Error).message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Image
          className="rounded-circle shadow"
          src={sourceImage(session?.user?.profile?.photo?.fileName)}
          loader={() => sourceImage(session?.user?.profile?.photo?.fileName)}
          alt=""
          width={64}
          height={64}
        />
      </Box>

      <Field.Text
        name="password"
        label="Password"
        type="password"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          },
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.48),
            },
          },
        }}
      />

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || loading}
      >
        Unlock
      </LoadingButton>

      <Box sx={{ textAlign: 'center' }}>
        <Link
          component="button"
          onClick={() => signout()}
          sx={{
            color: 'text.secondary',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          Sign out
        </Link>
      </Box>
    </Box>
  );

  return (
    <>
      <FormHead
        title={`Hi ${session?.user?.name}`}
        description="Enter your password to continue with the current session"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}

export default function Page() {
  return <UnlockView />;
}
