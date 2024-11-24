import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { AnimateAvatar } from 'src/components/animate';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

interface TUserProfile {
  __typename: 'TUserProfile';
  photo: string | null;
}

interface TRole {
  __typename: 'TRole';
  clientTier1: null;
  clientTier2: null;
}

interface TAgent {
  __typename: 'TAgent';
  id: string;
}

interface TUser {
  __typename: 'TUser';
  name: string;
  profile: TUserProfile;
  role: TRole;
  agent: TAgent;
}

interface TSession {
  __typename: 'TSession';
  user: TUser;
}

// Update the component props type
export function CourseMyAccount({ session, ...other }: CardProps & { session: TSession }) {
  const theme = useTheme();
  const { user } = useMockedUser();

  console.log(session, 'session');

  if (!session?.user) {
    return null;
  }
  console.log(session.user, 'session.user');
  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: session.user.profile?.photo || undefined, alt: session.user.name },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
      sx={{ mb: 2 }}
    >
      {session.user.name?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <Card {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {renderAvatar}

        <Typography variant="subtitle1" noWrap sx={{ mb: 0.5 }}>
          {session.user.name ?? 'Guest'}
        </Typography>

        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            typography: 'body2',
            alignItems: 'center',
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          {` ${session.user.agent.id}`}
          <IconButton size="small">
            <Iconify width={18} icon="solar:copy-bold" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
