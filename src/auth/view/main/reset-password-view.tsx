'use client';

import { z as zod } from 'zod';
import { SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { GQLMutation } from 'src/lib/client';
import { USER_AC_RESET } from 'src/lib/mutations/user.mutation';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

const ResetPasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: '🔑 Password is required!' })
      .min(6, { message: '⚠️ Password must be at least 6 characters!' }),
    confirmPassword: zod
      .string()
      .min(1, { message: '🔑 Confirm password is required!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "⚠️ Passwords don't match!",
    path: ['confirmPassword'],
  });

type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const { action: resetPassword, loading } = GQLMutation({
    mutation: USER_AC_RESET,
    resolver: 'resetPassword',
    toastmsg: true,
    callback: () => router.push('/auth/main/sign-in'),
  });

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      if (!token) {
        setErrorMsg('Reset password token is missing!');
        return;
      }

      await resetPassword({
        variables: {
          input: {
            token,
            password: data.password,
          },
        },
        onError: (error: { message: SetStateAction<string>; }) => {
          console.error('🚫 Reset password error:', error);
          setErrorMsg(error.message);
        },
      });
    } catch (error) {
      console.error('🚫 Reset password error:', error);
      setErrorMsg(typeof error === 'string' ? error : (error as Error).message);
    }
  });

  const renderForm = (
    <Box
      gap={3}
      display="flex"
      flexDirection="column"
      sx={{
        '& .MuiTextField-root': {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.48),
            },
          },
        },
      }}
    >
      <Field.Text
        name="password"
        label="New Password"
        type="password"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
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
        Reset Password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Reset Password"
        description="Enter your new password below"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
