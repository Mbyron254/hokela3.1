import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IOrderHistory = {
  orderTime: IDateValue;
  paymentTime: IDateValue;
  deliveryTime: IDateValue;
  completionTime: IDateValue;
  timeline: { title: string; time: IDateValue }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subtotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  createdAt: IDateValue;
  history: IOrderHistory;
  payment: IOrderPayment;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  shippingAddress: IOrderShippingAddress;
};

type TCampaignRun = {
  __typename: 'TCampaignRun';
  id: string;
};

type TUser = {
  __typename: 'TUser';
  id: string;
  name: string;
};

export type TClientTier2 = {
  __typename?: 'TClientTier2';
  id: string;
  name: string;
};

export type TProject = {
  __typename: 'TProject';
  id: string;
  index: number;
  name: string;
  dateStart: string;
  dateStop: string;
  description: string;
  created: string;
  clientTier2: TClientTier2;
  manager: TUser;
  campaignRuns: TCampaignRun[];
};

export type TProjects = {
  __typename: 'TProjects';
  count: number;
  rows: TProject[];
};
export type IProjectItem = {
  id: string;
  name: string;
  client: string;
  createdAt?: IDateValue;
  campaigns?: number;
  startDate: IDateValue;
  endDate: IDateValue;
  status?: string;
  // totalAmount: number;
  // totalQuantity: number;
  // createdAt: IDateValue;
  // history: IOrderHistory;
  // payment: IOrderPayment;
  // customer: IOrderCustomer;
  // delivery: IOrderDelivery;
  // items: IOrderProductItem[];
  // shippingAddress: IOrderShippingAddress;
};
