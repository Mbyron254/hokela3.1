'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// Add these at the top of the file, outside the component
const ROLE_PATH_MAP: Readonly<Record<string, string>> = {
  admin: paths.v2.admin.root,
  agent: paths.v2.agent.root,
  producer: paths.v2.producer.root,
  distributor: paths.v2.distributor.root,
  retailer: paths.v2.retailer.root,
  marketing_agency: paths.v2.marketing.root,
} as const;

const CLIENT_TYPE_MAP: Readonly<Record<string, string>> = {
  PRODUCER: 'producer',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
  MARKETING_AGENCY: 'marketing_agency',
} as const;

const ROUTE_ROLE_MAP: Readonly<Record<string, string>> = {
  admin: 'admin',
  agent: 'agent',
  producer: 'producer',
  distributor: 'distributor',
  retailer: 'retailer',
  marketing_agency: 'marketing',
} as const;

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading, user } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  const returnTo = useMemo(
    () => searchParams.get('returnTo') || CONFIG.auth.redirectPath,
    [searchParams]
  );

  const checkPermissions = useCallback(async (): Promise<void> => {
    if (loading) return;

    if (!authenticated) {
      setIsChecking(false);
      return;
    }

    let homePath = '/';

    if (user?.role?.name === 'AGENT') {
      homePath = paths.v2.agent.root;
    } else if (!user?.role?.clientTier1 && !user?.role?.clientTier2) {
      homePath = paths.v2.admin.root;
    } else {
      const clientType =
        user?.role?.clientTier1?.clientType?.name || user?.role?.clientTier2?.clientType?.name;

      homePath = ROLE_PATH_MAP[CLIENT_TYPE_MAP[clientType] || ''] || '/';
    }

    router.replace(returnTo || homePath);
  }, [authenticated, loading, user, router, returnTo]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
function checkRouteAccess(pathname: string, role?: string): boolean {
  if (!role) return false;

  const section = pathname.split('/')[2];
  if (!section) return true;

  return ROUTE_ROLE_MAP[role.toLowerCase()] === section;
}

function getRoleHomePath(role?: string): string {
  if (!role) return '/';
  return ROLE_PATH_MAP[role.toLowerCase()] || '/';
}

function getUserRole(user: any): string | undefined {
  if (!user?.role) return undefined;
  if (user.role.name === 'AGENT') return 'agent';
  if (!user.role.clientTier1 && !user.role.clientTier2) return 'admin';

  const clientType =
    user.role.clientTier1?.clientType?.name || user.role.clientTier2?.clientType?.name;
  return CLIENT_TYPE_MAP[clientType];
}
