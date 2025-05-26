import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { paths } from './routes/paths'
import { serverGateway } from './lib/server'
import { Q_SESSION } from './lib/queries/session.query'
import {
  ROLE_AGENT,
  USER_AC_STATE,
  SESSION_COOKIE,
  CLIENT_TYPE_PRODUCER,
  CLIENT_TYPE_RETAILER,
  CLIENT_TYPE_DISTRIBUTOR,
  CLIENT_TYPE_MARKETING_AGENCY,
} from './lib/constant'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isRecover = pathname.startsWith('/auth/main/forgot-password')
  const isReset = pathname.startsWith('/auth/main/reset')
  const isSignUp = pathname.startsWith('/auth/main/sign-up')
  const isSignIn = pathname.startsWith('/auth/main/sign-in') // FIXED LINE
  const isUnlock = pathname.startsWith('/auth/main/unlock')

  const isAuth = isRecover || isReset || isSignUp || isSignIn || isUnlock

  const isAdmin = pathname.startsWith('/v2/admin')
  const isAgent = pathname.startsWith('/v2/agent')
  const isDistribution = pathname.startsWith('/v2/distributor')
  const isMarketing = pathname.startsWith('/v2/marketing')
  const isProduction = pathname.startsWith('/v2/producer')
  const isRetail = pathname.startsWith('/v2/retailer')

  const isAccount =
    isAdmin || isAgent || isDistribution || isMarketing || isProduction || isRetail

  const headers = new Headers(request.headers)
  headers.set('isAuth', String(isAuth))
  headers.set('isAccount', String(isAccount))

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value

  console.log('Path:', pathname)
  console.log('isAccount:', isAccount, '| isAuth:', isAuth)
  console.log('sessionId:', sessionId)

  //  Allow access to sign-in page if not logged in (prevents redirect loop)
  // if (isSignIn && !sessionId) {
  //   return NextResponse.next({ request: { headers } })
  // }

  // // Not logged in but trying to access a protected route
  // if (isAccount && !sessionId) {
  //   console.log('No session, redirecting to sign-in')
  //   return NextResponse.redirect(new URL(paths.auth.main.signIn, request.url))
  // }

  // //  Validate session
  // if (sessionId) {
  //   const data = await serverGateway(Q_SESSION, { input: { id: sessionId } })
  //   const session = data?.sessionAlien

  //   console.log('Session:', session)

  //   if (!session || session.user?.accountState !== USER_AC_STATE.active) {
  //     console.log('Invalid or inactive session, redirecting to sign-in')
  //     return NextResponse.redirect(new URL(paths.auth.main.signIn, request.url))
  //   }

  //   // Already logged in, but trying to access auth routes
  //   if (isAuth) {
  //     console.log('Logged-in user accessing auth route, redirecting to dashboard')
  //     //  Optional: Route to specific dashboard based on role
  //     return NextResponse.redirect(new URL('/v2/admin', request.url))
  //   }
  // }

  //  Allow request through
  return NextResponse.next({ request: { headers } })
}
