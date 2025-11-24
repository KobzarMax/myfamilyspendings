import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import OnboardingSlider from '../../components/onboarding/OnboardingSlider';
import { useAuthStore } from '../../store/authStore';
import { useSeedDefaultCategories } from '../../hooks/useCategories';
import { useFamilyId } from '../../hooks/useFamily';
import Button from '../../components/Button';

export const Route = createFileRoute('/_authenticated/onboarding')({
    component: OnboardingPage,
});

function OnboardingPage() {
    const navigate = useNavigate();
    const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted);
    const familyId = useFamilyId();
    const seedCategories = useSeedDefaultCategories(familyId || '');
    const [isSeeding, setIsSeeding] = useState(false);
    const [categoriesSeeded, setCategoriesSeeded] = useState(false);

    const handleComplete = () => {
        setOnboardingCompleted();
        navigate({ to: '/dashboard' });
    };

    const handleSkip = () => {
        setOnboardingCompleted();
        navigate({ to: '/dashboard' });
    };

    const handleSeedCategories = async () => {
        if (!familyId) return;

        setIsSeeding(true);
        try {
            await seedCategories.mutateAsync();
            setCategoriesSeeded(true);
        } catch (error) {
            console.error('Failed to seed categories:', error);
        } finally {
            setIsSeeding(false);
        }
    };

    const slides = [
        {
            id: 'welcome',
            title: 'Welcome to Family Budget Tracker! 👋',
            description: 'Manage your family finances together in one place. Track expenses, plan budgets, and make financial decisions as a team.',
            icon: '💰',
        },
        {
            id: 'features',
            title: 'Powerful Features',
            description: 'Track income and expenses, create spending proposals, collaborate with family members, and get insights into your spending patterns.',
            icon: '✨',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Track Transactions</h3>
                        <p className="text-sm text-gray-600">Record income and expenses with detailed categories</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Family Collaboration</h3>
                        <p className="text-sm text-gray-600">Work together on financial decisions</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="text-4xl mb-3">💡</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Spending Proposals</h3>
                        <p className="text-sm text-gray-600">Get approval for major purchases</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="text-4xl mb-3">📈</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Insights</h3>
                        <p className="text-sm text-gray-600">Understand your spending patterns</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'categories',
            title: 'Organize with Categories',
            description: 'Categories help you organize and track different types of income and expenses. Start with our pre-made categories or create your own later.',
            icon: '🏷️',
            content: (
                <div className="max-w-md mx-auto mt-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-2xl">💰</div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Income Categories</h4>
                                <p className="text-sm text-gray-600">Salary, Freelance, Investment, Gifts, and more</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">🛒</div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Expense Categories</h4>
                                <p className="text-sm text-gray-600">Groceries, Rent, Utilities, Entertainment, and more</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSeedCategories}
                        isLoading={isSeeding}
                        disabled={categoriesSeeded}
                        className="w-full"
                        size="lg"
                    >
                        {categoriesSeeded ? '✓ Categories Added' : '🌱 Seed Default Categories'}
                    </Button>

                    {categoriesSeeded && (
                        <p className="text-sm text-green-600 text-center mt-3">
                            Great! 15 default categories have been added to your family.
                        </p>
                    )}
                </div>
            ),
        },
        {
            id: 'ready',
            title: "You're All Set! 🎉",
            description: "You're ready to start tracking your family budget. Let's begin your financial journey together!",
            icon: '🚀',
            content: (
                <div className="max-w-md mx-auto mt-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-xl font-semibold mb-3">Quick Tips:</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-lg">💡</span>
                                <span>Add transactions regularly to keep track of your spending</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">👥</span>
                                <span>Invite family members to collaborate on budgeting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">📝</span>
                                <span>Create proposals for big purchases to get family approval</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">🎯</span>
                                <span>Review your dashboard regularly to stay on track</span>
                            </li>
                        </ul>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <OnboardingSlider
            slides={slides}
            onComplete={handleComplete}
            onSkip={handleSkip}
        />
    );
}
