import { useServerFn } from '@tanstack/react-start';
import { registerCustomerAccount } from '#/features/registration';
import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { registerCustomerAccountInputSchema } from '#/features/registration/schemas';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';

export function RegistrationForm() {
  const registerCustomerAccountFn = useServerFn(registerCustomerAccount);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    validators: {
      onSubmit: registerCustomerAccountInputSchema,
    },
    defaultValues: {
      emailAddress: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setCreatingAccount(true);
        setError(null);
        await registerCustomerAccountFn({
          data: {
            emailAddress: value.emailAddress,
            password: value.password,
          },
        });
        await router.navigate({ to: '/auth/login' });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Error during registration');
        }
      } finally {
        setCreatingAccount(false);
      }
    },
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant={'h5'} component={'h1'}>
            Registration
          </Typography>

          {error && (
            <div className={'mt-4'}>
              <Alert severity="error">{error}</Alert>
            </div>
          )}

          <div className={'mt-4'}>
            <div>
              <form.Field
                name={'emailAddress'}
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
                loading={creatingAccount}
                disabled={creatingAccount}
                onClick={form.handleSubmit}
              >
                Create account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
