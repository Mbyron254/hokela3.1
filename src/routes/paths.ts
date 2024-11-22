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
    users: `${ROOTS.V2}/admin/users`,
    sessions: `${ROOTS.V2}/admin/sessions`
  },
  [ERole.AGENT]: {
    root: `${ROOTS.V2}/agent/dashboard`,
    profile: `${ROOTS.V2}/agent/profile`,
    addProfile: `${ROOTS.V2}/agent/profile/add`,
    settings: `${ROOTS.V2}/agent/settings`, 
    editProfile: (id: string) => `${ROOTS.V2}/agent/profile/edit/${id}`,
    campaigns: {
      root: `${ROOTS.V2}/agent/dashboard/campaigns/runs`,
      details: (id: string) => `${ROOTS.V2}/agent/dashboard/campaigns/runs/${id}`,
      offers: `${ROOTS.V2}/agent/dashboard/campaigns/offers`,
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
  }
};

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    main: {
      signIn: `${ROOTS.AUTH}/main/sign-in`,
      signUp: `${ROOTS.AUTH}/main/sign-up`,
      updatePassword: `${ROOTS.AUTH}/main/update-password`,
      resetPassword: `${ROOTS.AUTH}/main/reset-password`,
    },
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },

  // admin:{   
  //   dashboard: {
  //     root: ROOTS.DASHBOARD,
  //     admin: `${ROOTS.DASHBOARD}/admin/dashboard`,
  //     user: `${ROOTS.DASHBOARD}/user/dashboard`,
  //     two: `${ROOTS.DASHBOARD}/two`,
  //     three: `${ROOTS.DASHBOARD}/three`,
  //     group: {
  //       root: `${ROOTS.DASHBOARD}/group`,
  //       five: `${ROOTS.DASHBOARD}/group/five`,
  //       six: `${ROOTS.DASHBOARD}/group/six`,
  //     },
  //   },
  // },
  v2: v2_paths


};
