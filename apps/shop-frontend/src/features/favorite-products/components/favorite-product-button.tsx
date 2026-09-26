import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Alert, Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import {
  addFavoriteProduct,
  isFavoriteProduct,
  removeFavoriteProduct,
} from '#/features/favorite-products/api';
import { useActiveUser } from '#/features/shared/authentication';
import { m } from '#/paraglide/messages';

type Props = Readonly<{ productVariantId: string }>;

export function FavoriteProductButton({ productVariantId }: Props) {
  const { activeUser, isFetching, showLoginModal } = useActiveUser();

  if (!activeUser) {
    return (
      <Button
        className="product-favorite-button"
        variant="outlined"
        fullWidth
        loading={isFetching}
        startIcon={<FavoriteBorder />}
        onClick={showLoginModal}
      >
        {m.favorites_add()}
      </Button>
    );
  }

  return (
    <CustomerFavoriteButton
      key={`${activeUser.id}:${productVariantId}`}
      productVariantId={productVariantId}
      userId={activeUser.id}
      authPending={isFetching}
    />
  );
}

function CustomerFavoriteButton({
  productVariantId,
  userId,
  authPending,
}: Props & { userId: string; authPending: boolean }) {
  const checkFavorite = useServerFn(isFavoriteProduct);
  const addFavorite = useServerFn(addFavoriteProduct);
  const removeFavorite = useServerFn(removeFavoriteProduct);
  const queryClient = useQueryClient();
  const router = useRouter();
  const queryKey = ['favorite-product', userId, productVariantId];
  const favorite = useQuery({
    queryKey,
    enabled: !authPending,
    queryFn: async () => {
      const result = await checkFavorite({ data: { productVariantId } });
      if (typeof result !== 'boolean')
        throw new Error('Missing favorite status');
      return result;
    },
  });
  const updateFavorite = useMutation({
    mutationFn: async (saved: boolean) => {
      await queryClient.cancelQueries({ queryKey });
      const update = saved ? addFavorite : removeFavorite;
      await update({ data: { productVariantId } });
      return saved;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKey, saved);
      // Refresh router-loaded favorites, including previously visited pages.
      void router.invalidate();
    },
  });

  return (
    <>
      <Button
        className="product-favorite-button"
        variant="outlined"
        fullWidth
        loading={
          authPending ||
          favorite.isPending ||
          favorite.isFetching ||
          updateFavorite.isPending
        }
        disabled={favorite.isError}
        aria-pressed={favorite.data === true}
        startIcon={favorite.data ? <Favorite /> : <FavoriteBorder />}
        onClick={() => updateFavorite.mutate(!favorite.data)}
      >
        {favorite.data ? m.favorites_remove() : m.favorites_add()}
      </Button>
      {favorite.isError && (
        <Alert
          severity="error"
          className="product-favorite-feedback"
          action={
            <Button
              color="inherit"
              size="small"
              disabled={favorite.isFetching}
              onClick={() => void favorite.refetch()}
            >
              {m.common_try_again()}
            </Button>
          }
        >
          {m.favorites_status_error()}
        </Alert>
      )}
      {updateFavorite.isError && (
        <Alert severity="error" className="product-favorite-feedback">
          {m.favorites_update_error()}
        </Alert>
      )}
    </>
  );
}
