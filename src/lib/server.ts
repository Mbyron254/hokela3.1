'use client'

import { Dispatch, SetStateAction } from 'react';

import type { DocumentNode} from 'graphql';

import { print } from 'graphql';
import axios, { AxiosRequestConfig } from 'axios';

import {
  DEFAULT_IMAGE,
  CLIENT_HOST_DEV,
  CLIENT_HOST_PRO,
  HEADER_KEY_CLIENT,
  HEADER_VAL_CLIENT,
  SERVER_API_DEV_GQL,
  SERVER_API_PRO_GQL,
  SERVER_HOST_DEV,
  SERVER_HOST_PRO,
} from './constant';
import { IPictureUpload } from './interface/general.interface';

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
    if (rs.errors?.length) {
      console.log('GQL Errors =======> ');

      for (let i = 0; i < rs.errors.length; i += 1) {
        console.log(rs.errors[i]);
      }
    }
    return null; // Add explicit return
  } catch (error) {
    console.log('SAPI Error =======> ', error);
    return null; // Add explicit return
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


export const uploadPhoto = async (
  base64Data: string | null | undefined,
  setPhoto: Dispatch<SetStateAction<IPictureUpload>>,
  reference?: string,
): Promise<void> => {
  if (!base64Data) return;

  const blob = await (await fetch(base64Data)).blob();
  const file = new File([blob], 'outputFileName.jpg', { type: 'image/jpeg' });

  setPhoto({ loading: true });

  const config: AxiosRequestConfig = {
    headers: {
      [HEADER_KEY_CLIENT]: HEADER_VAL_CLIENT,
    },
  };

  const formData = new FormData();

  formData.append('file', file);

  try {
    let url: string;

    switch (process.env.NODE_ENV) {
      case 'development':
        url = `${SERVER_HOST_DEV}/document/u-local`;
        break;
      case 'production':
        url = `${SERVER_HOST_PRO}/document/u-space`;
        break;
      default:
        url = `${SERVER_HOST_PRO}/document/u-space`;
    }

    const data = (await axios.post(url, formData, config))?.data;

    setPhoto({ loading: false, id: data.id, reference });
  } catch (error) {
    console.log('~~~~~~~~~~~~~ PICTURE UPLOAD ERROR ~~~~~~~~~~~~~');
    console.log(error);

    setPhoto({ loading: false });
  }
};
