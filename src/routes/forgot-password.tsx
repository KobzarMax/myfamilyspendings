import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Input from '../components/Input';

export const Route = createFileRoute('/forgot-password')({
    component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Check your email
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Click the link in the email to reset your password. The link will expire in 1 hour.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate({ to: '/login' })}
                                className="w-full"
                            >
                                Back to Login
                            </Button>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail('');
                                }}
                                className="w-full text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Send another email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Email address"
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        error={error || undefined}
                    />

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full"
                        >
                            Send reset link
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Back to login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
