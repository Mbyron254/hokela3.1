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

export interface ICampaignRunCreate {
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
