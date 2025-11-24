import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useSeedDefaultCategories } from '../../hooks/useCategories';
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

  const { data: categories, isLoading } = useCategories(familyId);
  const createCategory = useCreateCategory(familyId);
  const updateCategory = useUpdateCategory(familyId);
  const deleteCategory = useDeleteCategory(familyId);
  const seedDefaultCategories = useSeedDefaultCategories(familyId);

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
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          updates: values,
        });
      } else {
        await createCategory.mutateAsync({
          family_id: familyId,
          ...values,
        });
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
        await deleteCategory.mutateAsync(id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
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
          await seedDefaultCategories.mutateAsync();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error) {
          console.error('Failed to seed categories:', error);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
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

  const incomeCategories = categories?.filter(c => c.type === 'income' || c.type === 'both') || [];
  const expenseCategories = categories?.filter(c => c.type === 'expense' || c.type === 'both') || [];

  // Prepare initial values for editing
  const initialValues = editingCategory ? {
    name: editingCategory.name,
    type: editingCategory.type,
    icon: editingCategory.icon || '',
    color: editingCategory.color || '#6b7280',
  } : undefined;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-start mb-8">
        <PageHeader
          title="Categories"
          description="Manage your income and expense categories"
          action={{
            label: 'Add Category',
            onClick: () => handleOpenModal(),
          }}
        />
        {categories?.length === 0 && (
          <Button
            variant="secondary"
            onClick={handleSeed}
            isLoading={seedDefaultCategories.isPending}
          >
            Seed Defaults
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryGrid
          title="Income Categories"
          categories={incomeCategories}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
        <CategoryGrid
          title="Expense Categories"
          categories={expenseCategories}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
        isEditing={!!editingCategory}
        initialValues={initialValues}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={deleteCategory.isPending || seedDefaultCategories.isPending}
      />
    </div>
  );
}
