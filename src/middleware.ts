import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { paths } from './routes/paths';
import { serverGateway } from './lib/server';
import { Q_SESSION } from './lib/queries/session.query';
import {
  ROLE_AGENT,
  USER_AC_STATE,
  SESSION_COOKIE,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
} from './lib/constant';

export async function middleware(request: NextRequest) {
  const isRecover = request.nextUrl.pathname.startsWith(`/auth/main/forgot-password`);
  const isReset = request.nextUrl.pathname.startsWith(`/auth/main/reset`);
  const isSignUp = request.nextUrl.pathname.startsWith(`/auth/main/sign-up`);
  const isSignIn = request.nextUrl.pathname === '/auth/main/sign-in/';
  const isUnlock = request.nextUrl.pathname.startsWith(`/auth/main/unlock`);

  const isAuth = isRecover || isReset || isSignUp || isSignIn || isUnlock;

  const isAdmin = request.nextUrl.pathname.startsWith(`/v2/admin`);
  const isAgent = request.nextUrl.pathname.startsWith(`/v2/agent`);
  const isDistribution = request.nextUrl.pathname.startsWith(`/v2/distributor`);
  const isMarketting = request.nextUrl.pathname.startsWith(`/v2/marketing`);
  const isProduction = request.nextUrl.pathname.startsWith(`/v2/producer`);
  const isRetail = request.nextUrl.pathname.startsWith(`/v2/retailer`);

  const isAccount =
    isAdmin || isAgent || isDistribution || isMarketting || isProduction || isRetail;
  const headers = new Headers(request.headers);

  headers.set('isAuth', String(isAuth));
  headers.set('isAccount', String(isAccount));

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  
  // If trying to access protected routes without a session, redirect to sign in
  // if (isAccount && !sessionId) {
  //   return NextResponse.redirect(new URL(`${paths.auth.main.signIn}`, request.url));
  // }

  // if (isAuth || isAccount) {
  //   if (isReset) {
  //     return NextResponse.next({ request: { headers } });
  //   }

  //   // Only try to validate session if we have a sessionId
  //   if (sessionId) {
  //     const data = await serverGateway(Q_SESSION, { input: { id: sessionId } });
  //     console.log(data, 'DATA');
  //     const session = data?.sessionAlien;
  //     console.log('Session Data:', session);

  //     if (session && session.user) {
  //       const isActiveAccount = session.user.state === USER_AC_STATE.active;

  //       if (isActiveAccount) {
  //         if (session.locked) {
  //           if (isUnlock) {
  //             headers.set('session', JSON.stringify({ user: session?.user }));
  //           } else {
  //             return NextResponse.redirect(new URL(`/unlock`, request.url));
  //           }
  //         } else {
  //           let userHomePage: string | URL = '/';
  //           let allowedToView = false;
  //           let accountLabel = '';

  //           // Determine user type and set appropriate homepage
  //           if (session.user.role?.name === ROLE_AGENT) {
  //             userHomePage = paths.v2.agent.root;
  //             accountLabel = 'Agent';
  //             allowedToView = isAgent;
  //           } else if (!session.user.role?.clientTier1 && !session.user.role?.clientTier2) {
  //             userHomePage = paths.v2.admin.root;
  //             accountLabel = 'Administrator';
  //             allowedToView = isAdmin;
  //           }

  //           if (session.user.role?.clientTier1 || session.user.role?.clientTier2) {
  //             const clientType =
  //               session.user.role?.clientTier1?.clientType?.name ||
  //               session.user.role?.clientTier2?.clientType?.name;

  //             switch (clientType) {
  //               case CLIENT_TYPE_PRODUCER:
  //                 userHomePage = paths.v2.producer.root;
  //                 accountLabel = 'Producer';
  //                 allowedToView = isProduction;
  //                 break;

  //               case CLIENT_TYPE_DISTRIBUTOR:
  //                 userHomePage = paths.v2.distributor.root;
  //                 accountLabel = 'Distributor';
  //                 allowedToView = isDistribution;
  //                 break;

  //               case CLIENT_TYPE_RETAILER:
  //                 userHomePage = paths.v2.retailer.root;
  //                 accountLabel = 'Retailor';
  //                 allowedToView = isRetail;
  //                 break;

  //               case CLIENT_TYPE_MARKETING_AGENCY:
  //                 userHomePage = paths.v2.marketing.root;
  //                 accountLabel = 'Marketing Agency';
  //                 allowedToView = isMarketting;
  //                 break;

  //               default:
  //                 break;
  //             }
  //           }

  //           console.log('Final homepage:', userHomePage);
  //           console.log('Allowed to view:', allowedToView);

  //           if (isAuth) {
  //             console.log('Redirecting to homepage after auth');
  //             return NextResponse.redirect(new URL(userHomePage, request.url));
  //           }

  //           if (!allowedToView) {
  //             console.log('User not allowed to view current page, redirecting to homepage');
  //             return NextResponse.redirect(new URL(userHomePage, request.url));
  //           }

  //           console.log('Setting session headers');
  //           headers.set(
  //             'session',
  //             JSON.stringify({
  //               menu: [],
  //               user: session?.user,
  //               accountLabel,
  //               isActiveAccount: session?.user?.state === USER_AC_STATE.active,
  //               isLocked: session?.locked,
  //             })
  //           );
  //         }
  //       } else {
  //         if (session.user.state === USER_AC_STATE.unconfirmed) {
  //           return NextResponse.redirect(new URL(`/unconfirmed`, request.url));
  //         }
  //         if (session.user.state === USER_AC_STATE.suspended) {
  //           return NextResponse.redirect(new URL(`/suspended`, request.url));
  //         }
  //       }
  //     } else if (isAccount) {
  //       // If we have a sessionId but couldn't get valid session data for protected routes
  //       console.log('No valid session data found for protected route');
  //       return NextResponse.redirect(new URL(`${paths.auth.main.signIn}`, request.url));
  //     }
  //   } else if (isAccount) {
  //     // No sessionId for protected routes
  //     console.log('No session ID found for protected route');
  //     return NextResponse.redirect(new URL(`${paths.auth.main.signIn}`, request.url));
  //   }
  // }

  return NextResponse.next({ request: { headers } });
}
