export interface IProductCreate {
  groupId?: string;
  productSubCategoryId?: string;
  name?: string;
  description?: string;
  photoIds: string[];
}

export interface IProductUpdate {
  id?: string;
  groupId?: string;
  productSubCategoryId?: string;
  name?: string;
  description?: string;
  photoIds?: string[];
}

export interface IPackagingCreate {
  unitId?: string;
  unitQuantity?: number;
  cost?: string;
  _name?: string;
}

export interface IPackagingUpdate {
  id?: string;
  unitId?: string;
  unitQuantity?: number;
  cost?: string;
  _name?: string;
}
