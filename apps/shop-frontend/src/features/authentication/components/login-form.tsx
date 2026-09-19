import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { login } from '#/features/authentication';
import { useRouter } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { useActiveUser } from '#/features/shared/authentication';

type Props = Readonly<{
  skipRedirect?: boolean;
  hideTitle?: boolean;
  hideShadow?: boolean;
  onLoginSuccess?: () => void;
}>;

const formValidationSchema = z.object({
  username: z.email(),
  password: z.string(),
});

export function LoginForm({
  skipRedirect,
  hideTitle,
  hideShadow,
  onLoginSuccess,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [logging, setLogging] = useState(false);
  const loginFn = useServerFn(login);
  const router = useRouter();
  const { refresh: refreshActiveCart } = useActiveCart();
  const { refresh: refreshActiveUser } = useActiveUser();

  const form = useForm({
    validators: {
      onSubmit: formValidationSchema,
    },
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value: { username, password } }) => {
      try {
        setLogging(true);
        await loginFn({ data: { username, password } });
        await refreshActiveCart();
        await refreshActiveUser();
        if (!skipRedirect) {
          await router.navigate({ to: '/' });
        }
        onLoginSuccess && onLoginSuccess();
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Wrong credentials');
        }
      } finally {
        setLogging(false);
      }
    },
  });

  return (
    <>
      <Card elevation={hideShadow ? 0 : undefined}>
        <CardContent>
          {!hideTitle && (
            <Typography variant={'h5'} component={'h1'}>
              Sign In
            </Typography>
          )}

          {error && (
            <div className={'mt-4'}>
              <Alert severity="error">{error}</Alert>
            </div>
          )}

          <div className={'mt-4'}>
            <div>
              <form.Field
                name={'username'}
                children={(field) => (
                  <TextField
                    size={'small'}
                    label={'Email Address'}
                    className={'w-full'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors.map(
                      (errorField) => errorField?.message,
                    )}
                  />
                )}
              />
            </div>

            <div className={'mt-4'}>
              <form.Field
                name={'password'}
                children={(field) => (
                  <TextField
                    type={'password'}
                    size={'small'}
                    label={'Password'}
                    className={'w-full'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors.map(
                      (errorField) => errorField?.message,
                    )}
                  />
                )}
              />
            </div>

            <div className={'mt-4'}>
              <Button
                variant={'outlined'}
                className={'w-full'}
                loading={logging}
                disabled={logging}
                onClick={form.handleSubmit}
              >
                Sign in
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
