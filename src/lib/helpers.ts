import { format } from 'date-fns';
import { TState } from './interface/general.interface';
import {
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  ROLE_AC_MANAGER,
  ROLE_AGENT,
  ROLE_GUEST,
  ROLE_ROOT,
  USER_AC_STATE,
} from './constant';

export const isWhiteSpaces = (_string: string): boolean => {
  return /^\s+$/.test(_string);
};

export const randomHexadecimal = (size: number): string => {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
};

export const unallocatedAssets = (associated: any[], all: any[]): any[] => {
  const unallocatedIds: string[] = [];

  for (let i = 0; i < all.length; i++) {
    unallocatedIds.push(all[i].id);
  }

  for (let i = 0; i < associated.length; i++) {
    unallocatedIds.splice(unallocatedIds.indexOf(associated[i].id), 1);
  }
  const availlableAssets: any = [];

  for (let i = 0; i < unallocatedIds.length; i++) {
    for (let x = 0; x < all.length; x++) {
      if (unallocatedIds[i] === all[x].id) {
        availlableAssets.push(all[x]);
      }
    }
  }
  return availlableAssets;
};

export const commafy = (num: string | number) => {
  if (!num || num === '') return '';

  let str = num.toString().split('.');

  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 4) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }

  return str.join('.');
};

export const formatDate = (
  date: Date | undefined,
  _format?: string
): string => {
  if (!date) return '';

  return format(new Date(date), _format ? _format : 'yyyy MMM dd, hh:mm b');
};

export const formatTimeTo12Hr = (time: string | undefined): string => {
  if (!time) return '';

  return format(new Date(`1995-06-02T${time}:00`), 'hh:mm a');
};

export const parseUserState = (state: number): TState => {
  let theme = 'light';
  let label = '---';

  switch (state) {
    case USER_AC_STATE.unconfirmed:
      theme = 'warning';
      label = 'Unconfirmed';
      break;

    case USER_AC_STATE.active:
      theme = 'success';
      label = 'Active';
      break;

    case USER_AC_STATE.suspended:
      theme = 'danger';
      label = 'Suspended';
      break;
  }

  return { theme, label };
};

export const isSystemRole = (name: string): boolean => {
  let isSystem = false;

  switch (name) {
    case ROLE_ROOT:
      isSystem = true;
      break;

    case ROLE_AGENT:
      isSystem = true;
      break;

    case ROLE_GUEST:
      isSystem = true;
      break;

    case ROLE_AC_MANAGER:
      isSystem = true;
      break;
    default:
      break;
  }
  return isSystem;
};

export const isRestrictedRole = (name: string): boolean => {
  let isSystem = false;

  switch (name) {
    case ROLE_ROOT:
      isSystem = true;
      break;

    case ROLE_AGENT:
      isSystem = true;
      break;

    case ROLE_GUEST:
      isSystem = true;
      break;

    default:
      break;
  }
  return isSystem;
};

export const internationalizePhoneNumber = (phoneNumber: string): string => {
  let phone = phoneNumber;

  if (phoneNumber[3] === '0') {
    phone = phoneNumber.slice(0, 3) + phoneNumber.slice(4);
  }
  return phone;
};

export const userAccountLabel = (user: any): string => {
  let accountLabel = '';

  if (user?.role?.name === ROLE_AGENT) {
    accountLabel = 'Agent';
  } else if (!user?.role?.clientTier1 && !user?.role?.clientTier2) {
    accountLabel = 'Administrator';
  }
  if (user?.role?.clientTier1 || user?.role?.clientTier2) {
    const clientType =
      user.role?.clientTier1?.clientType?.name ||
      user.role?.clientTier2?.clientType?.name;

    switch (clientType) {
      case CLIENT_TYPE_PRODUCER:
        accountLabel = 'Producer';
        break;
      case CLIENT_TYPE_DISTRIBUTOR:
        accountLabel = 'Distributor';
        break;
      case CLIENT_TYPE_RETAILER:
        accountLabel = 'Retailor';
        break;
      case CLIENT_TYPE_MARKETING_AGENCY:
        accountLabel = 'Marketing Agency';
        break;
      default:
        break;
    }
  }
  return accountLabel;
};
