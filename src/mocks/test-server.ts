// import { graphql } from 'msw';
// import { setupServer } from 'msw/node';

// const HEADER_KEY_CLIENT = 'http://localhost:3001/graphql';
// const HEADER_VAL_CLIENT = 'http://localhost:3001/graphql';

// Create handlers that match your actual GraphQL endpoint
// export const handlers = [
//   graphql.query('*', (req, res, ctx) => {
//     // Verify client header matches your server configuration
//     const clientHeader = req.headers.get(HEADER_KEY_CLIENT);

//     if (clientHeader !== HEADER_VAL_CLIENT) {
//       return res(ctx.status(403), ctx.errors([{ message: 'Invalid client header' }]));
//     }

//     // Default mock response
//     return res(
//       ctx.data({
//         data: null,
//         errors: null,
//       })
//     );
//   }),
// ];

// export const server = setupServer(...handlers);
