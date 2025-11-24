import { Link } from '@tanstack/react-router';

export default function EmptyFamilyState() {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
            <p className="mt-2 text-gray-600">To get started, you need to join or create a family space.</p>
            <div className="mt-6 flex justify-center gap-4">
                <Link
                    to="/create-family"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    Create Family Space
                </Link>
            </div>
        </div>
    );
}
