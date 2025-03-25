import type { Dispatch, SetStateAction } from 'react';

import { format } from 'date-fns';

import {
  ROLE_ROOT,
  CODE_KENYA,
  ROLE_AGENT,
  ROLE_GUEST,
  CODE_RWANDA,
  CODE_UGANDA,
  CODE_ETHIOPIA,
  CODE_TANZANIA,
  USER_AC_STATE,
  CLIENT_HOST_DEV,
  CLIENT_HOST_PRO,
  ROLE_AC_MANAGER,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
} from './constant';

import type {
  TState,
  IGeoLocation,
  IAgentOriginContext,
  ISurveyReportBody,
} from './interface/general.interface';
import axios from 'axios';

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

export const isWhiteSpaces = (_string: string): boolean => /^\s+$/.test(_string);

export const randomHexadecimal = (size: number): string => [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

export const generateShortUUIDV4 = (): string => short.generate();

export const unallocatedAssets = (associated: any[], all: any[]): any[] => {
  const unallocatedIds = all.map(item => item.id);

  associated.forEach(item => {
    const index = unallocatedIds.indexOf(item.id);
    if (index > -1) {
      unallocatedIds.splice(index, 1);
    }
  });

  const availableAssets = all.filter(item => 
    unallocatedIds.includes(item.id)
  );

  return availableAssets;
};

export const commafy = (num: string | number) => {
  if (!num || num === '') return '0';

  const str = num.toString().split('.');

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

  return format(new Date(date), _format || 'yyyy MMM dd, hh:mm b');
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

    default:
      theme = 'light';
      label = '---';
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
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
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

export const downloadCSVSurveyReport = (
  data: ISurveyReportBody,
  setDownloading: Dispatch<SetStateAction<boolean>>,
) => {
  const _reportName = data._reportName;

  delete data._reportName;

  setDownloading(true);
  axios({
    url: `/excel/survey-reports`,
    method: 'post',
    responseType: 'blob',
    timeout: 0,
    data: { ...data, page: data.page! - 1 },
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `${new Date().toISOString()}-hokela-report-${_reportName}.xlsx`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('::: Survey Report Download Error -------->');
      console.error(error);
    })
    .finally(() => setDownloading(false));
};