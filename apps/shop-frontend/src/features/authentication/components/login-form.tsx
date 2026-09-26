import { Alert, Button, TextField } from '@mui/material';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { login } from '#/features/authentication';
import { Link, useRouter } from '@tanstack/react-router';
import { useActiveCart } from '#/features/shared/cart';
import { useActiveUser } from '#/features/shared/authentication';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  skipRedirect?: boolean;
  hideTitle?: boolean;
  onLoginSuccess?: () => void;
  onRegister?: () => void;
  onNavigateAway?: () => void;
}>;

const formValidationSchema = z.object({
  username: z.email({ error: () => m.common_invalid_email() }),
  password: z.string().min(1, { error: () => m.login_password_required() }),
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
          setError(m.login_wrong_credentials());
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
          <span className="auth-eyebrow">{m.common_your_account()}</span>
          <h1>{m.login_title()}</h1>
          <p>{m.login_description()}</p>
        </header>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="auth-fields">
        <form.Field
          name="username"
          children={(field) => (
            <TextField
              fullWidth
              label={m.common_email_address()}
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
              label={m.common_password()}
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
            {m.login_forgot_password()}
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
          {m.common_sign_in()}
        </Button>
      </div>
      <div className="auth-switch">
        <span>{m.login_new_here()}</span>
        {onRegister ? (
          <Button
            className="auth-switch-button"
            onClick={onRegister}
            disabled={logging}
          >
            {m.common_create_account()}
          </Button>
        ) : (
          <Link to="/auth/registration">{m.common_create_account()}</Link>
        )}
      </div>
    </form>
  );
}
