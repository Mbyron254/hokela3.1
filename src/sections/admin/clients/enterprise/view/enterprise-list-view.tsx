'use client';

import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { CLIENT_T1_CREATE } from 'src/lib/mutations/client-t1.mutation';
import { Q_CLIENT_TYPES_MINI } from 'src/lib/queries/client.query';

const EnterpriseListView = () => {
  const [open, setOpen] = useState(false);
  const [inputCreate, setInputCreate] = useState({
    clientTypeId: '',
    name: '',
  });

  const { action: create, loading: creating } = GQLMutation({
    mutation: CLIENT_T1_CREATE,
    resolver: 'tier1ClientCreate',
    toastmsg: true,
  });

  const { data: clientTypes } = GQLQuery({
    query: Q_CLIENT_TYPES_MINI,
    queryAction: 'clientTypes',
    variables: { input: {} },
  });

  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Client
      </Button>
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