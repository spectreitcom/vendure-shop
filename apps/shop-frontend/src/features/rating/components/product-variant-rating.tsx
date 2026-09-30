import { Alert, Button, Rating, Snackbar } from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useId, useState } from 'react';
import {
  productVariantRating,
  productVariantRatingByActiveCustomer,
  rateProductVariant,
} from '#/features/rating/api';
import { getActiveCustomer } from '#/features/shared/active-customer';
import { useActiveUser } from '#/features/shared/authentication';
import { m } from '#/paraglide/messages';
import { getLocale } from '#/paraglide/runtime';
import './product-variant-rating.css';

type Props = Readonly<{
  productVariantId: string;
  votes?: number;
  activeCustomerRating?: number;
}>;

export function ProductVariantRating(props: Props) {
  const { activeUser } = useActiveUser();

  return (
    <ProductVariantRatingContent
      key={`${props.productVariantId}:${activeUser?.id ?? 'guest'}`}
      {...props}
    />
  );
}

function ProductVariantRatingContent({
  productVariantId,
  activeCustomerRating = 0,
  votes = 0,
}: Props) {
  const { activeUser, isFetching, showLoginModal } = useActiveUser();
  const getRating = useServerFn(productVariantRating);
  const getCustomer = useServerFn(getActiveCustomer);
  const getCustomerRating = useServerFn(productVariantRatingByActiveCustomer);
  const rate = useServerFn(rateProductVariant);
  const id = useId();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'error';
    message: string;
  } | null>(null);
  const [rating, setRating] =
    useState<Awaited<ReturnType<typeof productVariantRating>>>();
  const [hasCustomer, setHasCustomer] = useState(false);
  const [savedRating, setSavedRating] = useState(activeCustomerRating);
  const [isRatingLoading, setIsRatingLoading] = useState(true);
  const [isCustomerLoading, setIsCustomerLoading] = useState(!!activeUser);
  const [isSaving, setIsSaving] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const [customerError, setCustomerError] = useState(false);
  const [ratingRefresh, setRatingRefresh] = useState(0);
  const [customerRefresh, setCustomerRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadRating = async () => {
      setIsRatingLoading(true);
      setRatingError(false);
      try {
        const result = await getRating({ data: { productVariantId } });
        if (!cancelled) setRating(result);
      } catch (error) {
        if (!cancelled) {
          setRatingError(true);
          setFeedback({
            severity: 'error',
            message:
              error instanceof Error && error.message
                ? error.message
                : m.rating_load_error(),
          });
        }
      } finally {
        if (!cancelled) setIsRatingLoading(false);
      }
    };

    void loadRating();
    return () => {
      cancelled = true;
    };
  }, [getRating, productVariantId, ratingRefresh]);

  useEffect(() => {
    if (!activeUser || isFetching) return;
    let cancelled = false;

    const loadCustomerRating = async () => {
      setIsCustomerLoading(true);
      setCustomerError(false);
      try {
        const customer = await getCustomer();
        const result = customer
          ? await getCustomerRating({ data: { productVariantId } })
          : null;
        if (!cancelled) {
          setHasCustomer(!!customer);
          setSavedRating(result?.rating ?? activeCustomerRating);
        }
      } catch (error) {
        if (!cancelled) {
          setCustomerError(true);
          setFeedback({
            severity: 'error',
            message:
              error instanceof Error && error.message
                ? error.message
                : m.rating_load_error(),
          });
        }
      } finally {
        if (!cancelled) setIsCustomerLoading(false);
      }
    };

    void loadCustomerRating();
    return () => {
      cancelled = true;
    };
  }, [
    activeUser,
    isFetching,
    getCustomer,
    getCustomerRating,
    productVariantId,
    activeCustomerRating,
    customerRefresh,
  ]);

  const updateRating = async (value: number) => {
    setFeedback(null);
    setIsSaving(true);
    try {
      if (!activeUser || !hasCustomer || isFetching) {
        throw new Error(m.rating_customer_required());
      }
      await rate({ data: { productVariantId, rating: value } });
      setSelectedRating(value);
      setSavedRating(value);
      setFeedback({ severity: 'success', message: m.rating_saved() });
      setRatingRefresh((count) => count + 1);
      setCustomerRefresh((count) => count + 1);
    } catch (error) {
      setFeedback({
        severity: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : m.rating_save_error(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const value = selectedRating ?? savedRating;
  const voteCount = rating?.votes ?? votes;
  const average = rating?.average ?? 0;
  const busy = isFetching || isCustomerLoading || isSaving;

  return (
    <section className="product-rating" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="product-rating-title">
        {m.rating_title()}
      </h2>
      <div className="product-rating-summary" aria-live="polite">
        <Rating
          value={average}
          precision={0.1}
          readOnly
          getLabelText={(score) => m.rating_star_label({ score })}
        />
        {isRatingLoading && !rating ? (
          <span className="product-rating-caption">{m.rating_loading()}</span>
        ) : ratingError && !rating ? (
          <Button
            className="product-rating-link"
            onClick={() => setRatingRefresh((count) => count + 1)}
            disabled={isRatingLoading}
          >
            {m.common_try_again()}
          </Button>
        ) : voteCount > 0 ? (
          <>
            <span className="product-rating-average">
              {new Intl.NumberFormat(getLocale(), {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(average)}
              <span className="product-rating-caption"> / 5</span>
            </span>
            <span className="product-rating-caption">
              {m.rating_vote_count({ count: voteCount })}
            </span>
          </>
        ) : (
          <span className="product-rating-caption">{m.rating_no_votes()}</span>
        )}
      </div>

      {!activeUser ? (
        <Button
          className="product-rating-link"
          onClick={showLoginModal}
          disabled={isFetching}
        >
          {m.rating_sign_in()}
        </Button>
      ) : customerError ? (
        <Button
          className="product-rating-link"
          onClick={() => setCustomerRefresh((count) => count + 1)}
          disabled={busy}
        >
          {m.common_try_again()}
        </Button>
      ) : hasCustomer ? (
        <form
          className="product-rating-form"
          aria-busy={busy}
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && value >= 1 && value <= 5) {
              void updateRating(value);
            }
          }}
        >
          <span id={`${id}-label`} className="product-rating-label">
            {m.rating_your_rating()}
          </span>
          <div className="product-rating-controls">
            <Rating
              name={`${id}-rating`}
              role="radiogroup"
              aria-labelledby={`${id}-label`}
              value={value}
              disabled={busy}
              getLabelText={(score) => m.rating_star_label({ score })}
              onChange={(_, score) => setSelectedRating(score ?? 0)}
            />
            <Button
              className="product-rating-submit"
              type="submit"
              variant="outlined"
              size="small"
              loading={isSaving}
              disabled={busy || value === 0 || value === savedRating}
            >
              {savedRating > 0 ? m.rating_update() : m.rating_submit()}
            </Button>
          </div>
          <p className="product-rating-caption">{m.rating_purchase_hint()}</p>
        </form>
      ) : (
        <p className="product-rating-caption">
          {busy ? m.rating_loading() : m.rating_customer_required()}
        </p>
      )}

      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setFeedback(null);
        }}
      >
        <Alert
          severity={feedback?.severity ?? 'error'}
          variant="filled"
          onClose={() => setFeedback(null)}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </section>
  );
}
