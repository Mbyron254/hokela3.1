'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { authenticated, loading, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  console.log('AUTHENTICATED GUARD', authenticated);

  // const checkPermissions = useCallback(async (): Promise<void> => {
  //   if (loading) return;

  //   if (!authenticated) {
  //     // const returnTo = encodeURIComponent(pathname);
  //     console.log('GOT YOU');
  //     router.replace(`${paths.auth.main.signIn}?returnTo=${returnTo}`);
  //     return;
  //   }

  //   const userRole = getUserRole(user);
  //   const hasAccess = checkRouteAccess(pathname, userRole);

  //   if (!hasAccess) {
  //     router.replace(getRoleHomePath(userRole));
  //     return;
  //   }

  //   setIsChecking(false);
  // }, [authenticated, loading, router, pathname, user]);

  // useEffect(() => {
  //   checkPermissions();
  // }, [checkPermissions]);
  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      let homePath = '/';

      if (user?.role?.name === 'AGENT') {
        homePath = paths.v2.agent.root;
      } else if (!user?.role?.clientTier1 && !user?.role?.clientTier2) {
        homePath = paths.v2.admin.root;
      } else {
        const clientType =
          user?.role?.clientTier1?.clientType?.name ||
          user?.role?.clientTier2?.clientType?.name ||
          'Hokela Interactive';

        switch (clientType) {
          case 'PRODUCER':
            homePath = paths.v2.producer.root;
            break;
          case 'DISTRIBUTOR':
            homePath = paths.v2.distributor.root;
            break;
          case 'RETAILER':
            homePath = paths.v2.retailer.root;
            break;
          case 'MARKETING_AGENCY':
            homePath = paths.v2.marketing.root;
            break;
          default:
            homePath = '/';
            break;
        }
      }

      router.replace(returnTo || homePath);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

function checkRouteAccess(pathname: string, role?: string): boolean {
  if (!role) return false;

  const pathSegments = pathname.split('/');
  if (pathSegments.length < 3) return true;

  const section = pathSegments[2];
  const roleMap: Record<string, string> = {
    admin: 'admin',
    agent: 'agent',
    producer: 'producer',
    distributor: 'distributor',
    retailer: 'retailer',
    marketing_agency: 'marketing',
  };

  return roleMap[role.toLowerCase()] === section;
}

function getRoleHomePath(role?: string): string {
  const rolePathMap: Record<string, string> = {
    admin: paths.v2.admin.root,
    agent: paths.v2.agent.root,
    producer: paths.v2.producer.root,
    distributor: paths.v2.distributor.root,
    retailer: paths.v2.retailer.root,
    marketing_agency: paths.v2.marketing.root,
  };

  return rolePathMap[role?.toLowerCase() ?? ''] || '/';
}

function getUserRole(user: any): string | undefined {
  if (user?.role?.name === 'AGENT') return 'agent';
  if (!user?.role?.clientTier1 && !user?.role?.clientTier2) return 'admin';

  const clientType =
    user?.role?.clientTier1?.clientType?.name || user?.role?.clientTier2?.clientType?.name;

  const clientTypeMap: Record<string, string> = {
    PRODUCER: 'producer',
    DISTRIBUTOR: 'distributor',
    RETAILER: 'retailer',
    MARKETING_AGENCY: 'marketing_agency',
  };

  return clientTypeMap[clientType];
}
