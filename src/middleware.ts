import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  SESSION_COOKIE,
  USER_AC_STATE,
  ROLE_AGENT,
  ROLE_RUN_MANAGER,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
} from './lib/constant'

import { serverGateway } from './lib/server'
import { Q_SESSION } from './lib/queries/session.query'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value
  const isAuthRoute = path === '/' || path.includes('/sign-in') || path.includes('/sign-up') || path.includes('/reset') || path.includes('/recover')

  const isAdmin = path.includes('/admin')
  const isAgent = path.includes('/agent')
  const isRunManager = path.includes('/marketing')
  const isProducer = path.includes('/production')
  const isDistributor = path.includes('/distribution')
  const isRetailer = path.includes('/retail')
  const isMarketing = path.includes('/marketing')

  const isProtectedRoute = isAdmin || isAgent || isRunManager || isProducer || isDistributor || isRetailer || isMarketing

  // Allow access to auth pages if no session
  if (!sessionId && isAuthRoute) {
    return NextResponse.next()
  }

  // Block access to protected pages if no session
  if (!sessionId && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (sessionId) {
    const data = await serverGateway(Q_SESSION, { input: { id: sessionId } })
    const session = data?.session || data?.sessionAlien // adjust to your GraphQL
    const headers = new Headers(request.headers);

    headers.set('SessionID:', String(sessionId));
    const res = NextResponse.next()
    res.headers.set('x-session-id', String(sessionId || 'none'))
    res.headers.set('x-session-user', session?.user?.id || 'no-user')
    res.headers.set('x-session-role', session?.user?.role?.name || 'none')
    // if (!session || session.user?.state !== USER_AC_STATE.active) {
    //   return NextResponse.redirect(new URL('/', request.url))
    // }

    // const role = session.user.role
    // const clientType =
    //   role?.clientTier1?.clientType?.name || role?.clientTier2?.clientType?.name

    // // Authenticated users should be redirected *away* from auth routes
    // if (isAuthRoute) {
    //   const redirectPath = getHomePage(role?.name, clientType)
    //   return NextResponse.redirect(new URL(redirectPath, request.url))
    // }

    // // Allow access only to pages that match the user’s role
    // const targetPath = getHomePage(role?.name, clientType)
    // if (isProtectedRoute && !path.startsWith(targetPath)) {
    //   return NextResponse.redirect(new URL(targetPath, request.url))
    // }
  }

  return NextResponse.next()
}

function getHomePage(roleName?: string, clientType?: string): string {
  if (roleName === ROLE_AGENT) return '/agent'
  if (roleName === ROLE_RUN_MANAGER) return '/marketing'

  switch (clientType) {
    case CLIENT_TYPE_PRODUCER:
      return '/production'
    case CLIENT_TYPE_DISTRIBUTOR:
      return '/distribution'
    case CLIENT_TYPE_RETAILER:
      return '/retail'
    case CLIENT_TYPE_MARKETING_AGENCY:
      return '/marketing'
    default:
      return '/admin'
  }
}
