import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useState } from 'react';
import { LoginForm } from '#/features/authentication';
import { RegistrationForm } from '#/features/registration';
import '#/components/auth.css';

type Props = Readonly<{ open: boolean; onClose: () => void }>;

export function LoginModal({ open, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="auth-dialog"
      aria-labelledby="auth-dialog-title"
      aria-describedby="auth-dialog-description"
    >
      <AuthDialogContent onClose={onClose} />
    </Dialog>
  );
}

function AuthDialogContent({ onClose }: { onClose: () => void }) {
  const [registering, setRegistering] = useState(false);
  return (
    <div className="auth-surface">
      <div className="auth-dialog-header">
        <span className="auth-eyebrow">
          {registering ? 'Join the shop' : 'Your account'}
        </span>
        <IconButton
          className="auth-close"
          aria-label="Close account dialog"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
        <DialogTitle id="auth-dialog-title" className="auth-dialog-title">
          {registering ? 'Create an account' : 'Welcome back'}
        </DialogTitle>
        <p id="auth-dialog-description" className="auth-description">
          {registering
            ? 'A simple start to your next favourite find.'
            : 'Sign in to continue with your order.'}
        </p>
      </div>
      <DialogContent className="auth-dialog-content">
        {registering ? (
          <RegistrationForm hideTitle onSignIn={() => setRegistering(false)} />
        ) : (
          <LoginForm
            skipRedirect
            hideTitle
            onLoginSuccess={onClose}
            onRegister={() => setRegistering(true)}
            onNavigateAway={onClose}
          />
        )}
      </DialogContent>
    </div>
  );
}
