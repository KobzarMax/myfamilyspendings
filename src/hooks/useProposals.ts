import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalApi, approvalApi } from '../lib/api';
import { useFamilyMembers } from './useFamily';

/**
 * Hook to get proposals for a family
 */
export function useProposals(familyId: string | null) {
  return useQuery({
    queryKey: ['proposals', familyId],
    queryFn: () => familyId ? proposalApi.getProposals(familyId) : Promise.resolve([]),
    enabled: !!familyId,
  });
}

/**
 * Hook to get approvals
 */
export function useApprovals(familyId: string | null) {
  return useQuery({
    queryKey: ['approvals', familyId],
    queryFn: () => approvalApi.getApprovals(),
    enabled: !!familyId,
  });
}

/**
 * Hook to create a proposal
 */
export function useCreateProposal(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proposalApi.createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', familyId] });
    },
  });
}

/**
 * Hook to vote on a proposal
 */
export function useVoteProposal(familyId: string | null) {
  const queryClient = useQueryClient();
  const { data: familyMembers } = useFamilyMembers(familyId);

  return useMutation({
    mutationFn: async ({ 
      proposalId, 
      userId, 
      voteStatus 
    }: { 
      proposalId: string; 
      userId: string; 
      voteStatus: 'approved' | 'rejected' 
    }) => {
      // Create or update vote
      await approvalApi.createOrUpdateVote(proposalId, userId, voteStatus);

      // Check if all members have voted
      const allApprovals = await approvalApi.getApprovals(proposalId);
      const totalMembers = familyMembers?.length || 0;
      const approvedCount = allApprovals?.filter(a => a.status === 'approved').length || 0;
      const rejectedCount = allApprovals?.filter(a => a.status === 'rejected').length || 0;

      // Update proposal status if needed
      if (approvedCount === totalMembers) {
        await proposalApi.updateProposalStatus(proposalId, 'approved');
      } else if (rejectedCount > 0) {
        await proposalApi.updateProposalStatus(proposalId, 'rejected');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', familyId] });
      queryClient.invalidateQueries({ queryKey: ['approvals', familyId] });
    },
  });
}
