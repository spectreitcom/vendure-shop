import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getActiveCart } from '#/features/shared/cart';
import type { GetActiveCartQuery } from '#/graphql/generated.ts';

type CartContextValue = {
  activeCart: GetActiveCartQuery['activeOrder'] | null;
  refresh: () => Promise<void>;
  fetching: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function ActiveCartProvider({ children }: { children: ReactNode }) {
  const [activeCart, setActiveCart] = useState<
    GetActiveCartQuery['activeOrder'] | null
  >(null);
  const [fetching, setFetching] = useState(true);

  const getActiveCartFn = useServerFn(getActiveCart);

  useEffect(() => {
    getActiveCartFn()
      .then((activeCartResponse) => {
        setActiveCart(activeCartResponse);
      })
      .catch((e) => console.log(e))
      .finally(() => setFetching(false));
  }, []);

  const refresh = async () => {
    try {
      const activeCartResponse = await getActiveCartFn();
      setActiveCart(activeCartResponse);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CartContext.Provider value={{ activeCart, refresh, fetching }}>
      {children}
    </CartContext.Provider>
  );
}

export function useActiveCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useActiveCart must be used inside ActiveCartProvider');
  }

  return context;
}
