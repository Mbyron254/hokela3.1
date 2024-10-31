'use client';

import { DocumentNode, print } from 'graphql';
import {
  CLIENT_HOST_DEV,
  CLIENT_HOST_PRO,
  DEFAULT_IMAGE,
  HEADER_KEY_CLIENT,
  HEADER_VAL_CLIENT,
  SERVER_API_DEV_GQL,
  SERVER_API_PRO_GQL,
} from './constant';

export const serverGateway = async (GQLDN: DocumentNode, variables: any) => {
  let uri: string;

  switch (process.env.NODE_ENV) {
    case 'development':
      uri = SERVER_API_DEV_GQL;
      break;
    case 'production':
      uri = SERVER_API_PRO_GQL;
      break;
    default:
      uri = SERVER_API_PRO_GQL;
  }

  try {
    const rs: any = await (
      await fetch(uri, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
          [HEADER_KEY_CLIENT]: HEADER_VAL_CLIENT,
        },
        body: JSON.stringify({ query: print(GQLDN), variables }),
      })
    )?.json();

    // console.log('+++++++++++++++++++++++++++++++');
    // console.log(variables);
    // console.log(rs);

    if (rs.data) return rs.data;
    else if (rs.errors?.length) {
      console.log('GQL Errors =======> ');

      for (let i = 0; i < rs.errors; i++) {
        console.log(rs.errors[i]);
      }
    }
  } catch (error) {
    console.log('SAPI Error =======> ', error);
  }
};

export const sourceImage = (filename?: string) => {
  if (!filename) return `/img/${DEFAULT_IMAGE}`;

  let host;

  switch (process.env.NODE_ENV) {
    case 'development':
      host = CLIENT_HOST_DEV;
      break;
    case 'production':
      host = CLIENT_HOST_PRO;
      break;
    default:
      host = CLIENT_HOST_PRO;
  }
  return `${host}/document/f/${filename}`;
};
