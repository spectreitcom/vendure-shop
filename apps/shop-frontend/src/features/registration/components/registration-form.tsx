import { useServerFn } from '@tanstack/react-start';
import { registerCustomerAccount } from '#/features/registration';
import { Alert, Button, TextField } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { registerCustomerAccountInputSchema } from '#/features/registration/schemas';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';

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
          setError('Error during registration');
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
      Sign in
    </Button>
  ) : (
    <Link to="/auth/login">Sign in</Link>
  );
  if (registered)
    return (
      <div>
        <Alert severity="success">
          Your registration has been submitted. Check your inbox for the next
          steps before signing in.
        </Alert>
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
          <span className="auth-eyebrow">Join the shop</span>
          <h1>Create an account</h1>
          <p>A simple start to your next favourite find.</p>
        </header>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="auth-fields">
        <form.Field
          name="emailAddress"
          children={(field) => (
            <TextField
              fullWidth
              label="Email address"
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
              label="Password"
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
                  : 'Use at least 6 characters.'
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
          Create account
        </Button>
      </div>
      <div className="auth-switch">
        <span>Already have an account?</span>
        {signInLink}
      </div>
    </form>
  );
}
