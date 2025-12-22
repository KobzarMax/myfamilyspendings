import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../store/authStore';
import { categoryApi } from '../../lib/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export const Route = createFileRoute('/_authenticated/create-family')({
  component: CreateFamilyPage,
});

function CreateFamilyPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted);
  const navigate = useNavigate();

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // 0. Ensure profile exists (create if it doesn't)
      const { error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
            },
          ]);

        if (profileCreateError) throw new Error(`Failed to create profile: ${profileCreateError.message}`);
      } else if (profileCheckError) {
        throw profileCheckError;
      }

      // 1. Create Family
      console.log('Attempting to create family with:', { name, created_by: user.id });

      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert([
          {
            name,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (familyError) throw familyError;

      // 2. Update Profile with Family ID
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3. Seed default categories
      try {
        await categoryApi.seedDefaultCategories(family.id);
      } catch (categoryError) {
        console.error('Failed to seed categories:', categoryError);
        // Don't fail family creation if category seeding fails
      }

      // 4. Mark onboarding as completed
      setOnboardingCompleted();

      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>Create a Family Space</motion.h1>
      <motion.form onSubmit={handleCreateFamily} className="space-y-4" variants={itemVariants}>
        <Input
          label="Family Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. The Smiths"
          error={error || undefined}
        />

        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
        >
          Create Family Space
        </Button>
      </motion.form>
    </motion.div>
  );
}

