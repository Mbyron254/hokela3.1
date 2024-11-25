import type { IMenu } from '../interface/menu.interface';

const menu: IMenu[] = [
  {
    category: 'MARKETING NAVIGATION',
    title: '',
    icon: '',
    path: '',
    children: [],
  },
  {
    title: 'Home',
    path: 'c-marketing',
    icon: 'mdi mdi-home-outline',
    children: [],
  },
  {
    title: 'Access Control',
    path: 'access-control',
    icon: 'mdi mdi-shield-account-outline',
    children: [
      {
        title: 'Users',
        path: 'c-marketing/users',
        icon: 'mdi mdi-account-group-outline',
        children: [],
      },
      {
        title: 'Roles',
        path: 'c-marketing/roles',
        icon: 'mdi mdi-shield-half-full',
        children: [],
      },
    ],
  },
  {
    title: 'Clients',
    path: 'c-marketing/clients',
    icon: 'mdi mdi-google-my-business',
    children: [],
  },
  {
    title: 'Projects',
    path: 'c-marketing/projects',
    icon: 'mdi mdi-briefcase-variant-outline',
    children: [],
  },
  {
    title: 'Campaigns',
    path: 'c-marketing/campaigns',
    icon: 'mdi mdi-state-machine',
    children: [],
  },
  {
    title: 'Campaign Runs',
    path: 'c-marketing/runs',
    icon: 'mdi mdi-all-inclusive',
    children: [],
  },
  {
    title: 'Jobs',
    path: 'jobs',
    icon: 'mdi mdi-briefcase-account-outline',
    children: [
      {
        title: 'Dashboard',
        path: 'c-marketing/jobs',
        icon: 'mdi mdi-desktop-mac-dashboard',
        children: [],
      },
      {
        title: 'Applications',
        path: 'c-marketing/jobs/applications',
        icon: 'mdi mdi-tray-full',
        children: [],
      },
      {
        title: 'Run Offers',
        path: 'c-marketing/jobs/offers',
        icon: 'mdi mdi-license',
        children: [],
      },
    ],
  },
];

export default menu;
