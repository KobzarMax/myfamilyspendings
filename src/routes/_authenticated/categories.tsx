import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCategoryService } from '../../service/useCategory.service';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { Category } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { profileQueryOptions, categoriesQueryOptions } from '../../lib/queries';
import CategoryGrid from '../../components/categories/CategoryGrid';
import CategoryModal from '../../components/categories/CategoryModal';
import EmptyState from '../../components/shared/EmptyState';
import type { CategoryFormValues } from '../../components/categories/CategoryForm';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export const Route = createFileRoute('/_authenticated/categories')({
  loader: async ({ context: { queryClient } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await queryClient.ensureQueryData(profileQueryOptions(user.id));

    if (profile?.family_id) {
      await queryClient.ensureQueryData(categoriesQueryOptions(profile.family_id));
    }
    return { userId: user.id };
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const { user } = useAuth();
  const { userId } = Route.useLoaderData() || {};
  const { data: profile } = useQuery(profileQueryOptions(userId || user?.id));
  const familyId = profile?.family_id || null;

  const service = useCategoryService(familyId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!familyId) return;

    try {
      if (editingCategory) {
        await service.saveCategory({
          ...values,
          id: editingCategory.id,
        });
      } else {
        await service.saveCategory(values);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        await service.deleteCategoryAsync(id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSeed = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Add Default Categories',
      message: 'This will add default income and expense categories to your family. Continue?',
      variant: 'info',
      onConfirm: async () => {
        try {
          await service.seedDefaultCategoriesAsync();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to seed categories:', error);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  if (!familyId) {
    return (
      <EmptyState
        title="No Family Found"
        description="Please create or join a family first."
      />
    );
  }



  // Prepare initial values for editing
  const initialValues = editingCategory ? {
    name: editingCategory.name,
    type: editingCategory.type as 'income' | 'expense' | 'both',
    icon: editingCategory.icon || '',
    color: editingCategory.color || '#6b7280',
  } : undefined;

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex justify-between items-start mb-8" variants={itemVariants}>
        <PageHeader
          title="Categories"
          description="Manage your income and expense categories"
          action={{
            label: 'Add Category',
            onClick: () => handleOpenModal(),
          }}
        />
        {service.categories?.length === 0 && (
          <Button
            variant="secondary"
            onClick={handleSeed}
            isLoading={service.isSeeding}
          >
            Seed Defaults
          </Button>
        )}
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
        <CategoryGrid
          title="Income Categories"
          categories={service.incomeCategories}
          isLoading={service.isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
        <CategoryGrid
          title="Expense Categories"
          categories={service.expenseCategories}
          isLoading={service.isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </motion.div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={service.isSubmitting}
        isEditing={!!editingCategory}
        initialValues={initialValues}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={service.isDeleting || service.isSeeding}
      />
    </motion.div>
  );
}
