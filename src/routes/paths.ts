import { ERole } from '../types/client';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  V2: '/v2',
};

// ----------------------------------------------------------------------
const v2_paths = {
  [ERole.ADMIN]: {
    root: `${ROOTS.V2}/admin/dashboard`,
    session: `${ROOTS.V2}/admin/dashboard/sessions`,
    permissions: `${ROOTS.V2}/admin/dashboard/permissions`,

    clients: {
      enterprise: `${ROOTS.V2}/admin/dashboard/clients/enterprise`,
      sme: `${ROOTS.V2}/admin/dashboard/clients/sme`,
    },
    shop: {
      shops: `${ROOTS.V2}/admin/dashboard/shops`,
      sectors: `${ROOTS.V2}/admin/dashboard/shops/sectors`,
      category: `${ROOTS.V2}/admin/dashboard/shops/category`,
    },
    utilities: {
      root: `${ROOTS.V2}/admin/dashboard/utilities`,
      products: {
        category: `${ROOTS.V2}/admin/dashboard/utilities/category`,
        sub_category: `${ROOTS.V2}/admin/dashboard/utilities/sub-category`,
      },
    },

    accounts: {
      admin: `${ROOTS.V2}/admin/dashboard/accounts/admin`,
      agent: `${ROOTS.V2}/admin/dashboard/accounts/agent`,
      guest: `${ROOTS.V2}/admin/dashboard/accounts/guest`,
      enterprise: `${ROOTS.V2}/admin/dashboard/accounts/enterprise`,
      sme: `${ROOTS.V2}/admin/dashboard/accounts/sme`,
    },
    roles: {
      agentsAndAdmins: `${ROOTS.V2}/admin/dashboard/roles/admin`,
      enterprise: `${ROOTS.V2}/admin/dashboard/roles/enterprise`,
      sme: `${ROOTS.V2}/admin/dashboard/roles/sme`,
    },
  },
  [ERole.AGENT]: {
    root: `${ROOTS.V2}/agent/dashboard`,
    profile: `${ROOTS.V2}/agent/profile`,
    account: `${ROOTS.V2}/agent/dashboard/profile`,
    addProfile: `${ROOTS.V2}/agent/profile/add`,
    settings: `${ROOTS.V2}/agent/settings`,
    editProfile: (id: string) => `${ROOTS.V2}/agent/profile/edit/${id}`,
    campaigns: {
      root: `${ROOTS.V2}/agent/dashboard/campaigns/runs`,
      details: (id: string) => `${ROOTS.V2}/agent/dashboard/campaigns/runs/${id}`,
      offers: {
        root: `${ROOTS.V2}/agent/dashboard/campaigns/offers`,
        details: (id: string) => `${ROOTS.V2}/agent/dashboard/campaigns/offers/${id}`,
      },
    },
    jobs: {
      root: `${ROOTS.V2}/agent/dashboard/job`,
      applications: `${ROOTS.V2}/agent/dashboard/job/applications`,
    },
  },
  [ERole.PRODUCER]: {
    root: `${ROOTS.V2}/producer/dashboard`,
  },
  [ERole.DISTRIBUTOR]: {
    root: `${ROOTS.V2}/distributor/dashboard`,
  },
  [ERole.RETAILER]: {
    root: `${ROOTS.V2}/retailer/dashboard`,
  },
  [ERole.MARKETING_AGENCY]: {
    root: `${ROOTS.V2}/marketing/dashboard`,
    clients: {
      list: `${ROOTS.V2}/marketing/dashboard/clients`,
      new: `${ROOTS.V2}/marketing/dashboard/clients/new`,
      details: (id: string) => `${ROOTS.V2}/marketing/dashboard/clients/${id}`,
    },
    projects: {
      list: `${ROOTS.V2}/marketing/dashboard/projects`,
      details: (id: string) => `${ROOTS.V2}/marketing/dashboard/projects/${id}`,
    },
    campaigns: `${ROOTS.V2}/marketing/dashboard/campaigns`,
    runs: `${ROOTS.V2}/marketing/dashboard/runs`,
    surveys: `${ROOTS.V2}/marketing/dashboard/surveys`,
    jobs: {
      overview: `${ROOTS.V2}/marketing/dashboard/jobs`,
      applications: `${ROOTS.V2}/marketing/dashboard/jobs/applications`,
      offers: `${ROOTS.V2}/marketing/dashboard/jobs/offers`,
    },
    products: {
      overview: `${ROOTS.V2}/marketing/dashboard/products`,
      reciepts: `${ROOTS.V2}/marketing/dashboard/products/reciepts`,
    },
    userManagement: {
      users: `${ROOTS.V2}/marketing/dashboard/user-management`,
      roles: `${ROOTS.V2}/marketing/dashboard/user-management/roles`,
    },
  },
};

export const paths = {
  faqs: '/faqs',
  changelog: 'https://docs.minimals.cc/changelog',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    main: {
      signIn: `${ROOTS.AUTH}/main/sign-in`,
      signUp: `${ROOTS.AUTH}/main/sign-up`,
      updatePassword: `${ROOTS.AUTH}/main/update-password`,
      resetPassword: `${ROOTS.AUTH}/main/reset-password`,
      forgotPassword: `${ROOTS.AUTH}/main/forgot-password`,
      unlock: `${ROOTS.AUTH}/main/unlock`,
    },
  },
  v2: v2_paths,
};
