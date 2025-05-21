'use client';

import { useEffect, useState } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  PRODUCT_SUB_CATEGORY,
  PRODUCT_SUB_CATEGORY_CREATE,
  PRODUCT_SUB_CATEGORY_RECYCLE,
  PRODUCT_SUB_CATEGORY_RESTORE,
  PRODUCT_SUB_CATEGORY_UPDATE,
} from 'src/lib/mutations/product-sub-category.mutation';
import {
  Q_PRODUCT_SUB_CATEGORIES_ACTIVE,
  Q_PRODUCT_SUB_CATEGORIES_RECYCLED,
} from 'src/lib/queries/product-sub-category.query';
import { Q_PRODUCT_CATEGORIES_MINI } from 'src/lib/queries/product-category.query';
import {
  IProductSubCategoryCreate,
  IProductSubCategoryUpdate,
} from 'src/lib/interface/product-sub-category.interface';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { Button, Tab, Tabs, TextField, Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function Page() {
  const queryFilters = { page: 0, pageSize: 10 };

  const { data: categories } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_MINI,
    queryAction: 'productCategories',
    variables: { input: {} },
  });
  const {
    refetch: refetchSubcategoriesActive,
    data: subcategoriesActive,
    loading: loadingSubcategoriesActive,
  } = GQLQuery({
    query: Q_PRODUCT_SUB_CATEGORIES_ACTIVE,
    queryAction: 'productSubCategories',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchSubcategoriesRecycled,
    data: subcategoriesRecycled,
    loading: loadingSubcategoriesRecycled,
  } = GQLQuery({
    query: Q_PRODUCT_SUB_CATEGORIES_RECYCLED,
    queryAction: 'productSubCategoriesRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getSubcategory,
    loading: loadingSubcategory,
    data: subcategory,
  } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY,
    resolver: 'm_productSubCategory',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_CREATE,
    resolver: 'productSubCategoryCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_UPDATE,
    resolver: 'productSubCategoryUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_RECYCLE,
    resolver: 'productSubCategoryRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_RESTORE,
    resolver: 'productSubCategoryRestore',
    toastmsg: true,
  });

  const _inputUpdate: IProductSubCategoryUpdate = {
    id: undefined,
    productCategoryId: undefined,
    name: undefined,
  };

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [inputCreate, setInputCreate] = useState<IProductSubCategoryCreate>({
    productCategoryId: undefined,
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [tabValue, setTabValue] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columnsActive = [
    { name: '#', selector: (row: any) => row.index },
    { name: 'NAME', selector: (row: any) => row.name },
    { name: 'CATEGORY', selector: (row: any) => row.productCategory?.name },
    { name: 'PRODUCTS', selector: (row: any) => row.products?.length },
    { name: 'REGISTERED', selector: (row: any) => row.created },
    {
      name: 'MORE',
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setInputUpdate(_inputUpdate);
            loadSubCategory(row.id);
            setUpdateModalOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];
  const columnsRecycled = [
    { name: '#', selector: (row: any) => row.index },
    { name: 'NAME', selector: (row: any) => row.name },
    { name: 'CATEGORY', selector: (row: any) => row.productCategory?.name },
    { name: 'PRODUCTS', selector: (row: any) => row.products?.length },
    { name: 'RECYCLED', selector: (row: any) => row.recycled },
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
  const loadSubCategory = (id: string) => {
    getSubcategory({ variables: { input: { id } } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (subcategory) {
      setInputUpdate({
        id: subcategory.id,
        name: subcategory.name,
        productCategoryId: subcategory.productCategory?.id,
      });
    }
  }, [subcategory]);

  return (
    <>
      <CustomBreadcrumbs
        heading="Product Subcategories"
        links={[
          { name: 'Admin', href: '/admin' },
          { name: 'Product Subcategories' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <div className="row">
        <div className="col-12">
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="subcategory tabs">
            <Tab label="Active Records" />
            <Tab label="Recycled Records" />
          </Tabs>

          <div className="tab-content">
            {tabValue === 0 && (
              <div>
                <div className="btn-group mb-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    New Subcategory
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
                      {subcategoriesActive?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsActive.map((column) => (
                            <TableCell key={column.name}>{column.cell ? column.cell(row) : column.selector(row)}</TableCell>
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
                <div className="btn-group mb-2">
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
                      {subcategoriesRecycled?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsRecycled.map((column) => (
                            <TableCell key={column.name}>{column.selector(row)}</TableCell>
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
            aria-labelledby="create-subcategory-modal"
          >
            <Box sx={{ ...modalStyle }}>
              <Typography variant="h6" component="h2">
                New Subcategory
              </Typography>
              <TextField
                label="Subcategory Name"
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
            aria-labelledby="update-subcategory-modal"
          >
            <Box sx={{ ...modalStyle }}>
              {loadingSubcategory ? (
                <LoadingDiv />
              ) : (
                <>
                  <Typography variant="h6" component="h2">
                    Edit Subcategory
                  </Typography>
                  <TextField
                    label="Subcategory Name"
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
