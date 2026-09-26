import { CircularProgress } from '@mui/material';
import { m } from '#/paraglide/messages';

export function PendingComponent() {
  return <CircularProgress size={24} aria-label={m.common_loading()} />;
}
