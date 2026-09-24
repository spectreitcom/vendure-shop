import { Alert, Button, TextField } from '@mui/material';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { login } from '#/features/authentication';
import { Link, useRouter } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { useActiveUser } from '#/features/shared/authentication';

type Props = Readonly<{
  skipRedirect?: boolean;
  hideTitle?: boolean;
  onLoginSuccess?: () => void;
  onRegister?: () => void;
  onNavigateAway?: () => void;
}>;

const formValidationSchema = z.object({
  username: z.email(),
  password: z.string().min(1, 'Enter your password'),
});

export function LoginForm({
  skipRedirect,
  hideTitle,
  onLoginSuccess,
  onRegister,
  onNavigateAway,
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
        setError(null);
        await loginFn({ data: { username, password } });
        await refreshActiveCart();
        await refreshActiveUser();
        if (!skipRedirect) {
          await router.navigate({ to: '/' });
        }
        onLoginSuccess?.();
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
          <span className="auth-eyebrow">Your account</span>
          <h1>Welcome back</h1>
          <p>Sign in to pick up where you left off.</p>
        </header>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="auth-fields">
        <form.Field
          name="username"
          children={(field) => (
            <TextField
              fullWidth
              label="Email address"
              type="email"
              autoComplete="username"
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
              autoComplete="current-password"
              name="password"
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
        <div className="auth-forgot">
          <Link to="/auth/reset-password" onClick={onNavigateAway}>
            Forgot password?
          </Link>
        </div>
        <Button
          className="auth-submit"
          fullWidth
          variant="contained"
          type="submit"
          loading={logging}
          disabled={logging}
        >
          Sign in
        </Button>
      </div>
      <div className="auth-switch">
        <span>New here?</span>
        {onRegister ? (
          <Button
            className="auth-switch-button"
            onClick={onRegister}
            disabled={logging}
          >
            Create an account
          </Button>
        ) : (
          <Link to="/auth/registration">Create an account</Link>
        )}
      </div>
    </form>
  );
}
