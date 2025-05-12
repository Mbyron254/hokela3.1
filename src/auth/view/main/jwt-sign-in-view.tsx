'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { GQLMutation } from 'src/lib/client';
import { USER_LOGIN } from 'src/lib/mutations/user.mutation';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: '📧 Email/Phone/Account number is required!' }),
  password: zod
    .string()
    .min(1, { message: '🔑 Password is required!' })
    .min(6, { message: '⚠️ Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

type ErrorType =
  | {
      message: string;
    }
  | string;

interface UserRole {
  name: string;
  clientTier1?: {
    clientType?: {
      name: string;
    };
  };
  clientTier2?: {
    clientType?: {
      name: string;
    };
  };
}

interface SessionUser {
  role?: UserRole;
}

interface Session {
  user?: SessionUser;
}

interface SessionData {
  session: Session;
}

export function JwtSignInView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const password = useBoolean();

  const { action: signin, loading } = GQLMutation({
    mutation: USER_LOGIN,
    resolver: 'login',
    toastmsg: true,
    callback: () => window.location.reload(),
  });

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const input = {
        keyPublic: data.email,
        keyPrivate: data.password,
      };
      signin({ variables: { input } });
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMsg(error instanceof Error ? error.message : String(error));
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
        name="email"
        label="Email"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          },
        }}
      />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href={paths.auth.main.forgotPassword}
          variant="body2"
          color="primary.main"
          sx={{
            alignSelf: 'flex-end',
            fontWeight: 600,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.72 },
          }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end" sx={{ color: 'primary.main' }}>
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Signing in..."
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontSize: 16,
          fontWeight: 600,
          textTransform: 'none',
          height: 48,
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'translateY(-1px)',
          },
        }}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don't have an account? `}
            <Link
              component={RouterLink}
              href={paths.auth.main.signUp}
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Get started
            </Link>
          </>
        }
        sx={{
          textAlign: { xs: 'center', md: 'left' },
          mb: 5,
        }}
      />

      {!!errorMsg && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}