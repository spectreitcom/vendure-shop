import { useServerFn } from '@tanstack/react-start';
import { resetPassword } from '#/features/reset-password';
import { useForm } from '@tanstack/react-form';
import { resetPasswordInputSchema } from '#/features/reset-password/schemas';
import { useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { CheckCircleOutlined } from '@mui/icons-material';
import { z } from 'zod';
import { useActiveCart } from '#/features/shared/cart';
import { useActiveUser } from '#/features/shared/authentication';
import { m } from '#/paraglide/messages';

type Props = Readonly<{
  token: string;
}>;

export function ChangePasswordForm({ token }: Props) {
  const changePasswordFn = useServerFn(resetPassword);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { refresh: refreshActiveCart } = useActiveCart();
  const { refresh: refreshActiveUser } = useActiveUser();

  const form = useForm({
    validators: {
      onSubmit: resetPasswordInputSchema
        .pick({ password: true })
        .extend({ confirmPassword: z.string() })
        .refine((values) => values.password === values.confirmPassword, {
          message: m.change_password_mismatch(),
          path: ['confirmPassword'],
        }),
    },
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value: { password } }) => {
      try {
        setError(null);
        setSubmitting(true);
        await changePasswordFn({ data: { token, password } });
        await refreshActiveCart();
        await refreshActiveUser();
        setSuccess(true);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError(m.change_password_error());
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (success)
    return (
      <div>
        <header className="auth-form-heading">
          <span className="auth-eyebrow">
            {m.change_password_success_eyebrow()}
          </span>
          <h1>{m.change_password_success_title()}</h1>
        </header>
        <div className="auth-status" role="status">
          <CheckCircleOutlined />
          <p>{m.change_password_success_message()}</p>
        </div>
        <div className="auth-switch">
          <Link to="/">{m.common_continue_shopping()}</Link>
        </div>
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
      <header className="auth-form-heading">
        <span className="auth-eyebrow">{m.reset_password_eyebrow()}</span>
        <h1>{m.change_password_title()}</h1>
        <p>{m.change_password_description()}</p>
      </header>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="auth-fields">
        {(['password', 'confirmPassword'] as const).map((name) => (
          <form.Field
            key={name}
            name={name}
            children={(field) => (
              <TextField
                fullWidth
                type="password"
                label={
                  name === 'password'
                    ? m.change_password_new()
                    : m.change_password_confirm()
                }
                autoComplete="new-password"
                name={name}
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={
                  field.state.meta.errors.length
                    ? field.state.meta.errors.map((e) => e?.message).join(' ')
                    : name === 'password'
                      ? m.common_password_hint()
                      : undefined
                }
              />
            )}
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          className="auth-submit"
          fullWidth
          loading={submitting}
          disabled={submitting}
        >
          {m.change_password_submit()}
        </Button>
      </div>
      <div className="auth-switch">
        <Link to="/auth/reset-password" search={{ token: undefined }}>
          {m.change_password_request_new_link()}
        </Link>
        <Link to="/auth/login">{m.common_back_to_sign_in()}</Link>
      </div>
    </form>
  );
}
