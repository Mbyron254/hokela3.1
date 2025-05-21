'use client';

import { useEffect, useState } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_CREATE,
  PRODUCT_CATEGORY_RECYCLE,
  PRODUCT_CATEGORY_RESTORE,
  PRODUCT_CATEGORY_UPDATE,
} from 'src/lib/mutations/product-category.mutation';
import {
  Q_PRODUCT_CATEGORIES_ACTIVE,
  Q_PRODUCT_CATEGORIES_RECYCLED,
} from 'src/lib/queries/product-category.query';
import {
  IProductCategoryCreate,
  IProductCategoryUpdate,
} from 'src/lib/interface/product-category.interface';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { Button, Tab, Tabs, TextField, Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function Page() {
  const queryFilters = { page: 0, pageSize: 10 };
  const {
    refetch: refetchCategoriesActive,
    data: categoriesActive,
    loading: loadingCategoriesActive,
  } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_ACTIVE,
    queryAction: 'productCategories',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchCategoriesRecycled,
    data: categoriesRecycled,
    loading: loadingCategoriesRecycled,
  } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_RECYCLED,
    queryAction: 'productCategoriesRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getCategory,
    loading: loadingCategory,
    data: category,
  } = GQLMutation({
    mutation: PRODUCT_CATEGORY,
    resolver: 'm_productCategory',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: PRODUCT_CATEGORY_CREATE,
    resolver: 'productCategoryCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: PRODUCT_CATEGORY_UPDATE,
    resolver: 'productCategoryUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: PRODUCT_CATEGORY_RECYCLE,
    resolver: 'productCategoryRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: PRODUCT_CATEGORY_RESTORE,
    resolver: 'productCategoryRestore',
    toastmsg: true,
  });
  const _inputUpdate: IProductCategoryUpdate = {
    id: undefined,
    name: undefined,
  };

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [inputCreate, setInputCreate] = useState<IProductCategoryCreate>({
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [tabValue, setTabValue] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columnsActive = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'SUB-CATEGORIES',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.subCategories?.length,
      cell: (row: any) => row.subCategories?.length,
    },
    {
      name: 'CREATED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'MORE',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <button
          type='button'
          className='btn btn-light btn-sm me-2'
          data-bs-toggle='modal'
          data-bs-target='#update-modal'
          onClick={() => {
            setInputUpdate(_inputUpdate);
            loadCategory(row.id);
          }}
        >
          <i className='mdi mdi-circle-edit-outline'/>
        </button>
      )
    },
  ];
  const columnsRecycled = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'SUB-CATEGORIES',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.subCategories?.length,
      cell: (row: any) => row.subCategories?.length,
    },
    {
      name: 'RECYCLED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.recycled,
      cell: (row: any) => row.recycled,
    },
  ];

  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
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
  const loadCategory = (id: string) => {
    getCategory({ variables: { input: { id } } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (category) {
      setInputUpdate({
        id: category.id,
        name: category.name,
      });
    }
  }, [category]);

  return (
    <>
      <CustomBreadcrumbs
        heading="Product Categories"
        links={[
          { name: 'Admin', href: '/admin' },
          { name: 'Product Categories' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <div className='row'>
        <div className='col-12'>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="category tabs">
            <Tab label="Active Records" />
            <Tab label="Recycled Records" />
          </Tabs>

          <div className='tab-content'>
            {tabValue === 0 && (
              <div>
                <div className='btn-group mb-2'>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    New Category
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRecycle}
                    disabled={recycling}
                  >
                    Recycle
                  </Button>
                </div>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columnsActive.map((column) => (
                          <TableCell key={column.name}>{column.name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoriesActive?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsActive.map((column) => (
                            <TableCell key={column.name}>{column.cell(row)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}

            {tabValue === 1 && (
              <div>
                <div className='btn-group mb-2'>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRestore}
                    disabled={restoring}
                  >
                    Restore
                  </Button>
                </div>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columnsRecycled.map((column) => (
                          <TableCell key={column.name}>{column.name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoriesRecycled?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsRecycled.map((column) => (
                            <TableCell key={column.name}>{column.cell(row)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>

          <Modal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            aria-labelledby="create-category-modal"
          >
            <Box sx={{ ...modalStyle }}>
              <Typography variant="h6" component="h2">
                New Category
              </Typography>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={inputCreate.name}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    name: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={creating}
              >
                Create
              </Button>
            </Box>
          </Modal>

          <Modal
            open={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            aria-labelledby="update-category-modal"
          >
            <Box sx={{ ...modalStyle }}>
              {loadingCategory ? (
                <LoadingDiv />
              ) : (
                <>
                  <Typography variant="h6" component="h2">
                    Edit Category
                  </Typography>
                  <TextField
                    label="Category Name"
                    variant="outlined"
                    fullWidth
                    value={inputUpdate.name}
                    onChange={(e) =>
                      setInputUpdate({
                        ...inputUpdate,
                        name: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    Update
                  </Button>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
