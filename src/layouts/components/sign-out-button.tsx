import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import Button from '@mui/material/Button';

import { GQLMutation } from 'src/lib/client';
import { USER_LOGOUT } from 'src/lib/mutations/user.mutation';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const { action: signout, loading: signingOut } = GQLMutation({
    mutation: USER_LOGOUT,
    resolver: 'logout',
    toastmsg: true,
    callback: () => {
      onClose?.();
      window.location.replace('/');
    },
  });

  const handleLogout = () => signout();

  return (
    <Button 
      fullWidth 
      variant="soft" 
      size="large" 
      color="error" 
      onClick={handleLogout}
      disabled={signingOut}
      {...other}
    >
      Logout
    </Button>
  );
}
