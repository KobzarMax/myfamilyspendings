import { AlertTriangle } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'warning',
}: ConfirmDialogProps) {
    const iconColor = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
    }[variant];

    const buttonVariant = variant === 'danger' ? 'danger' : 'primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : 'blue'}-100 sm:mx-0 sm:h-10 sm:w-10`}>
                    <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <Button
                    onClick={onConfirm}
                    variant={buttonVariant}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : confirmText}
                </Button>
                <Button
                    onClick={onClose}
                    variant="secondary"
                    disabled={isLoading}
                >
                    {cancelText}
                </Button>
            </div>
        </Modal>
    );
}
