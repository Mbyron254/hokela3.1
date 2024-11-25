import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { GQLQuery,GQLMutation } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { USER_LOCK, USER_LOGOUT } from 'src/lib/mutations/user.mutation';

import {Label} from 'src/components/label';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useMockedUser();

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: signout, loading: signingOut } = GQLMutation({
    mutation: USER_LOGOUT,
    resolver: 'logout',
    toastmsg: true,
    callback: () => window.location.replace('/'),
  });
  const { action: lock, loading: locking } = GQLMutation({
    mutation: USER_LOCK,
    resolver: 'sessionLock',
    toastmsg: true,
    callback: () => window.location.replace('/unlock'),
  });

  const handleSignOut = () => signout();
  const handleLock = () => lock();


  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={session?.user?.profile?.photo} alt={session.user?.name || 'Agent'} sx={{ width: 48, height: 48 }} />
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {session?.user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button variant="contained" onClick={handleSignOut}>
          Logout
        </Button>
      </Stack>
    </Stack>
  );
}
