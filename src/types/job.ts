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
  title: string;
  description: string;
  createdAt?: string;
  closeAdvertOn: string;
  experience: string;
  role: string;
  locations: string[];
  employmentTypes: string[];
  benefits: string[];
  totalViews: number;
  company: {
    name: string;
    logo: string;
  };
  salary: {
    negotiable: boolean;
    price: number;
  };
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
  candidates: any[]; // You might want to define a more specific type for candidates
}

export type IJobDetails = {
  id: string;
  closeAdvertOn: string;
  campaign: {
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
};
