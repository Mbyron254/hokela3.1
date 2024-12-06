'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';

import { GQLMutation } from 'src/lib/client';
import { USER_AC_RECOVER } from 'src/lib/mutations/user.mutation';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';

// ----------------------------------------------------------------------

const ForgotPasswordSchema = zod.object({
  email: zod.string().min(1, { message: '📧 Email/Phone/Account number is required!' }),
});

type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>;

// ----------------------------------------------------------------------

function ForgotPasswordView() {
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const { action: recover, loading } = GQLMutation({
    mutation: USER_AC_RECOVER,
    resolver: 'recoverAccount',
    toastmsg: true,
    callback: () => window.location.replace('/'),
  });

  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await recover({
        variables: {
          input: {
            keyPublic: data.email,
          },
        },
        onCompleted: () => {
          setSuccess(true);
          setErrorMsg('');
        },
        onError: (error: any) => {
          console.error('🚫 Forgot password error:', error);
          setErrorMsg(error.message);
          setSuccess(false);
        },
      });
    } catch (error) {
      console.error('🚫 Forgot password error:', error);
      setErrorMsg(typeof error === 'string' ? error : (error as Error).message);
      setSuccess(false);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email / Phone / Account number"
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

      {success && (
        <Alert severity="success">Reset password instructions have been sent to your email!</Alert>
      )}

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || loading}
      >
        Send Reset Link
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
            },
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
        title="Forgot Password"
        description="Enter your email and we'll send you a link to reset your password"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}

export default function Page() {
  return <ForgotPasswordView />;
}
