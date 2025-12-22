import { Pencil, Trash2 } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + '20' }}
                >
                    {category.icon}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(category)}
                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100"
                    aria-label="Edit category"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                {!category.is_default && (
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                        aria-label="Delete category"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
