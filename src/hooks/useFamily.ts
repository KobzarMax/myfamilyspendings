import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../lib/api';

/**
 * Hook to get the current user's family ID
 */
export function useFamilyId() {
  const { user } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);

  useEffect(() => {
    async function getFamilyId() {
      if (!user) return;
      try {
        const profile = await profileApi.getProfile(user.id);
        setFamilyId(profile.family_id);
      } catch (error) {
        console.error('Error fetching family ID:', error);
      }
    }
    getFamilyId();
  }, [user]);

  return familyId;
}

/**
 * Hook to get family members
 */
export function useFamilyMembers(familyId: string | null) {
  return useQuery({
    queryKey: ['family-members', familyId],
    queryFn: () => familyId ? profileApi.getFamilyMembers(familyId) : Promise.resolve([]),
    enabled: !!familyId,
  });
}
