export interface IShopCreate {
  shopCategoryId?: string;
  shopSectorId?: string;
  name?: string;
  lat?: number;
  lng?: number;
}

export interface IShopUpdate {
  id?: string;
  shopCategoryId?: string;
  shopSectorId?: string;
  name?: string;
  lat?: number;
  lng?: number;
}
