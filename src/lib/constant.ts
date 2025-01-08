export const CLIENT_HOST_DEV = 'http://localhost:3001';
export const CLIENT_HOST_PRO = 'https://hokela-test-oc4vu.ondigitalocean.app';
export const SERVER_HOST_DEV = 'http://localhost:3000';
export const SERVER_HOST_PRO = 'https://hokela-api-9uucl.ondigitalocean.app';
export const DO_SPACE_ORIGIN = 'https://hokela360.blr1.digitaloceanspaces.com';
export const SERVER_API_DEV_GQL = `${SERVER_HOST_DEV}/graphql`;
export const SERVER_API_PRO_GQL = `${SERVER_HOST_PRO}/graphql`;
export const SERVER_API_DEV_RST = `${SERVER_HOST_DEV}/api`;
export const SERVER_API_PRO_RST = `${SERVER_HOST_PRO}/graphql`;
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

export const CODE_RWANDA = '250';
export const CODE_ETHIOPIA = '251';
export const CODE_KENYA = '254';
export const CODE_TANZANIA = '255';
export const CODE_UGANDA = '256';

export enum USER_AC_STATE {
  unconfirmed = 0,
  active,
  suspended,
}
export const TEXT_SHORT = 'text_short';
export const TEXT_LONG = 'text_long';
export const NUMBER = 'number';
export const PHONE_NUMBER = 'phone_number';
export const DATE = 'date';
export const EMAIL = 'email';
export const URL = 'url';
export const RATING = 'rating';
export const DROPDOWN = 'dropdown';
export const CHOICE_SINGLE = 'single_choice';
export const CHOICE_MULTIPLE = 'multiple_choice';
export const MULTIMEDIA = 'multimedia';
export const GEOLOCATION = 'geolocation';

export type TAnswerType =
  | typeof TEXT_SHORT
  | typeof TEXT_LONG
  | typeof NUMBER
  | typeof PHONE_NUMBER
  | typeof DATE
  | typeof EMAIL
  | typeof URL
  | typeof RATING
  | typeof CHOICE_SINGLE
  | typeof CHOICE_MULTIPLE
  | typeof DROPDOWN
  | typeof MULTIMEDIA
  | typeof GEOLOCATION;

export const FORM_ANSWER_TYPES = [
  { value: TEXT_SHORT, label: 'Short Text' },
  { value: TEXT_LONG, label: 'Long Text (Textarea)' },
  { value: NUMBER, label: 'Number' },
  { value: PHONE_NUMBER, label: 'Phone Number' },
  { value: DATE, label: 'Date' },
  { value: EMAIL, label: 'Email Address' },
  { value: URL, label: 'url' },
  { value: RATING, label: 'Rating (Out of 5)' },
  { value: CHOICE_SINGLE, label: 'Single Choice' },
  { value: CHOICE_MULTIPLE, label: 'Multiple Choice' },
  { value: DROPDOWN, label: 'Dropdown' },
  { value: MULTIMEDIA, label: 'Multimedia' },
  { value: GEOLOCATION, label: 'Geolocation' },
];
