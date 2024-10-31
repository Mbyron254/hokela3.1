export interface IUserCreate {
  clientTier1Id?: string;
  name?: string;
  phone?: string;
  email?: string;
  roleId?: string;
}

export interface IT1AccountManagerCreate {
  name?: string;
  phone?: string;
  email?: string;
  clientTier1Id?: string;
}

export interface IT2AccountManagerCreate {
  name?: string;
  phone?: string;
  email?: string;
  clientTier2Id?: string;
}

export interface IT1OrdinaryUserCreate {
  name?: string;
  phone?: string;
  email?: string;
  roleId?: string;
  clientTier1Id?: string;
}

export interface IT2OrdinaryUserCreate {
  name?: string;
  phone?: string;
  email?: string;
  roleId?: string;
  clientTier2Id?: string;
}

export interface IT1GuestAsAccountManager {
  userId?: string;
  clientTier1Id?: string;
}
