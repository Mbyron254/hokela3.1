import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

import { ERole } from 'src/types/client';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

const adminNavData = [
  {
    subheader: 'Admin Dashboard',
    items: [
      { title: 'Overview', path: paths.v2[ERole.ADMIN].root, icon: ICONS.dashboard },
      { title: 'Users', path: paths.v2[ERole.ADMIN].users, icon: ICONS.user },
      { title: 'Sessions', path: paths.v2[ERole.ADMIN].sessions, icon: ICONS.analytics },
    ],
  },
];

const agentNavData = [
  {
    subheader: 'Agent App',
    items: [
      { title: 'Dashboard', path: paths.v2[ERole.AGENT].root, icon: ICONS.dashboard },
      { title: 'Campaigns', path: paths.v2[ERole.AGENT].campaigns.root, icon: ICONS.analytics },
      { title: 'Jobs', path: paths.v2[ERole.AGENT].campaigns.offers.root, icon: ICONS.job },
      { title: 'Applications', path: paths.v2[ERole.AGENT].jobs.applications, icon: ICONS.file },

      // {
      //   title: 'Campaigns',
      //   path: paths.v2[ERole.AGENT].campaigns.root,
      //   icon: ICONS.analytics,
      //   children: [
      //     { title: 'Runs', path: paths.v2[ERole.AGENT].campaigns.root },
      //     { title: 'Offers', path: paths.v2[ERole.AGENT].campaigns.offers.root },
      //   ],
      // },
    ],
  },
  // {
  //   // subheader: 'Jobs',
  //   items: [
  //     {
  //       title: 'Jobs',
  //       path: paths.v2[ERole.AGENT].root,
  //       icon: ICONS.job,
  //       children: [
  //         { title: 'Adverts', path: paths.v2[ERole.AGENT].jobs.Adverts },
  //         { title: 'Applications', path: paths.v2[ERole.AGENT].jobs.Applications },
  //       ],
  //     },
  //   ],
  // },
];

const producerNavData = [
  {
    subheader: 'Producer Dashboard',
    items: [{ title: 'Overview', path: paths.v2[ERole.PRODUCER].root, icon: ICONS.dashboard }],
  },
];

const distributorNavData = [
  {
    subheader: 'Distributor Dashboard',
    items: [{ title: 'Overview', path: paths.v2[ERole.DISTRIBUTOR].root, icon: ICONS.dashboard }],
  },
];

const retailerNavData = [
  {
    subheader: 'Retailer Dashboard',
    items: [{ title: 'Overview', path: paths.v2[ERole.RETAILER].root, icon: ICONS.dashboard }],
  },
];

const marketingNavData = [
  {
    subheader: 'Marketing Dashboard',
    items: [
      { title: 'Overview', path: paths.v2[ERole.MARKETING_AGENCY].root, icon: ICONS.dashboard },
      {
        title: 'Clients',
        path: paths.v2[ERole.MARKETING_AGENCY].clients.list,
        icon: ICONS.label,
        // children: [
        //   { title: 'List', path: paths.v2[ERole.MARKETING_AGENCY].clients.list },
        //   {
        //     title: 'Details',
        //     path: paths.v2[ERole.MARKETING_AGENCY].clients.list,
        //   },
        // ],
      },
      {
        title: 'Projects',
        path: paths.v2[ERole.MARKETING_AGENCY].projects.list,
        icon: ICONS.folder,
      },
      {
        title: 'Campaigns',
        path: paths.v2[ERole.MARKETING_AGENCY].campaigns,
        icon: ICONS.calendar,
      },
      { title: 'Runs', path: paths.v2[ERole.MARKETING_AGENCY].runs, icon: ICONS.external },
      {
        title: 'Surveys',
        path: paths.v2[ERole.MARKETING_AGENCY].surveys,
        icon: ICONS.chat,
      },

      {
        title: 'Jobs',
        path: paths.v2[ERole.MARKETING_AGENCY].jobs.overview,
        icon: ICONS.job,
        children: [
          {
            title: 'Overview',
            path: paths.v2[ERole.MARKETING_AGENCY].jobs.overview,
            icon: ICONS.dashboard,
          },
          {
            title: 'Applications',
            path: paths.v2[ERole.MARKETING_AGENCY].jobs.applications,
            icon: ICONS.course,
          },
          {
            title: 'Run Offers',
            path: paths.v2[ERole.MARKETING_AGENCY].jobs.offers,
            icon: ICONS.file,
          },
        ],
      },
      {
        title: 'Products',
        path: paths.v2[ERole.MARKETING_AGENCY].products.overview,
        icon: ICONS.order,
        children: [
          {
            title: 'Overview',
            path: paths.v2[ERole.MARKETING_AGENCY].products.overview,
            icon: ICONS.dashboard,
          },
          {
            title: 'Reciepts',
            path: paths.v2[ERole.MARKETING_AGENCY].products.reciepts,
            icon: ICONS.invoice,
          },
        ],
      },
      {
        title: 'Access Controll',
        path: paths.v2[ERole.MARKETING_AGENCY].userManagement.users,
        icon: ICONS.lock,
        children: [
          {
            title: 'Users',
            path: paths.v2[ERole.MARKETING_AGENCY].userManagement.users,
            icon: ICONS.user,
          },
          {
            title: 'Roles',
            path: paths.v2[ERole.MARKETING_AGENCY].userManagement.roles,
            icon: ICONS.file,
          },
        ],
      },
    ],
  },
];

// Determine role from current path
const getCurrentRole = () => {
  const path = window.location.pathname;
  if (path.includes('/admin/')) return ERole.ADMIN;
  if (path.includes('/agent/')) return ERole.AGENT;
  if (path.includes('/producer/')) return ERole.PRODUCER;
  if (path.includes('/distributor/')) return ERole.DISTRIBUTOR;
  if (path.includes('/retailer/')) return ERole.RETAILER;
  if (path.includes('/marketing/')) return ERole.MARKETING_AGENCY;
  return ERole.AGENT; // Default to agent if no match
};

export const navData = (() => {
  const role = getCurrentRole();
  switch (role) {
    case ERole.ADMIN:
      return adminNavData;
    case ERole.AGENT:
      return agentNavData;
    case ERole.PRODUCER:
      return producerNavData;
    case ERole.DISTRIBUTOR:
      return distributorNavData;
    case ERole.RETAILER:
      return retailerNavData;
    case ERole.MARKETING_AGENCY:
      return marketingNavData;
    default:
      return agentNavData;
  }
})();
