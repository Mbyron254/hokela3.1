export interface IProductGroupCreate {
  clientTier2Id?: string;
  name?: string;
  description?: string;
  markup?: number;
}

export interface IProductGroupUpdate {
  id?: string;
  clientTier2Id?: string;
  name?: string;
  description?: string;
  markup?: number;
}
