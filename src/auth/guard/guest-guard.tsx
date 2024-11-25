'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  console.log('AUTHENTICATED', authenticated);

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
        const clientType = user?.role?.clientTier1?.clientType?.name || user?.role?.clientTier2?.clientType?.name;
        
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
            homePath = paths.v2.agent.root;
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
