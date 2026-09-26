import { Link } from '@tanstack/react-router';
import { MailOutlined } from '@mui/icons-material';
import { Alert, Button, TextField } from '@mui/material';
import { useServerFn } from '@tanstack/react-start';
import { requestResetPassword } from '#/features/reset-password';
import { useForm } from '@tanstack/react-form';
import { requestResetPasswordInputSchema } from '#/features/reset-password/schemas';
import { useState } from 'react';
import { m } from '#/paraglide/messages';

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
        setError(m.reset_password_request_error());
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
        <span className="auth-eyebrow">{m.reset_password_eyebrow()}</span>
        <h1>
          {success
            ? m.reset_password_success_title()
            : m.reset_password_title()}
        </h1>
        <p>
          {success
            ? m.reset_password_success_description()
            : m.reset_password_description()}
        </p>
      </header>
      {error && <Alert severity="error">{error}</Alert>}
      {success ? (
        <div className="auth-status" role="status">
          <MailOutlined />
          <p>{m.reset_password_success_message()}</p>
          <Button
            className="auth-switch-button"
            onClick={() => setSuccess(false)}
          >
            {m.reset_password_try_another()}
          </Button>
        </div>
      ) : (
        <div className="auth-fields">
          <form.Field
            name="emailAddress"
            children={(field) => (
              <TextField
                label={m.common_email_address()}
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
            {m.reset_password_submit()}
          </Button>
        </div>
      )}
      <div className="auth-switch">
        <Link to="/auth/login">{m.common_back_to_sign_in()}</Link>
      </div>
    </form>
  );
}
