import { useActiveCart } from '#/features/shared/cart';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { ProductLine } from './product-line';
import { ProductPrice } from '#/components/product-price.tsx';
import { CouponCodeForm } from '#/features/cart-view/components/coupon-code-form.tsx';
import { CouponCodesList } from '#/features/cart-view/components/coupon-codes-list.tsx';
import { useActiveUser } from '#/features/shared/authentication';

export function CartViewContent() {
  const { activeCart, fetching } = useActiveCart();
  const { activeUser, showLoginModal, isFetching } = useActiveUser();

  const handleCheckout = async () => {
    if (!isFetching && !activeUser) showLoginModal();
  };

  if (fetching) return <CircularProgress size={64} color={'primary'} />;

  if (activeCart === null || !activeCart.lines.length)
    return <div>No items in cart</div>;

  return (
    <Grid container columns={12} spacing={4}>
      <Grid size={8}>
        <List>
          {activeCart.lines.map((line) => (
            <ProductLine
              key={line.id}
              line={line}
              currencyCode={activeCart.currencyCode}
            />
          ))}
        </List>
      </Grid>
      <Grid size={4}>
        <Card>
          <CardContent>
            <List>
              <ListItem className={'flex justify-between w-full'}>
                <span className={'d-block mr-4 font-semibold'}>Total:</span>
                <ProductPrice
                  price={activeCart.totalWithTax}
                  currencyCode={activeCart.currencyCode}
                />
              </ListItem>
              <ListItem>
                {activeCart.discounts.map((discount) => (
                  <ProductPrice
                    price={discount.amountWithTax}
                    currencyCode={activeCart.currencyCode}
                  />
                ))}
              </ListItem>
              <ListItem>
                <CouponCodesList />
              </ListItem>
              <ListItem>
                <CouponCodeForm />
              </ListItem>
              <ListItem>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  className={'w-full'}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
