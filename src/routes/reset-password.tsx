import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Input from '../components/Input';

export const Route = createFileRoute('/reset-password')({
    component: ResetPasswordPage,
});

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a valid session from the reset link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setValidToken(true);
            } else {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate({ to: '/login' });
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!validToken && error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                            <svg
                                className="h-8 w-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Invalid Reset Link
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {error}
                        </p>
                        <Button
                            onClick={() => navigate({ to: '/forgot-password' })}
                            className="w-full"
                        >
                            Request New Reset Link
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                            Password Reset Successful!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Your password has been updated. Redirecting to login...
                        </p>
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
                        Set new password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="New Password"
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            error={error && !confirmPassword ? error : undefined}
                        />

                        <Input
                            label="Confirm Password"
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            error={error && confirmPassword ? error : undefined}
                        />

                        {password && password.length > 0 && (
                            <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-2">Password requirements:</p>
                                <ul className="space-y-1">
                                    <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span>{password.length >= 8 ? '✓' : '○'}</span>
                                        <span>At least 8 characters</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        disabled={!validToken}
                        className="w-full"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
