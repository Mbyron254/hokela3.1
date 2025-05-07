export interface ICampaignCreate {
  projectId?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

export interface ICampaignUpdate {
  id?: string;
  projectId?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

export interface ICampaignRunCreate {
  campaignId?: string;
  managerId?: string;
  posterId?: string;
  runTypeIds: string[];
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  clockType?: string;
  clockInPhotoLabel?: string;
  clockOutPhotoLabel?: string;
  clockInTime?: string;
  clockOutTime?: string;
  locationPingFrequency?: number;
  closeAdvertOn?: Date;
}

export interface ICampaignRunUpdate {
  id?: string;
  campaignId?: string;
  managerId?: string;
  posterId?: string;
  runTypeIds: string[];
  name?: string;
  dateStart?: Date;
  dateStop?: Date;
  clockType?: string;
  clockInPhotoLabel?: string;
  clockOutPhotoLabel?: string;
  clockInTime?: string;
  clockOutTime?: string;
  locationPingFrequency?: number;
  closeAdvertOn?: Date;
}

export interface IAgentAllocation {
  index: number;
  id: string;
  quantityAllocated: number;
  quantitySold: number;
  unitPrice: number;
  giveawayConfigId?: string;
  product: {
    name: string;
    photo: string;
    package: string;
    packaging: string;
  };
  giveaway: {
    totalUnlocked: number;
    totalIssued: number;
    packaging: {
      id: string;
      unitQuantity: number;
      product: {
        id: string;
        name: string;
        photos: {
          id: string;
        }[];
      };
      unit: {
        id: string;
        name: string;
      };
    };
  };
}

export interface IAgentFreeGiveawayAllocations {
  index: number;
  id: string;
  quantityAllocated: number;
  quantityGiven: number;
  product: {
    name: string;
    photo: string;
    package: string;
  };
}

export interface IInputSaleItem {
  allocationId?: string;
  quantitySold?: number;
}

export interface IInputSale {
  salesRef?: string;
  shopId?: string;
  newShop?: {
    shopSectorId?: string;
    shopCategoryId?: string;
    name?: string;
    lat?: number;
    lng?: number;
  };
}

export interface IInputSaleSurvey {
  respondentName?: string;
  respondentPhone?: string;
  respondentEmail?: string;
  responses?: any[];
}
