import { IMenu } from '../interface/menu.interface';

const menu: IMenu[] = [
  {
    category: 'AGENT NAVIGATION',
    title: '',
    icon: '',
    path: '',
    children: [],
  },
  {
    title: 'Home',
    path: 'agent',
    icon: 'mdi mdi-home-outline',
    children: [],
  },
  {
    title: 'Campaigns',
    path: 'agent/campaigns',
    icon: 'mdi mdi-all-inclusive',
    children: [],
  },
  {
    title: 'Job Advertisements',
    path: 'agent/job-advertisements',
    icon: 'mdi mdi-briefcase-account',
    children: [],
  },
  {
    title: 'Job Applications',
    path: 'agent/job-applications',
    icon: 'mdi mdi-tray-full',
    children: [],
  },
];

export default menu;
