export const CLIENT_HOST_DEV = 'http://localhost:3001';
export const CLIENT_HOST_PRO = 'https://hokela-web-r38gp.ondigitalocean.app';
export const SERVER_HOST_DEV = 'http://localhost:3000';
export const SERVER_HOST_PRO = 'https://hokela-api-abrgd.ondigitalocean.app';
export const DO_SPACE_ORIGIN = 'https://---.com'; // <--- Change
export const SERVER_API_DEV_GQL = `${SERVER_HOST_DEV}/graphql`;
export const SERVER_API_PRO_GQL = `${SERVER_HOST_PRO}/graphql`;
export const SERVER_API_DEV_RST = `${SERVER_HOST_DEV}/api`;
export const SERVER_API_PRO_RST = `${SERVER_HOST_PRO}/api`;
export const HEADER_KEY_CLIENT = 'Client';
export const HEADER_VAL_CLIENT = 'APP_WEBSITE';
export const COOKIE_PREFIX = 'hokela';
export const SESSION_COOKIE = `${COOKIE_PREFIX}_website`;
export const DEFAULT_IMAGE = 'image_default.jpg';
export const TABLE_IMAGE_WIDTH = 30;
export const TABLE_IMAGE_HEIGHT = 30;
export const ROLE_ROOT = 'Root';
export const ROLE_AGENT = 'Agent';
export const ROLE_GUEST = 'Guest';
export const ROLE_AC_MANAGER = 'Account Manager';
export const CLIENT_TYPE_PRODUCER = 'Producer';
export const CLIENT_TYPE_DISTRIBUTOR = 'Distributor';
export const CLIENT_TYPE_RETAILER = 'Retailer';
export const CLIENT_TYPE_MARKETING_AGENCY = 'Marketing Agency';
export const QUERY_REVALIDATE_INTERVAL_MS = 500;
export const COUNTRY_NAME_CODES = ['ke', 'tz', 'ug', 'rw', 'et'];

export enum USER_AC_STATE {
  unconfirmed = 0,
  active,
  suspended,
}
