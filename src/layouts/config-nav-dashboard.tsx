import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
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
  clients: <Iconify icon="fluent:people-28-filled" />,
  shop: <Iconify icon="solar:shop-linear" />,
  utilities: <Iconify icon="material-symbols:inbox-customize-rounded" />,
  account: <Iconify icon="fluent:person-16-filled" />,
  roles: <Iconify icon="oui:app-users-roles" />,
  permission: <Iconify icon="ic:baseline-lock" />,
  sessions: <Iconify icon="majesticons:list-box" />,
};

// ----------------------------------------------------------------------

const adminNavData = [
  {
    subheader: 'Admin Dashboard',
    items: [
      { title: 'Overview', path: paths.v2[ERole.ADMIN].root, icon: ICONS.dashboard },
      {
        title: 'Clients',
        path: paths.v2[ERole.ADMIN].clients.enterprise,
        icon: ICONS.clients,
        children: [
          { title: 'Enterprise Clients', path: paths.v2[ERole.ADMIN].clients.enterprise.root }, // Tire 1 Clients
          { title: 'SME Clients', path: paths.v2[ERole.ADMIN].clients.sme }, // Tire 2 Clients
        ],
      },
      {
        title: 'Shop',
        path: paths.v2[ERole.ADMIN].shop.shops,
        icon: ICONS.shop,
        children: [
          { title: 'Shops', path: paths.v2[ERole.ADMIN].shop.shops },
          { title: 'Sectors', path: paths.v2[ERole.ADMIN].shop.sectors },
          { title: 'Category', path: paths.v2[ERole.ADMIN].shop.category },
        ],
      },
      {
        title: 'Utilities',
        path: paths.v2[ERole.ADMIN].utilities.root,
        icon: ICONS.utilities,
        children: [
          { title: 'Unit Of Measure', path: paths.v2[ERole.ADMIN].utilities.root },
          {
            title: 'Products',
            path: paths.v2[ERole.ADMIN].utilities.products.category,
            children: [
              { title: 'Category', path: paths.v2[ERole.ADMIN].utilities.products.category },
              { title: 'Subcategory', path: paths.v2[ERole.ADMIN].utilities.products.sub_category },
            ],
          },
        ],
      },
    ],
  },
  {
    subheader: 'Access Control',
    items: [
      {
        title: 'Account',
        path: paths.v2[ERole.ADMIN].accounts.admin,
        icon: ICONS.account,
        children: [
          { title: 'Admin', path: paths.v2[ERole.ADMIN].accounts.admin },
          { title: 'Agents', path: paths.v2[ERole.ADMIN].accounts.agent },
          { title: 'Guests', path: paths.v2[ERole.ADMIN].accounts.guest },
          {
            title: 'Enterprise Clients',
            path: paths.v2[ERole.ADMIN].accounts.enterprise,
          },
          { title: 'SME Clients', path: paths.v2[ERole.ADMIN].accounts.sme },
        ],
      },
      {
        title: 'Roles',
        path: paths.v2[ERole.ADMIN].roles.agentsAndAdmins,
        icon: ICONS.roles,
        children: [
          {
            title: 'Agents & Admins',
            path: paths.v2[ERole.ADMIN].roles.agentsAndAdmins,
          },
          {
            title: 'Enterprise Clients',
            path: paths.v2[ERole.ADMIN].roles.enterprise,
          },
          { title: 'SME Clients', path: paths.v2[ERole.ADMIN].roles.sme },
        ],
      },
      { title: 'Sessions', path: paths.v2[ERole.ADMIN].session, icon: ICONS.sessions },
      { title: 'Permissions', path: paths.v2[ERole.ADMIN].permissions, icon: ICONS.permission },
    ],
  },
];

const agentNavData = [
  {
    subheader: 'Agent App',
    items: [
      { title: 'Dashboard', path: paths.v2[ERole.AGENT].root, icon: ICONS.dashboard },
      { title: 'Campaigns', path: paths.v2[ERole.AGENT].campaigns.root, icon: ICONS.analytics },
      { title: 'Janta', path: paths.v2[ERole.AGENT].campaigns.offers.root, icon: ICONS.job },
      { title: 'Applications', path: paths.v2[ERole.AGENT].janta.applications, icon: ICONS.file },
    ],
  },
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
        title: 'Janta',
        path: paths.v2[ERole.MARKETING_AGENCY].janta.overview,
        icon: ICONS.job,
        children: [
          {
            title: 'Overview',
            path: paths.v2[ERole.MARKETING_AGENCY].janta.overview,
            icon: ICONS.dashboard,
          },
          {
            title: 'Applications',
            path: paths.v2[ERole.MARKETING_AGENCY].janta.applications,
            icon: ICONS.course,
          },
          {
            title: 'Run Offers',
            path: paths.v2[ERole.MARKETING_AGENCY].janta.offers,
            icon: ICONS.file,
          },
        ],
      },
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
      { title: 'Runs', path: paths.v2[ERole.MARKETING_AGENCY].runs, icon: ICONS.external },
      {
        title: 'Surveys',
        path: paths.v2[ERole.MARKETING_AGENCY].surveys,
        icon: ICONS.chat,
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
      // {
      //   title: 'Access Controll',
      //   path: paths.v2[ERole.MARKETING_AGENCY].userManagement.users,
      //   icon: ICONS.lock,
      //   children: [
      //     {
      //       title: 'Users',
      //       path: paths.v2[ERole.MARKETING_AGENCY].userManagement.users,
      //       icon: ICONS.user,
      //     },
      //     {
      //       title: 'Roles',
      //       path: paths.v2[ERole.MARKETING_AGENCY].userManagement.roles,
      //       icon: ICONS.file,
      //     },
      //   ],
      // },
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
