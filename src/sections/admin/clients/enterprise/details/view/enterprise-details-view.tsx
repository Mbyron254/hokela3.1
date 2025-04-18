'use client';

import { formatDate } from 'date-fns';
import MuiPhoneNumber from 'mui-phone-number';
import { useMemo, useState, useEffect } from 'react';

import { alpha } from '@mui/system';
import {
  Box,
  List,
  Grid,
  Menu,
  Card,
  Paper,
  Avatar,
  styled,
  Button,
  Dialog,
  MenuItem,
  ListItem,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  Autocomplete,
  ListItemText,
  DialogActions,
  DialogContent,
  ListItemAvatar,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_GUESTS_MINI } from 'src/lib/queries/user.query';
import { Q_ACCOUNT_MANAGERS } from 'src/lib/queries/client.query';
import { M_CLIENT_T1 } from 'src/lib/mutations/client-t1.mutation';
import { USER_CREATE_ALIEN } from 'src/lib/mutations/user.mutation';
import { ADD_GUEST_AS_ACCOUNT_MANAGER } from 'src/lib/mutations/client.mutation';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type Props = {
  id: string;
};
type inputCreateAdmin = {
  name: string;
  phone: string;
  email: string;
  clientTier1Id: string;
};

type TUsers = {
  __typename: 'TUsers';
  count: number;
  rows: TUser[];
};

type TUser = {
  __typename: 'TUser';
  id: string;
  name: string;
  accountNo: string;
  state: number;
  profile: TUserProfile;
};

type TUserProfile = {
  __typename: 'TUserProfile';
  photo: string | null;
};
type AdminsListType = {
  id: string;
  name: string;
  photo: string | null;
  isGuest: boolean;
};

export default function EnterpriseDetailsView({ id }: Props) {
  // ------------------------------------------------------------------------
  const { action: getClient, data: client } = GQLMutation({
    mutation: M_CLIENT_T1,
    resolver: 'tier1Client',
    toastmsg: false,
  });
  const { data: managers } = GQLQuery({
    query: Q_ACCOUNT_MANAGERS,
    queryAction: 'clientAccountManagers',
    variables: {
      input: {
        clientTier1Id: id,
      },
    },
  });

  const { data: guests } = GQLQuery({
    query: Q_GUESTS_MINI,
    queryAction: 'usersActive',
    variables: { input: { guests: true } },
  });

  const { action: create, loading: creating } = GQLMutation({
    mutation: USER_CREATE_ALIEN,
    resolver: 'userCreateAlien',
    toastmsg: true,
  });
  const { action: add, loading: adding } = GQLMutation({
    mutation: ADD_GUEST_AS_ACCOUNT_MANAGER,
    resolver: 'addGuestAsAccountManager',
    toastmsg: true,
  });

  const loadClient = () => {
    if (id) {
      getClient({ variables: { input: { id } } });
    }
  };

  useEffect(
    () => {
      loadClient();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [adminsList, setAdminsList] = useState<AdminsListType[]>([]);
  useMemo(() => {
    if (managers && guests) {
      if (managers?.rows.length > 0 && guests?.rows.length > 0) {
        // Both managers and guests exist
        const admins = tranformedAdmins(managers.rows);
        const adminsGuest = tranformedGuestAdmins(guests.rows);
        setAdminsList([...admins, ...adminsGuest]);
      } else if (managers?.rows.length > 0) {
        // Only managers exist
        const admins = tranformedAdmins(managers.rows);
        setAdminsList([...admins]);
      } else if (guests?.rows.length > 0) {
        // Only guests exist
        const adminsGuest = tranformedGuestAdmins(guests.rows);
        setAdminsList([...adminsGuest]);
      }
    }
  }, [managers, guests]);

  // ------------------------------------------------------------------------
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dialog = useBoolean();
  const isGuest = useBoolean();

  const handleDialogClose = () => {
    dialog.onFalse();
    isGuest.onFalse();
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guest: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePhoneChange = (value: string) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };
  const handleNewManager = () => {
    dialog.onTrue();
    isGuest.onFalse();
  };
  const handleNewGuestManager = () => {
    dialog.onTrue();
    isGuest.onTrue();
  };
  const handleGuestsChange = (_: any, value: any) => {
    setFormData({
      ...formData,
      guest: value?.id || '',
    });
  };
  const handleAddManager = () => {
    const inputCreate = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      clientTier1Id: id,
    };
    create({ variables: { input: inputCreate } });
    dialog.onFalse();
  };
  const handleAddGuest = () => {
    const inputT1GAAM = {
      userId: undefined,
      clientTier1Id: id,
    };
    add({ variables: { input: inputT1GAAM } });
    dialog.onFalse();
  };
  const handleSubmit = () => {
    if (isGuest.value) {
      console.log(isGuest);
      handleAddGuest();
    } else {
      console.log('New Manager');

      handleAddManager();
    }
  };
  const GuestAndAdminForm = () => (
    <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>{isGuest.value ? 'Onboard Guest Manager' : 'Onboard New Manager'}</DialogTitle>
      <DialogContent>
        {isGuest.value ? (
          <Autocomplete
            fullWidth
            options={guests?.rows ?? []}
            value={guests?.rows?.find((x: { id: string }) => x.id === formData.guest) || null}
            getOptionLabel={(option) => option.name}
            onChange={handleGuestsChange}
            renderInput={(params) => <TextField {...params} label="Guests" margin="none" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
          />
        ) : (
          <>
            <TextField
              autoFocus
              fullWidth
              name="name"
              margin="dense"
              variant="outlined"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Box sx={{ my: 2 }} />
            <TextField
              autoFocus
              fullWidth
              name="email"
              margin="dense"
              variant="outlined"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Box sx={{ my: 2 }} />

            <MuiPhoneNumber
              name="phone"
              label="Phone Number"
              defaultCountry="ke"
              variant="outlined"
              fullWidth
              onChange={(e) => handlePhoneChange(e as unknown as string)}
              InputLabelProps={{ shrink: true }}
              value={formData.phone}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {isGuest.value ? 'Onboard Guest' : 'Onboard Manager'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const AddMenu = () => (
    <>
      {' '}
      <Typography sx={{ m: 1 }}>Managers</Typography>
      <IconButton onClick={handleClick}>
        <Iconify icon="mingcute:add-line" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleNewManager} sx={{ display: 'flex', gap: 1 }}>
          <Iconify icon="mingcute:add-line" />
          New Manager
        </MenuItem>
        <MenuItem onClick={handleNewGuestManager} sx={{ display: 'flex', gap: 1 }}>
          <Iconify icon="ic:round-link" />
          New Guest Manager
        </MenuItem>
      </Menu>
    </>
  );
  const GuestAndAdminList = () => (
    <List>
      {adminsList.length > 0 &&
        adminsList.map((manager) => (
          <ListItem key={manager.id}>
            <ListItemAvatar>
              {manager.photo ? (
                <Avatar src={manager.photo} />
              ) : (
                <Avatar>
                  <Iconify icon="carbon:user-avatar-filled" width={24} />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={manager.name}
              secondary={manager.isGuest ? 'Guest' : 'Manager'}
            />
          </ListItem>
        ))}
    </List>
  );

  const HeadingSection = () => (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.customShadows.z16,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {client?.name.charAt(0) ?? ''}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {client?.name ?? ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Code: {offer?.campaignRun?.code}  */}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Box sx={{ width: 20, height: 20, color: 'primary.main' }}>🏣</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Organization
            </Typography>
            <Typography variant="subtitle2">{client?.name ?? ''}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
            }}
          >
            <Box sx={{ width: 20, height: 20, color: 'success.main' }}>📅</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="subtitle2">
              {formatDate(client?.created ?? new Date(), 'MMM dd, yyyy') || '2024 Nov 21'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }}
          >
            <Box sx={{ width: 20, height: 20, color: 'error.main' }}>🎯</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
            <Typography variant="subtitle2">{client?.clientType.name ?? ''}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
            }}
          >
            <Box sx={{ width: 20, height: 20, color: 'warning.main' }}>⏰</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Client No
            </Typography>
            <Typography variant="subtitle2">{client?.clientNo}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  return (
    <DashboardContent>
      <Card sx={{ p: 5 }}>
        <Box sx={{ height: 600 }}>
          <CustomBreadcrumbs
            heading="Clients Details"
            links={[
              { name: 'Dashboard', href: paths.v2.admin.root },
              { name: 'Enterprise Clients', href: paths.v2.admin.clients.enterprise.root },
              { name: 'Details' },
            ]}
          />
          <HeadingSection />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Item
                sx={{
                  textAlign: 'center',

                  height: '50vh',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <AddMenu />
                </Box>
                <GuestAndAdminList />
              </Item>
            </Grid>
            <Grid item xs={8}>
              <Item>
                <GuestAndAdminForm />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </DashboardContent>
  );
}

const tranformedAdmins = (admins: Array<TUser>) =>
  admins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    photo: admin.profile.photo,
    isGuest: false,
  }));
const tranformedGuestAdmins = (guests: Array<TUser>) =>
  guests.map((guest) => ({
    id: guest.id,
    name: guest.name,
    photo: guest.profile.photo,
    isGuest: true,
  }));
