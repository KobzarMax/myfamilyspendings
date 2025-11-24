import { CategoryCardSkeleton } from '../Skeleton';
import CategoryCard from './CategoryCard';
import type { Category } from '../../types';

interface CategoryGridProps {
    title: string;
    categories: Category[];
    isLoading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export default function CategoryGrid({
    title,
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoryGridProps) {
    if (isLoading) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-2">
                    <CategoryCardSkeleton />
                    <CategoryCardSkeleton />
                    <CategoryCardSkeleton />
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-sm text-gray-500">No categories yet</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="space-y-2">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
