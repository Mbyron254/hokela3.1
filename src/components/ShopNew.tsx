import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Q_SHOP_CATEGORIES_MINI } from 'src/lib/queries/shop-category.query';
import { GQLQuery } from 'src/lib/client';
import { IShopCreate } from 'src/lib/interface/shop.interface';
import { Q_SHOP_SECTORS_MINI } from 'src/lib/queries/shop-sector.query';
import { useState } from 'react';

interface ShopNewProps {
  open: boolean;
  onClose: () => void;
  create: (variables: any) => void;
  creating: boolean;
}

export default function ShopNew({ open, onClose, create, creating }: ShopNewProps) {
  const { data: categories } = GQLQuery({
    query: Q_SHOP_CATEGORIES_MINI,
    queryAction: 'shopCategories',
    variables: { input: {} },
  });
  const { data: sectors } = GQLQuery({
    query: Q_SHOP_SECTORS_MINI,
    queryAction: 'shopSectors',
    variables: { input: {} },
  });

  const [inputCreate, setInputCreate] = useState<IShopCreate>({
    shopCategoryId: undefined,
    shopSectorId: undefined,
    name: undefined,
    lat: undefined,
    lng: undefined,
  });
  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>New Shop</DialogTitle>
      <DialogContent>
        {/* Your existing form fields here, but using Material UI components */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={creating}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
} 