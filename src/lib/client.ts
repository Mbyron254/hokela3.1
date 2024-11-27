'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import { enqueueSnackbar } from 'notistack';
import { onError } from '@apollo/client/link/error';
import { from, HttpLink, useQuery, useMutation, ApolloClient, InMemoryCache } from '@apollo/client';

import { HEADER_KEY_CLIENT, HEADER_VAL_CLIENT, SERVER_API_DEV_GQL, SERVER_API_PRO_RST, QUERY_REVALIDATE_INTERVAL_MS } from './constant';

import type {
  IGQLQuery,
  IGQLMutation,
  InputGQLQuery,
  InputGQLMutation,
} from './interface/general.interface';

let client: ApolloClient<any> | null = null;

const getClient = () => {
  if (!client || typeof window === undefined) {
    const uri = process.env.NODE_ENV === 'production' ? SERVER_API_PRO_RST : SERVER_API_DEV_GQL;
    
    client = new ApolloClient({
      link: from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            console.log(graphQLErrors);
          }
          if (networkError) {
            console.error('Network error', networkError);
          }
        }),
        new HttpLink({
          uri,
          credentials: 'include',
        }),
      ]),
      cache: new InMemoryCache(),
    });
  }
  return client;
};

export const GQLQuery = (input: InputGQLQuery): IGQLQuery => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const client = getClient();

  const { query, queryAction, variables } = input;
  const { refetch, loading, data } = useQuery(query, {
    client,
    pollInterval: QUERY_REVALIDATE_INTERVAL_MS,
    variables: variables || {},
    context: {
      headers: {
        [HEADER_KEY_CLIENT]: HEADER_VAL_CLIENT,
      },
      fetchOptions: { next: { revalidate: 5 } },
    },
    onError: (error: any) => {
      let message = '';

      if (error.cause?.extensions?.originalError?.message?.length) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < error.cause.extensions.originalError.message.length; i++) {
          message += `${error.cause.extensions.originalError.message[i]}\n`;
        }
      } else {
        message = error.message;
      }
      enqueueSnackbar(message, { variant: 'error' });

      console.log('------------- QUERY EROR --------------');
      console.log(JSON.stringify(error, null, 2));
    },
  });

  return { refetch, loading, data: data ? data[queryAction] : null };
};

export const GQLMutation: any = (input: InputGQLMutation): IGQLMutation => {
  const { mutation, resolver, toastmsg, callback } = input;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const client = getClient();
  const [action, { loading, data }] = useMutation(mutation, {
    client,
    context: {
      headers: {
        [HEADER_KEY_CLIENT]: HEADER_VAL_CLIENT,
      },
    },
    onError: (error) => {
      // toastError(error.message);
      enqueueSnackbar(error.message, { variant: 'error' });

      console.log('------------- MUTATION EROR --------------');
      console.log(JSON.stringify(error, null, 2));
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onCompleted: (data) => {
      if (data) {
        // toastSuccess(data[resolver]?.message);
        if (toastmsg) enqueueSnackbar(data[resolver].message, { variant: 'success' });
        if (callback) callback();
      }
    },
  });

  const d = data ? data[resolver] : null;

  return { action, loading, data: d };
};
