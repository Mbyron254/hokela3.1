import type { IDateValue } from './common';

export enum ERole {
  ADMIN = 'admin',
  AGENT = 'agent',
  PRODUCER = 'producer',
  DISTRIBUTOR = 'distributor',
  RETAILER = 'retailer',
  MARKETING_AGENCY = 'marketing',
}

// ----------------------------------------------------------------------

export type TClientType = {
  __typename?: 'TClientType';
  id: string;
  name: string;
};

export type TProject = {
  __typename: 'TProject';
  id: string;
  name: string;
};

export type TClientTier2 = {
  __typename: 'TClientTier2';
  index: number;
  id: string;
  clientNo: string;
  name: string;
  created: string;
  clientType: TClientType;
  projects: TProject[];
};

export type TClientsTier2 = {
  __typename: 'TClientsTier2';
  count: number;
  rows: TClientTier2[];
};

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};
