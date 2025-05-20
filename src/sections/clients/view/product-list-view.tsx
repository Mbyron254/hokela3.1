'use client';

import React, { useEffect, useState } from 'react';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { MutationButton } from 'src/components/MutationButton';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  M_PRODUCTS_ACTIVE,
  M_PRODUCTS_RECYCLED,
  PRODUCT,
  PRODUCT_CREATE,
  PRODUCT_RECYCLE,
  PRODUCT_RESTORE,
  PRODUCT_UPDATE,
} from 'src/lib/mutations/product.mutation';
import { IProductCreate, IProductUpdate } from 'src/lib/interface/product.interface';
import { M_PRODUCT_SUB_CATEGORIES_MINI } from 'src/lib/mutations/product-sub-category.mutation';
import { Q_PRODUCT_CATEGORIES_MINI } from 'src/lib/queries/product-category.query';
import { IDocumentWrapper } from 'src/lib/interface/dropzone.type';
import { DropZone } from 'src/components/dropzone/DropZone';
import { M_PRODUCT_GROUPS_MINI } from 'src/lib/mutations/product-group.mutation';
import { LoadingSpan } from 'src/components/LoadingSpan';
import { Packaging } from 'src/components/Packaging';
import { Tabs, Tab, Box, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';

export function ProductList({ clientTier2Id }: { clientTier2Id: string }) {
  const {
    action: getGroups,
    loading: loadingGroups,
    data: groups,
  } = GQLMutation({
    mutation: M_PRODUCT_GROUPS_MINI,
    resolver: 'productGroups',
    toastmsg: false,
  });
  const { data: categories, loading: loadingCategories } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_MINI,
    queryAction: 'productCategories',
    variables: { input: {} },
  });
  const {
    action: getSubcategories,
    data: subcategories,
    loading: loadingSubCategories,
  } = GQLMutation({
    mutation: M_PRODUCT_SUB_CATEGORIES_MINI,
    resolver: 'm_productSubCategories',
    toastmsg: false,
  });
  const {
    action: getProductsActive,
    loading: loadingProductsActive,
    data: productsActive,
  } = GQLMutation({
    mutation: M_PRODUCTS_ACTIVE,
    resolver: 'm_products',
    toastmsg: false,
  });
  const {
    action: getProductsRecycled,
    loading: loadingProductsRecycled,
    data: productsRecycled,
  } = GQLMutation({
    mutation: M_PRODUCTS_RECYCLED,
    resolver: 'm_productsRecycled',
    toastmsg: false,
  });
  const {
    action: getProduct,
    loading: loadingProduct,
    data: product,
  } = GQLMutation({
    mutation: PRODUCT,
    resolver: 'm_product',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: PRODUCT_CREATE,
    resolver: 'productCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: PRODUCT_UPDATE,
    resolver: 'productUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: PRODUCT_RECYCLE,
    resolver: 'productRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: PRODUCT_RESTORE,
    resolver: 'productRestore',
    toastmsg: true,
  });

  const _inputUpdate: IProductUpdate = {
    id: undefined,
    groupId: undefined,
    productSubCategoryId: undefined,
    name: undefined,
    description: undefined,
    photoIds: undefined,
  };
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [inputCreate, setInputCreate] = useState<IProductCreate>({
    groupId: undefined,
    productSubCategoryId: undefined,
    name: undefined,
    description: undefined,
    photoIds: [],
  });
  const [categoryIdCreate, setCategoryIdCreate] = useState<string>();
  const [categoryIdUpdate, setCategoryIdUpdate] = useState<string>();
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [documentsCreate, setDocumentsCreate] = useState<IDocumentWrapper[]>([]);
  const [documentsUpdate, setDocumentsUpdate] = useState<IDocumentWrapper[]>([]);
  const [productId, setProductId] = useState<string>();
  const [tabValue, setTabValue] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // const loadGroups = () => {
  //   if (clientTier2Id) {
  //     getGroups({ variables: { input: { clientTier2Id } } });
  //   }
  // };

  const loadProductsActive = () => {
    if (clientTier2Id) {
      getProductsActive({ variables: { input: { clientTier2Id } } });
    }
  };
  const loadProductsRecycled = () => {
    if (clientTier2Id) {
      getProductsRecycled({ variables: { input: { clientTier2Id } } });
    }
  };
  const loadProduct = (id: string) => {
    getProduct({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (clientTier2Id) create({ variables: { input: { ...inputCreate, clientTier2Id } } });
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

  const renderTableRows = (data: any[], isRecycled: boolean) => data.map((row: any, index: number) => (
    <TableRow key={row.id}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isRecycled ? selectedRecycled.includes(row.id) : selectedActive.includes(row.id)}
          onChange={(e) => {
            const selected = isRecycled ? selectedRecycled : selectedActive;
            const setSelected = isRecycled ? setSelectedRecycled : setSelectedActive;
            if (e.target.checked) {
              setSelected([...selected, row.id]);
            } else {
              setSelected(selected.filter((id) => id !== row.id));
            }
          }}
        />
      </TableCell>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{`${row.group?.name} (${row.group?.markup}%)`}</TableCell>
      <TableCell>{isRecycled ? row.recycled : row.created}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setProductId(row.id)}
        >
          <i className="mdi mdi-sack" />
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setInputUpdate(_inputUpdate);
            loadProduct(row.id);
            setOpenEditModal(true);
          }}
        >
          <i className="mdi mdi-pen" />
        </Button>
      </TableCell>
    </TableRow>
  ));

  useEffect(() => {
    if (clientTier2Id) { getGroups({ variables: { input: { clientTier2Id } } }); }
  }, [getGroups, clientTier2Id]);
  useEffect(() => {
    if (categoryIdCreate || categoryIdUpdate) {
      getSubcategories({
        variables: {
          input: { productCategoryId: categoryIdCreate || categoryIdUpdate },
        },
      });
    }
  }, [categoryIdCreate, categoryIdUpdate, getSubcategories]);
  useEffect(() => {
    if (documentsCreate.length) {
      const photoIds: string[] = [];

      for (let i = 0; i < documentsCreate.length; i+=1) {
        if (documentsCreate[i].meta?.id) {
          if (photoIds.length < 3) {
            photoIds.push(documentsCreate[i].meta?.id);
          } else {
            photoIds.shift();
            photoIds.push(documentsCreate[i].meta?.id);
          }
        }
      }
      setInputCreate({ ...inputCreate, photoIds });
    }
  }, [documentsCreate, inputCreate]);
  useEffect(() => {
    if (documentsUpdate.length) {
      const photoIds: string[] = [];

      for (let i = 0; i < documentsUpdate.length; i+=1) {
        if (documentsUpdate[i].meta?.id) {
          if (photoIds.length < 3) {
            photoIds.push(documentsUpdate[i].meta?.id);
          } else {
            photoIds.shift();
            photoIds.push(documentsUpdate[i].meta?.id);
          }
        }
      }
      setInputUpdate({ ...inputUpdate, photoIds });
    }
  }, [documentsUpdate, inputUpdate]);
  useEffect(() => {
    if (product) {
      setCategoryIdUpdate(product.subCategory?.productCategory?.id);
      setInputUpdate({
        id: product.id,
        groupId: product.group?.id,
        productSubCategoryId: product.subCategory?.id,
        name: product.name,
        description: product.description,
        photoIds: product.photos?.map((photo: any) => photo.id) || [],
      });
    }
  }, [product]);

  return (
    <>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="product tabs">
        <Tab label="Active" />
        <Tab label="Recycled" />
      </Tabs>

      <Box hidden={tabValue !== 0}>
        <Button variant="outlined" onClick={() => setOpenCreateModal(true)} disabled={recycling}>
          New
        </Button>
        <Button variant="outlined" color="error" onClick={handleRecycle} disabled={recycling}>
          Recycle
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedActive.length > 0 && selectedActive.length < productsActive?.rows.length}
                    checked={productsActive?.rows.length > 0 && selectedActive.length === productsActive?.rows.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedActive(productsActive?.rows.map((row: any) => row.id) || []);
                      } else {
                        setSelectedActive([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>CODE</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>GROUP</TableCell>
                <TableCell>CREATED</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableRows(productsActive?.rows || [], false)}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box hidden={tabValue !== 1}>
        <Button variant="outlined" color="warning" onClick={handleRestore} disabled={restoring}>
          Restore
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRecycled.length > 0 && selectedRecycled.length < productsRecycled?.rows.length}
                    checked={productsRecycled?.rows.length > 0 && selectedRecycled.length === productsRecycled?.rows.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecycled(productsRecycled?.rows.map((row: any) => row.id) || []);
                      } else {
                        setSelectedRecycled([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>CODE</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>GROUP</TableCell>
                <TableCell>RECYCLED</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableRows(productsRecycled?.rows || [], true)}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Packaging productId={productId} />

      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <h4>New Product</h4>
          <TextField
            label="Product Name"
            value={inputCreate.name}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Group</InputLabel>
            <Select
              value={inputCreate.groupId}
              onChange={(e) => setInputCreate({ ...inputCreate, groupId: e.target.value })}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {groups?.rows.map((group: any, index: number) => (
                <MenuItem value={group.id} key={`group-${index}`}>
                  {`${group.name} (${group.markup}%)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryIdCreate}
              onChange={(e) => setCategoryIdCreate(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {categories?.rows.map((category: any, index: number) => (
                <MenuItem value={category.id} key={`category-${index}`}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={inputCreate.productSubCategoryId}
              onChange={(e) => setInputCreate({ ...inputCreate, productSubCategoryId: e.target.value })}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {subcategories?.rows.map((subcategory: any, index: number) => (
                <MenuItem value={subcategory.id} key={`subcategory-${index}`}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            placeholder="Product description"
            value={inputCreate.description}
            onChange={(e) => setInputCreate((prevState) => ({ ...prevState, description: e.target.value }))}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <DropZone
            name="photos (Max of 3, 230px by 230px)"
            classes="dropzone text-center mt-3"
            acceptedImageTypes={['.png', '.jpeg', '.jpg', '.webp', '.ico']}
            multiple
            files={documentsCreate}
            setFiles={setDocumentsCreate}
            maxSize={1375000000} // 1GB
          />
          <Button variant="contained" onClick={handleCreate} disabled={creating}>
            Create
          </Button>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={{ ...modalStyle }}>
          {loadingProduct ? (
            <LoadingDiv />
          ) : (
            <>
              <h4>Edit Product</h4>
              <TextField
                label="Product Name"
                value={inputUpdate.name}
                onChange={(e) => setInputUpdate({ ...inputUpdate, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Group</InputLabel>
                <Select
                  value={inputUpdate.groupId}
                  onChange={(e) => setInputUpdate({ ...inputUpdate, groupId: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {groups?.rows.map((group: any, index: number) => (
                    <MenuItem value={group.id} key={`group-${index}`}>
                      {`${group.name} (${group.markup}%)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryIdUpdate}
                  onChange={(e) => setCategoryIdUpdate(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {categories?.rows.map((category: any, index: number) => (
                    <MenuItem value={category.id} key={`category-${index}`}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={inputUpdate.productSubCategoryId}
                  onChange={(e) => setInputUpdate({ ...inputUpdate, productSubCategoryId: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {subcategories?.rows.map((subcategory: any, index: number) => (
                    <MenuItem value={subcategory.id} key={`subcategory-u-${index}`}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                placeholder="Product description"
                value={inputUpdate.description}
                onChange={(e) => setInputUpdate((prevState) => ({ ...prevState, description: e.target.value }))}
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
              <DropZone
                name="photos (Max of 3, 230px by 230px)"
                classes="dropzone text-center mt-2"
                acceptedImageTypes={['.png', '.jpeg', '.jpg', '.webp', '.ico']}
                multiple
                files={documentsUpdate}
                setFiles={setDocumentsUpdate}
                maxSize={1375000000} // 1GB
              />
              <Button variant="contained" onClick={handleUpdate} disabled={updating}>
                Update
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
