import { useServerFn } from '@tanstack/react-start';
import { resetPassword } from '#/features/reset-password';
import { useForm } from '@tanstack/react-form';
import { resetPasswordInputSchema } from '#/features/reset-password/schemas';
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { useActiveUser } from '#/features/shared/authentication';

type Props = Readonly<{
  token: string;
}>;

export function ChangePasswordForm({ token }: Props) {
  const changePasswordFn = useServerFn(resetPassword);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { refresh: refreshActiveCart } = useActiveCart();
  const { refresh: refreshActiveUser } = useActiveUser();

  const form = useForm({
    validators: {
      onSubmit: resetPasswordInputSchema.pick({ password: true }),
    },
    defaultValues: {
      password: '',
    },
    onSubmit: async ({ value: { password } }) => {
      try {
        setError(null);
        setSubmitting(true);
        await changePasswordFn({ data: { token, password } });
        await refreshActiveCart();
        await refreshActiveUser();
        await router.navigate({ to: '/auth/login' });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError('Error during password reset');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card>
      <CardContent>
        <Typography variant={'h5'} component={'h1'}>
          Change Password
        </Typography>

        {error && (
          <div className={'mt-4'}>
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        <div className={'mt-4'}>
          <form.Field
            name={'password'}
            children={(field) => (
              <TextField
                size="small"
                type={'password'}
                className={'w-full'}
                onBlur={field.handleBlur}
                value={field.state.value}
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
            className="w-full"
            onClick={form.handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
            Change password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
