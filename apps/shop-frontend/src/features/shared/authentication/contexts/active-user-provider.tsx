import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { MeQuery } from '#/graphql/generated.ts';
import { useServerFn } from '@tanstack/react-start';
import { getCurrentUser } from '#/features/authentication';
import { LoginModal } from '#/features/shared/authentication/components/login-modal.tsx';

type ActiveUserContextValue = {
  activeUser: MeQuery['me'] | null;
  refresh: () => Promise<void>;
  isFetching: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
};

const ActiveUserContext = createContext<ActiveUserContextValue | null>(null);

export function ActiveUserProvider({ children }: { children: ReactNode }) {
  const getCurrentUserFn = useServerFn(getCurrentUser);
  const [activeUser, setActiveUser] = useState<MeQuery['me'] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const refresh = async () => {
    try {
      setIsFetching(true);
      const currentUser = await getCurrentUserFn();
      if (currentUser) {
        setActiveUser(currentUser);
      } else {
        setActiveUser(null);
      }
    } catch {
      setActiveUser(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getCurrentUserFn()
      .then((user) => {
        if (user) {
          setActiveUser(user);
        }
      })
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <ActiveUserContext.Provider
      value={{
        activeUser,
        refresh,
        isFetching,
        showLoginModal: () => setLoginModalVisible(true),
        hideLoginModal: () => setLoginModalVisible(false),
      }}
    >
      {children}

      <LoginModal
        open={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  const context = useContext(ActiveUserContext);

  if (!context) {
    throw new Error('useActiveUser must be used inside ActiveUserProvider');
  }

  return context;
}
