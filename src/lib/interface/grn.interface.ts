export interface IGRNEntry {
  productId?: string;
  packagingId?: string;
  unitPrice?: string;
  quantityIn?: number;
  _productName?: string;
  _packagingName?: string;
}

export interface IGRNCreate {
  clientTier2Id?: string;
  supplierRef?: string;
  items: IGRNEntry[];
}

export interface IGRNUpdate {
  id?: string;
  unitPrice?: string;
  quantityIn?: number;
  packagingId?: string;
}

export interface IGRNAppend {
  productId?: string;
  packagingId?: string;
  unitPrice?: string;
  quantityIn?: number;
}
