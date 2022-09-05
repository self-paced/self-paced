import { FlashMessage } from '@super_studio/ecforce_ui_albers';

const Toast: React.FC<{
  message: string;
  variant?: 'success' | 'error' | 'warning';
  open: boolean;
  onClose: () => void;
}> = ({ message, variant, open, onClose }) => {
  return (
    <FlashMessage
      open={open}
      onClose={onClose}
      message={message}
      variant={variant}
    />
  );
};

export default Toast;
