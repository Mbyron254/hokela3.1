import { format } from 'date-fns';
import {
  IAgentOriginContext,
  IGeoLocation,
  TState,
} from './interface/general.interface';
import {
  CLIENT_HOST_DEV,
  CLIENT_HOST_PRO,
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  CODE_ETHIOPIA,
  CODE_KENYA,
  CODE_RWANDA,
  CODE_TANZANIA,
  CODE_UGANDA,
  ROLE_AC_MANAGER,
  ROLE_AGENT,
  ROLE_GUEST,
  ROLE_ROOT,
  USER_AC_STATE,
} from './constant';
import { Dispatch, SetStateAction } from 'react';

const short = require('short-uuid');

export const clientOrigin = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return CLIENT_HOST_DEV;
    case 'production':
      return CLIENT_HOST_PRO;
    default:
      return CLIENT_HOST_PRO;
  }
};

export const isWhiteSpaces = (_string: string): boolean => {
  return /^\s+$/.test(_string);
};

export const randomHexadecimal = (size: number): string => {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
};

export const generateShortUUIDV4 = (): string => {
  return short.generate();
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
  if (!num || num === '') return '0';

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

export const getUserLocationByIp = async (): Promise<any> => {};

export const getGeoLocation = async (
  setLocation: Dispatch<SetStateAction<IGeoLocation | undefined>>
): Promise<void> => {
  /*
    TODO:
    ---------
    1. Consider using the watchPosition() method to continuously monitor the user’s location, if required.
    2. Get location by IP address.
  */

  if (window.navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function (error) {
        if (error.code === error.PERMISSION_DENIED) {
          setLocation({ error: 'Location permission denied' });
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocation({ error: 'Location unavaillable' });
        } else if (error.code === error.TIMEOUT) {
          setLocation({ error: 'Location retrieval timeout' });
          // Recurse function
        } else {
          setLocation({ error: 'Location error' });
        }
      },
      {
        enableHighAccuracy: true, // Slower & uses more battery.
        timeout: 50000, // ms
        maximumAge: 0,
      }
    );
  } else {
    alert(
      'This browser does not support geo-location. Try using another browser'
    );
  }
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

export const agentContext = (code: string): IAgentOriginContext => {
  switch (code) {
    case CODE_RWANDA:
      return {
        nin: {
          title: 'National Identification',
          abbreviation: 'NIN',
        },
        tin: { title: 'Tax Identification', abbreviation: 'TIN' },
        hin: {
          title: 'Community-Based Health Insurance Scheme',
          abbreviation: 'CBHI',
        },
        ssn: {
          title: 'Rwanda Social Security Board',
          abbreviation: 'RSSB',
        },
      };

    case CODE_ETHIOPIA:
      return {
        nin: {
          title: 'National Identification',
          abbreviation: 'NIN',
        },
        tin: { title: 'Tax Identification', abbreviation: 'TIN' },
        hin: {
          title: 'Community-Based Health Insurance Scheme ',
          abbreviation: 'CBHI',
        },
        ssn: {
          title: 'Public Sector Pension',
          abbreviation: 'PSP/POESSA',
        },
      };

    case CODE_KENYA:
      return {
        nin: {
          title: 'National ID',
          abbreviation: 'NIN',
        },
        tin: {
          title: 'Kenya Revenue Authority PIN',
          abbreviation: 'KRA PIN',
        },
        hin: {
          title: 'Social Health Insurance Fund',
          abbreviation: 'SHIF',
        },
        ssn: {
          title: 'National Social Security Fund',
          abbreviation: 'NSSF',
        },
      };

    case CODE_TANZANIA:
      return {
        nin: {
          title: 'National Identification',
          abbreviation: 'NIN',
        },
        tin: { title: 'Tax Identification', abbreviation: 'TIN' },
        hin: {
          title: 'National Health Insurance Fund',
          abbreviation: 'NHIF',
        },
        ssn: {
          title: 'National Social Security Fund',
          abbreviation: 'NSSF',
        },
      };

    case CODE_UGANDA:
      return {
        nin: {
          title: 'National Identification',
          abbreviation: 'NIN',
        },
        tin: { title: 'Tax Identification', abbreviation: 'TIN' },
        hin: {
          title: 'National Health Insurance Scheme',
          abbreviation: 'NHIS',
        },
        ssn: {
          title: 'National Social Security Fund',
          abbreviation: 'NSSF',
        },
      };

    default:
      return {
        nin: {
          title: '',
          abbreviation: '',
        },
        tin: {
          title: '',
          abbreviation: '',
        },
        hin: {
          title: '',
          abbreviation: '',
        },
        ssn: {
          title: '',
          abbreviation: '',
        },
      };
  }
};
