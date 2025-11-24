import Modal from '../Modal';
import CategoryForm from './CategoryForm';
import type { CategoryFormValues } from './CategoryForm';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: CategoryFormValues) => void;
    isSubmitting: boolean;
    isEditing: boolean;
    initialValues?: CategoryFormValues;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    isEditing,
    initialValues,
}: CategoryModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Category' : 'Add Category'}
        >
            <CategoryForm
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isEditing={isEditing}
                initialValues={initialValues}
            />
        </Modal>
    );
}
