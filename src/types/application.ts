export type TUserProfile = {
  photo: string | null;
};

export type TUser = {
  name: string;
  profile: TUserProfile;
};

export type TAgent = {
  id: string;
  user: TUser;
};

export type TProject = {
  name: string;
};

export type TClientTier1 = {
  name: string;
};

export type TClientTier2 = {
  name: string;
  clientTier1: TClientTier1;
};

export type TCampaign = {
  name: string;
  clientTier2: TClientTier2;
};

export type TCampaignRun = {
  id: string;
  code: string;
  closeAdvertOn: string;
  project: TProject;
  campaign: TCampaign;
};

export type TCampaignRunApplication = {
  index: number;
  id: string;
  created: string;
  agent: TAgent;
  campaignRun: TCampaignRun;
};

export type TCampaignRunApplications = {
  count: number;
  rows: TCampaignRunApplication[];
};
