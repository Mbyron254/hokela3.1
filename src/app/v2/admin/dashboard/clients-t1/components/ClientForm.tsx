import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

interface ClientFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: 'create' | 'update';
  input: any;
  setInput: (input: any) => void;
  clientTypes: any[];
  handleSubmit: () => void;
  loading: boolean;
}

export function ClientForm({
  open,
  setOpen,
  mode,
  input,
  setInput,
  clientTypes,
  handleSubmit,
  loading,
}: ClientFormProps) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'New Client' : 'Edit Client'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Client Name"
          fullWidth
          value={input.name || ''}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
        />
        <TextField
          select
          margin="dense"
          label="Client Type"
          fullWidth
          value={input.clientTypeId || ''}
          onChange={(e) =>
            setInput({
              ...input,
              clientTypeId: e.target.value === '' ? undefined : e.target.value,
            })
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {clientTypes?.rows?.map((type: any) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 