import type { IMenu } from '../interface/menu.interface';

const menu: IMenu[] = [
  {
    category: 'ADMIN NAVIGATION',
    title: '',
    icon: '',
    path: '',
    children: [],
  },
  {
    title: 'Home',
    path: 'admin',
    icon: 'mdi mdi-home-outline',
    children: [],
  },
  {
    title: 'Access Control',
    path: 'access-control',
    icon: 'mdi mdi-shield-account-outline',
    children: [
      {
        title: 'Sessions',
        path: 'admin/sessions',
        icon: 'mdi mdi-login-variant',
        children: [],
      },
      {
        title: 'Accounts',
        path: 'users',
        icon: 'mdi mdi-account-group-outline',
        children: [
          {
            title: 'Admins',
            path: 'admin/users/admins',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Agents',
            path: 'admin/users/agents',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Guests',
            path: 'admin/users/guests',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Tier One',
            path: 'admin/users/t1',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Tier Two',
            path: 'admin/users/t2',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
        ],
      },
      {
        title: 'Roles',
        path: 'roles',
        icon: 'mdi mdi-shield-half-full',
        children: [
          {
            title: 'Agent & Admins',
            path: 'admin/roles/t0',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Tier One',
            path: 'admin/roles/t1',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
          {
            title: 'Tier Two',
            path: 'admin/roles/t2',
            icon: 'mdi mdi-arrow-right',
            children: [],
          },
        ],
      },
      {
        title: 'Permissions',
        path: 'admin/permissions',
        icon: 'mdi mdi-shield-key-outline',
        children: [],
      },
    ],
  },
  {
    title: 'Clients',
    path: 'clients',
    icon: 'mdi mdi-google-my-business',
    children: [
      {
        title: 'Tier 1',
        path: 'admin/clients-t1',
        icon: 'mdi mdi-arrow-right',
        children: [],
      },
      {
        title: 'Tier 2',
        path: 'admin/clients-t2',
        icon: 'mdi mdi-arrow-right',
        children: [],
      },
    ],
  },
  // {
  //   title: 'Access Cotroll',
  //   path: 'accounts',
  //   icon: 'mdi mdi-shield-lock-open-outline',
  //   children: [
  //     {
  //       title: 'Roles',
  //       path: 'ac/roles',
  //       icon: 'mdi mdi-key-outline',
  //       children: [],
  //     },
  //     {
  //       title: 'Users',
  //       path: 'ac/users',
  //       icon: 'mdi mdi-account-multiple-outline',
  //       children: [],
  //     },
  //   ],
  // },
  // {
  //   title: 'Utilities',
  //   path: 'utilities',
  //   icon: 'mdi mdi-tools',
  //   children: [
  //     {
  //       title: 'Delimination',
  //       path: 'kenya-delimination',
  //       icon: 'mdi mdi-map',
  //       children: [
  //         {
  //           title: 'Kenya',
  //           path: 'delimination-kenya',
  //           icon: 'mdi mdi-hexagon-outline',
  //           children: [
  //             {
  //               title: 'Counties',
  //               path: 'portal/utility/counties',
  //               icon: 'mdi mdi-arrow-right-thin',
  //             },
  //             {
  //               title: 'Constituencies',
  //               path: 'portal/utility/constituencies',
  //               icon: 'mdi mdi-arrow-right-thin',
  //             },
  //             {
  //               title: 'Ward',
  //               path: 'portal/utility/wards',
  //               icon: 'mdi mdi-arrow-right-thin',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default menu;
