import { useServerFn } from '@tanstack/react-start';
import { registerCustomerAccount } from '#/features/registration';
import { Alert, Button, TextField } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { registerCustomerAccountInputSchema } from '#/features/registration/schemas';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { m } from '#/paraglide/messages';

export function RegistrationForm({
  hideTitle = false,
  onSignIn,
}: {
  hideTitle?: boolean;
  onSignIn?: () => void;
}) {
  const registerCustomerAccountFn = useServerFn(registerCustomerAccount);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

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
        setRegistered(true);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(m.registration_error());
        }
      } finally {
        setCreatingAccount(false);
      }
    },
  });

  const signInLink = onSignIn ? (
    <Button
      className="auth-switch-button"
      onClick={onSignIn}
      disabled={creatingAccount}
    >
      {m.common_sign_in()}
    </Button>
  ) : (
    <Link to="/auth/login">{m.common_sign_in()}</Link>
  );
  if (registered)
    return (
      <div>
        <Alert severity="success">{m.registration_success()}</Alert>
        <div className="auth-switch">{signInLink}</div>
      </div>
    );

  return (
    <form
      className="auth-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        await form.handleSubmit();
      }}
    >
      {!hideTitle && (
        <header className="auth-form-heading">
          <span className="auth-eyebrow">{m.registration_eyebrow()}</span>
          <h1>{m.common_create_account()}</h1>
          <p>{m.registration_description()}</p>
        </header>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="auth-fields">
        <form.Field
          name="emailAddress"
          children={(field) => (
            <TextField
              fullWidth
              label={m.common_email_address()}
              type="email"
              autoComplete="email"
              name="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors
                .map((e) => e?.message)
                .join(' ')}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              label={m.common_password()}
              type="password"
              autoComplete="new-password"
              name="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={
                field.state.meta.errors.length
                  ? field.state.meta.errors.map((e) => e?.message).join(' ')
                  : m.common_password_hint()
              }
            />
          )}
        />
        <Button
          className="auth-submit"
          fullWidth
          variant="contained"
          type="submit"
          loading={creatingAccount}
          disabled={creatingAccount}
        >
          {m.registration_submit()}
        </Button>
      </div>
      <div className="auth-switch">
        <span>{m.registration_have_account()}</span>
        {signInLink}
      </div>
    </form>
  );
}
