'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { CLIENT_T1_CREATE, CLIENT_T1_UPDATE, CLIENT_T1_RECYCLE, CLIENT_T1_RESTORE } from 'src/lib/mutations/client-t1.mutation';
import { Q_CLIENTS_T1, Q_CLIENTS_T1_RECYCLED } from 'src/lib/queries/client-t1.query';
import { Q_CLIENT_TYPES_MINI } from 'src/lib/queries/client.query';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, Divider } from '@mui/material';

const EnterpriseListView = () => {
  const router = useRouter();
  const usersQueryFilters = { page: 0, pageSize: 10 };

  const { data: clientTypes } = GQLQuery({
    query: Q_CLIENT_TYPES_MINI,
    queryAction: 'clientTypes',
    variables: { input: {} },
  });

  const { refetch: refetchClientsActive, data: clientsActive, loading: loadingClientsActive } = GQLQuery({
    query: Q_CLIENTS_T1,
    queryAction: 'tier1Clients',
    variables: { input: usersQueryFilters },
  });

  const { refetch: refetchClientsRecycled, data: clientsRecycled, loading: loadingClientsRecycled } = GQLQuery({
    query: Q_CLIENTS_T1_RECYCLED,
    queryAction: 'tier1ClientsRecycled',
    variables: { input: usersQueryFilters },
  });

  const { action: create, loading: creating } = GQLMutation({
    mutation: CLIENT_T1_CREATE,
    resolver: 'tier1ClientCreate',
    toastmsg: true,
  });

  const { action: update, loading: updating } = GQLMutation({
    mutation: CLIENT_T1_UPDATE,
    resolver: 'tier1ClientUpdate',
    toastmsg: true,
  });

  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: CLIENT_T1_RECYCLE,
    resolver: 'tier1ClientRecycle',
    toastmsg: true,
  });

  const { action: restore, loading: restoring } = GQLMutation({
    mutation: CLIENT_T1_RESTORE,
    resolver: 'tier1ClientRestore',
    toastmsg: true,
  });

  const [open, setOpen] = useState(false);
  const [inputCreate, setInputCreate] = useState({
    clientTypeId: '',
    name: '',
  });

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
    setOpen(false);
  };

  const handleRecycle = () => {
    if (selectedActive.length) {
      recycle({ variables: { input: { ids: selectedActive } } });
    }
  };

  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/admin/clients-t1/${clientId}`);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Client
      </Button>
      <Button variant="outlined" onClick={handleRecycle} disabled={recycling}>
        Recycle Selected
      </Button>
      <Button variant="outlined" onClick={handleRestore} disabled={restoring}>
        Restore Selected
      </Button>
      
      <List>
        <h3>Active Clients</h3>
        {loadingClientsActive ? (
          <p>Loading...</p>
        ) : (
          clientsActive?.rows.map((client: any, index: number) => (
            <ListItem key={`active-client-${index}`} button onClick={() => handleClientClick(client.id)}>
              <ListItemText primary={client.name} secondary={client.clientType?.name} />
            </ListItem>
          ))
        )}
      </List>
      
      <Divider />

      <List>
        <h3>Recycled Clients</h3>
        {loadingClientsRecycled ? (
          <p>Loading...</p>
        ) : (
          clientsRecycled?.rows.map((client: any, index: number) => (
            <ListItem key={`recycled-client-${index}`} button onClick={() => handleClientClick(client.id)}>
              <ListItemText primary={client.name} secondary={client.clientType?.name} />
            </ListItem>
          ))
        )}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Client Name"
            type="text"
            fullWidth
            variant="standard"
            value={inputCreate.name}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="client-type-label">Client Type</InputLabel>
            <Select
              labelId="client-type-label"
              id="clientType"
              value={inputCreate.clientTypeId}
              onChange={(e) => setInputCreate({ ...inputCreate, clientTypeId: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {clientTypes?.rows.map((clientType: any, index: number) => (
                <MenuItem value={clientType.id} key={`client-type-${index}`}>
                  {clientType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnterpriseListView;