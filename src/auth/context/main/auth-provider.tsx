'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

interface AuthContextType {
  checkUserSession: () => Promise<void>;
  user: AuthState['user'] | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      if (state.user) {
        setState({
          user: state.user,
          loading: false,
        });
        return;
      }
  
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
  
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
  
        const res = await axios.get(endpoints.auth.me);
        const { user } = res.data;
  
        setState({
          user: { ...user, accessToken },
          loading: false,
        });
      } else {
        setState({
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setState({
        user: null,
        loading: false,
      });
    }
  }, [state.user, setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
