import { Link } from '@tanstack/react-router';
import { MailOutlined } from '@mui/icons-material';
import { Alert, Button, TextField } from '@mui/material';
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
    <form
      className="auth-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        await form.handleSubmit();
      }}
    >
      <header className="auth-form-heading">
        <span className="auth-eyebrow">Account recovery</span>
        <h1>{success ? 'Check your inbox' : 'Forgot your password?'}</h1>
        <p>
          {success
            ? 'Your next step is in your email.'
            : 'Enter your email address and we’ll help you reset your password.'}
        </p>
      </header>
      {error && <Alert severity="error">{error}</Alert>}
      {success ? (
        <div className="auth-status" role="status">
          <MailOutlined />
          <p>
            If an account exists for this email address, you’ll receive a
            password reset link. Check your spam folder too.
          </p>
          <Button
            className="auth-switch-button"
            onClick={() => setSuccess(false)}
          >
            Try another email address
          </Button>
        </div>
      ) : (
        <div className="auth-fields">
          <form.Field
            name="emailAddress"
            children={(field) => (
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                name="email"
                fullWidth
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors
                  .map((e) => e?.message)
                  .join(' ')}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            className="auth-submit"
            fullWidth
            loading={sending}
            disabled={sending}
          >
            Send reset link
          </Button>
        </div>
      )}
      <div className="auth-switch">
        <Link to="/auth/login">Back to sign in</Link>
      </div>
    </form>
  );
}
