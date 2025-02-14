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
      {
        title: 'Access Control',
        path: paths.v2[ERole.ADMIN].accessControl,
        icon: ICONS.lock,
        children: [
          {
            title: 'Sessions',
            path: paths.v2[ERole.ADMIN].sessions,
            icon: ICONS.external,
          },
          {
            title: 'Accounts',
            path: paths.v2[ERole.ADMIN].users,
            icon: ICONS.user,
            children: [
              {
                title: 'Admins',
                path: paths.v2[ERole.ADMIN].users + '/admins',
                icon: ICONS.menuItem,
              },
              {
                title: 'Agents',
                path: paths.v2[ERole.ADMIN].users + '/agents',
                icon: ICONS.menuItem,
              },
              {
                title: 'Guests',
                path: paths.v2[ERole.ADMIN].users + '/guests',
                icon: ICONS.menuItem,
              },
              {
                title: 'Tier One',
                path: paths.v2[ERole.ADMIN].users + '/t1',
                icon: ICONS.menuItem,
              },
              {
                title: 'Tier Two',
                path: paths.v2[ERole.ADMIN].users + '/t2',
                icon: ICONS.menuItem,
              },
            ],
          },
          {
            title: 'Roles',
            path: paths.v2[ERole.ADMIN].roles,
            icon: ICONS.lock,
            children: [
              {
                title: 'Agent & Admins',
                path: paths.v2[ERole.ADMIN].roles + '/t0',
                icon: ICONS.menuItem,
              },
              {
                title: 'Tier One',
                path: paths.v2[ERole.ADMIN].roles + '/t1',
                icon: ICONS.menuItem,
              },
              {
                title: 'Tier Two',
                path: paths.v2[ERole.ADMIN].roles + '/t2',
                icon: ICONS.menuItem,
              },
            ],
          },
          {
            title: 'Permissions',
            path: paths.v2[ERole.ADMIN].permissions,
            icon: ICONS.parameter,
          },
        ],
      },
      {
        title: 'Clients',
        path: paths.v2[ERole.ADMIN].clients.t1,
        icon: ICONS.ecommerce,
        children: [
          {
            title: 'Tier 1',
            path: paths.v2[ERole.ADMIN].clients.t1,
            icon: ICONS.menuItem,
          },
          {
            title: 'Tier 2',
            path: paths.v2[ERole.ADMIN].clients.t2,
            icon: ICONS.menuItem,
          },
        ],
      },
      {
        title: 'Shop',
        path: paths.v2[ERole.ADMIN].shops.root,
        icon: ICONS.banking,
        children: [
          {
            title: 'Shops',
            path: paths.v2[ERole.ADMIN].shops.root,
            icon: ICONS.banking,
          },
          {
            title: 'Sectors',
            path: paths.v2[ERole.ADMIN].shops.sectors,
            icon: ICONS.folder,
          },
          {
            title: 'Categories',
            path: paths.v2[ERole.ADMIN].shops.categories,
            icon: ICONS.label,
          },
        ],
      },
      {
        title: 'Utilities',
        path: paths.v2[ERole.ADMIN].utilities.units,
        icon: ICONS.parameter,
        children: [
          {
            title: 'Units of Measure',
            path: paths.v2[ERole.ADMIN].utilities.units,
            icon: ICONS.analytics,
          },
          {
            title: 'Product',
            path: paths.v2[ERole.ADMIN].utilities.product.categories,
            icon: ICONS.parameter,
            children: [
              {
                title: 'Categories',
                path: paths.v2[ERole.ADMIN].utilities.product.categories,
                icon: ICONS.label,
              },
              {
                title: 'Sub-categories',
                path: paths.v2[ERole.ADMIN].utilities.product.subCategories,
                icon: ICONS.folder,
              },
            ],
          },
        ],
      },
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
      { title: 'Clients', path: paths.v2[ERole.MARKETING_AGENCY].clients, icon: ICONS.label },
      { title: 'Projects', path: paths.v2[ERole.MARKETING_AGENCY].projects, icon: ICONS.folder },
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
