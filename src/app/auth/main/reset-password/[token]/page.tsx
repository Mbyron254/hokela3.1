'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';

import { GQLMutation } from 'src/lib/client';
import { USER_AC_RESET } from 'src/lib/mutations/user.mutation';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';

// ----------------------------------------------------------------------

const ResetPasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: '🔑 Password is required!' })
      .min(6, { message: '⚠️ Password must be at least 6 characters!' }),
    passwordConfirmartion: zod
      .string()
      .min(1, { message: '🔑 Confirm password is required!' }),
  })
  .refine((data) => data.password === data.passwordConfirmartion, {
    message: "⚠️ Passwords don't match!",
    path: ['passwordConfirmartion'],
  });

type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

function ResetPasswordView() {
  const router = useRouter();
  const params = useParams();
  const [errorMsg, setErrorMsg] = useState('');

  const { action: resetPassword, loading } = GQLMutation({
    mutation: USER_AC_RESET,
    resolver: 'resetPassword',
    toastmsg: true,
    callback: () => router.push('/dashboard'),
  });

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmartion: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = params.token as string;

      if (!token) {
        setErrorMsg('Reset password token is missing!');
        return;
      }

      await resetPassword({
        variables: {
          input: {
            token,
            password: data.password,
            passwordConfirmartion: data.passwordConfirmartion,
          },
        },
        onError: ({error}: any) => {
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
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.48),
            },
          },
        }}
      />

      <Field.Text
        name="passwordConfirmartion"
        label="Confirm New Password"
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
        Reset Password
      </LoadingButton>

      <Box sx={{ textAlign: 'center' }}>
        <Link
          href="/auth/main/sign-in"
          component={NextLink}
          sx={{ 
            color: 'text.secondary',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.main',
            }
          }}
        >
          Return to Login
        </Link>
      </Box>
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

export default function Page() {
  return <ResetPasswordView />;
}
