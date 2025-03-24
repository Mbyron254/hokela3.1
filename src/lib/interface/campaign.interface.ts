export interface ICampaignCreate {
  clientTier2Id?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

export interface ICampaignUpdate {
  id?: string;
  clientTier2Id?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

// export interface ICampaignRunCreate {
//   projectId?: string;
//   campaignId?: string;
//   runTypeId?: string;
//   managerId?: string;
//   dateStart?: Date;
//   dateStop?: Date;
//   checkInAt?: string;
//   checkOutAt?: string;
//   closeAdvertOn?: Date;
// }

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
  projectId?: string;
  campaignId?: string;
  runTypeId?: string;
  managerId?: string;
  dateStart?: Date;
  dateStop?: Date;
  checkInAt?: string;
  checkOutAt?: string;
  closeAdvertOn?: Date;
}

export interface IAgentAllocation {
  index: number;
  id: string;
  quantityAllocated: number;
  quantitySold: number;
  product: {
    name: string;
    photo: string;
    package: string;
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
