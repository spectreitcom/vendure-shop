import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { requestResetPassword } from '#/features/reset-password';
import { useForm } from '@tanstack/react-form';
import { requestResetPasswordInputSchema } from '#/features/reset-password/schemas';
import { useState } from 'react';

export function ResetPasswordForm() {
  const requestResetPasswordFn = useServerFn(requestResetPassword);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    validators: {
      onSubmit: requestResetPasswordInputSchema,
    },
    defaultValues: {
      emailAddress: '',
    },
    onSubmit: async ({ value: { emailAddress } }) => {
      try {
        setSuccess(false);
        setError(null);
        setSending(true);
        await requestResetPasswordFn({ data: { emailAddress } });
        setSuccess(true);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError('An error occurred while resetting your password.');
      } finally {
        setSending(false);
      }
    },
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant={'h5'} component={'h1'}>
            Reset Password
          </Typography>

          {error && (
            <div className={'mt-4'}>
              <Alert severity="error">{error}</Alert>
            </div>
          )}

          {success && (
            <div className={'mt-4'}>
              <Alert severity="success">
                Password reset email sent. Please check your inbox.
              </Alert>
            </div>
          )}

          <div className={'mt-4'}>
            <form.Field
              name={'emailAddress'}
              children={(field) => (
                <TextField
                  size={'small'}
                  className={'w-full'}
                  placeholder={'Email address'}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
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
              onClick={form.handleSubmit}
              loading={sending}
              disabled={sending}
              variant="contained"
              className={'w-full'}
            >
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
