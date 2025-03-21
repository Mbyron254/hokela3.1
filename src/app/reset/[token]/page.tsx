'use client';

import { GQLMutation } from 'src/lib/client'; 
import { InputReset } from 'src/lib/interface/auth.interface';
import { USER_AC_RESET } from 'src/lib/mutations/user.mutation';
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';

export default function Page({ params: { token } }: any) {
  const { action: reset, loading } = GQLMutation({
    mutation: USER_AC_RESET,
    resolver: 'resetPassword',
    toastmsg: true,
    callback: () => window.location.replace('/'),
  });

  const [input, setInput] = useState<InputReset>({
    token,
    password: undefined,
    passwordConfirmartion: undefined,
  });

  const handleReset = () => reset({ variables: { input } });

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Change Password
        </Typography>
      </Box>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Minimum 6 characters, at least 1 number, 1 uppercase and 1 lowercase letter, and at least one special character (e.g., #, $, *, .)
        </Typography>
      </Box>

      <form noValidate autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
        <Box mt={3}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            required
            value={input.password || ''}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />
        </Box>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Password Confirmation"
            type="password"
            variant="outlined"
            required
            value={input.passwordConfirmartion || ''}
            onChange={(e) => setInput({ ...input, passwordConfirmartion: e.target.value })}
          />
        </Box>

        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Button
            variant="outlined"
            color="primary"
            href="/auth/main/sign-in"
          >
            Go back to login page
          </Button>
        </Box>
      </form>
    </Container>
  );
}
