import { GQLMutation } from 'src/lib/client';
import {
  USER_ACTVATE,
  USER_RECYCLE,
  USER_RESTORE,
  USER_SUSPEND,
} from 'src/lib/mutations/user.mutation';


export const useUserMutations = () => {
  const { action: suspend, loading: suspending } = GQLMutation({
    mutation: USER_SUSPEND,
    resolver: 'userSuspend',
    toastmsg: true,
  });

  const { action: activate, loading: activating } = GQLMutation({
    mutation: USER_ACTVATE,
    resolver: 'userActivate',
    toastmsg: true,
  });

  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: USER_RECYCLE,
    resolver: 'userRecycle',
    toastmsg: true,
  });

  const { action: restore, loading: restoring } = GQLMutation({
    mutation: USER_RESTORE,
    resolver: 'userRestore',
    toastmsg: true,
  });

  const handleSuspend = (ids: string[]) => {
    if (ids.length) {
      suspend({ variables: { input: { ids } } });
    }
  };

  const handleActivate = (ids: string[]) => {
    if (ids.length) {
      activate({ variables: { input: { ids } } });
    }
  };

  const handleRecycle = (ids: string[]) => {
    if (ids.length) {
      recycle({ variables: { input: { ids } } });
    }
  };

  const handleRestore = (ids: string[]) => {
    if (ids.length) {
      restore({ variables: { input: { ids } } });
    }
  };

  return {
    handleSuspend,
    handleActivate,
    handleRecycle,
    handleRestore,
    suspending,
    activating,
    recycling,
    restoring,
  };
};