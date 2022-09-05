import { Button, Dialog as EcfDialog } from '@super_studio/ecforce_ui_albers';

const Dialog: React.FC<{
  title: string;
  body?: React.ReactNode;
  variant?: 'primary' | 'destructive';
  confirmText?: string;
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  noCancelButton?: boolean;
}> = ({
  title,
  body,
  variant = 'primary',
  confirmText = '確認',
  open,
  onConfirm,
  onCancel,
  noCancelButton,
}) => {
  return open ? (
    <EcfDialog
      open={open}
      title={title}
      description={body}
      button={
        <>
          {!noCancelButton && <Button onClick={onCancel}>キャンセル</Button>}
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    />
  ) : null;
};

export default Dialog;
