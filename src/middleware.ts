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
  
  // Step 1: Basic session check for protected routes
  if (isAccount && !sessionId) {
    return NextResponse.redirect(new URL(`${paths.auth.main.signIn}`, request.url));
  }

  // Step 2: Validate session if we have one
  if (sessionId) {
    const data = await serverGateway(Q_SESSION, { input: { id: sessionId } });
    console.log('Session validation data:', data);
    const session = data?.sessionAlien;
    console.log('Session object:', session);
    
    // For now, just log the session data and continue
    if (session) {
      console.log('Valid session found for user:', session.user?.id);
    } else {
      console.log('No session data returned');
    }
  }

  return NextResponse.next({ request: { headers } });
}
