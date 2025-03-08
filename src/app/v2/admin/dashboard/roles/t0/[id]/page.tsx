'use client';

import { useState, useEffect } from 'react';
import { Typography, Paper, Stack, Button } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from '@/lib/client';
import { ROLE, ROLE_ASSIGN_PERMISSIONS } from '@/lib/mutations/role.mutation';
import { Q_PERMISSIONS_MINI } from '@/lib/queries/general.query';
import { isSystemRole } from '@/lib/helpers';
import { LoadingDiv } from '@/components/LoadingDiv';
import { SelectMultiple } from '@/components/SelectMultiple';

export default function RoleProfile({ params: { id } }: any) {
  const { action: getRole, data: role } = GQLMutation({
    mutation: ROLE,
    resolver: 'role',
    toastmsg: false,
  });
  const { loading: loadingPermissions, data: permissions } = GQLQuery({
    query: Q_PERMISSIONS_MINI,
    queryAction: 'permissions',
    variables: { input: {} },
  });
  const {
    action: associate,
    loading: associating,
    data: assigned,
  } = GQLMutation({
    mutation: ROLE_ASSIGN_PERMISSIONS,
    resolver: 'roleAssignPermissions',
    toastmsg: true,
  });

  const [disabled, setDisabled] = useState<boolean>(true);
  const [options, setOptions] = useState<any>([]);
  const [optionsAll, setOptionsAll] = useState<any[]>([]);
  const [optionsSelected, setOptionsSelected] = useState<any>([]);

  const loadRole = (id: string) => {
    if (id) getRole({ variables: { input: { id } } });
  };
  const handleAssociation = () => {
    if (role) {
      const ids: string[] = [];

      for (let x = 0; x < optionsSelected.length; x++) {
        ids.push(optionsSelected[x].id);
      }
      associate({ variables: { input: { id: role.id, ids } } });
    }
  };

  useEffect(() => {
    loadRole(id);
  }, [id, assigned]);
  useEffect(() => {
    if (role?.permissions) setOptionsSelected(role.permissions);
  }, [role]);
  useEffect(() => {
    if (role) {
      if (isSystemRole(role.name)) setDisabled(true);
      else setDisabled(false);
    }
  }, [role]);
  useEffect(() => {
    if (permissions?.rows) {
      setOptions(permissions.rows);
      setOptionsAll(permissions.rows);
    }
  }, [permissions]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Role Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <div className='row'>
          <div className='col-md-6'>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography>{role?.name}</Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="text.secondary">Users</Typography>
                <Typography>{role?.users?.length} users</Typography>
              </div>
            </Stack>
          </div>
          <div className='col-md-6'>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">Permissions</Typography>
                <Typography>{role?.permissions?.length} permissions</Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                <Typography>{role?.created}</Typography>
              </div>
            </Stack>
          </div>
        </div>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {loadingPermissions ? (
          <LoadingDiv />
        ) : (
          <>
            <SelectMultiple
              asset='permission'
              disable={disabled}
              checkbox={false}
              disablePreselected={false}
              allOptions={optionsAll as any}
              options={options}
              setOptions={setOptions}
              selected={optionsSelected}
              setSelected={setOptionsSelected}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={disabled || associating}
              onClick={handleAssociation}
              startIcon={<span className="mdi mdi-refresh" />}
              sx={{ mt: 3 }}
            >
              Update Permissions
            </Button>
          </>
        )}
      </Paper>
    </DashboardContent>
  );
}
