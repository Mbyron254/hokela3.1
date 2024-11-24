// ----------------------------------------------------------------------

export type IJobFilters = {
  roles: string[];
  experience: string;
  locations: string[];
  benefits: string[];
  employmentTypes: string[];
};

export type IJobCandidate = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IJobCompany = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IJobSalary = {
  type: string;
  price: number;
  negotiable: boolean;
};

export interface IJobItem {
  id: string;
  closeAdvertOn: string;
  campaign: {
    id: string;
    name: string;
    jobDescription: string;
    jobQualification: string;
    clientTier2: {
      name: string;
      clientTier1: {
        name: string;
      };
    };
  };
  candidates?: any[]; // Add proper type if you have candidate data structure
}
