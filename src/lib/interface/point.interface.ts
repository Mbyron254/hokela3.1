export interface IPointCreate {
  shopId?: string;
  radius?: number;
  newShop?: {
    shopSectorId?: string;
    shopCategoryId?: string;
    name?: string;
    lat?: number;
    lng?: number;
  };
}

export interface IPointUpdate {
  id?: string;
  shopId?: string;
  radius?: number;
  newShop?: {
    shopSectorId?: string;
    shopCategoryId?: string;
    name?: string;
    lat?: number;
    lng?: number;
  };
}

export interface IPoint {
  lat: number;
  lng: number;
}
