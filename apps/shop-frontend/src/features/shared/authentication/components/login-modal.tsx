import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { LoginForm } from '#/features/authentication';

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export function LoginModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent className={'w-[400px]'}>
        <LoginForm skipRedirect hideTitle hideShadow onLoginSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
