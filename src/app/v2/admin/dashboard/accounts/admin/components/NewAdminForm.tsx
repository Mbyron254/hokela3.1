'use client'

import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { isRestrictedRole } from "src/lib/helpers";
import { GQLMutation } from "src/lib/client";
import { M_ROLES_MINI } from "src/lib/mutations/role.mutation";
import { USER_CREATE_ALIEN } from "src/lib/mutations/user.mutation";

export function NewAdminForm({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const { action: getRolesMini, data: roles } = GQLMutation({
        mutation: M_ROLES_MINI,
        resolver: 'm_roles',
        toastmsg: false,
    });

    const [inputCreate, setInputCreate] = useState({
        name: '',
        email: '',
        phone: '',
        roleId: '',
    });

    const { action: create, loading: creating } = GQLMutation({
        mutation: USER_CREATE_ALIEN,
        resolver: 'userCreateAlien',
        toastmsg: true,
    });

    useEffect(() => {
        getRolesMini({
            variables: {
                input: {},
            },
        });
    }, []);

    const handleCreate = () => {
        create({ 
            variables: { 
                input: {
                    ...inputCreate,
                    roleId: inputCreate.roleId === '' ? undefined : inputCreate.roleId
                } 
            } 
        });
        if (!creating) {
            setOpen(false);
        }
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputCreate({
            ...inputCreate,
            [field]: event.target.value
        });
    };

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Admin</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Official Full Name"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={inputCreate.name}
                        onChange={handleInputChange('name')}
                    />

                    <TextField
                        fullWidth
                        type="email"
                        margin="dense"
                        label="Email Address"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={inputCreate.email}
                        onChange={handleInputChange('email')}
                    />

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Phone Number"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={inputCreate.phone}
                        onChange={handleInputChange('phone')}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="dense"
                        label="Role"
                        variant="outlined"
                        defaultValue=""
                        SelectProps={{
                            native: true,
                        }}
                        value={inputCreate.roleId}
                        onChange={handleInputChange('roleId')}
                    >
                        <option value="">Select a role</option>
                        {roles?.rows.map((role: any, index: number) => {
                            if (!isRestrictedRole(role.name)) {
                                return (
                                    <option value={role.id} key={`role-${index}`}>
                                        {role.name}
                                    </option>
                                );
                            }
                        })}
                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
                        Close
                    </Button>

                    <Button 
                        onClick={handleCreate} 
                        variant="contained" 
                        color="primary"
                        disabled={creating}
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}