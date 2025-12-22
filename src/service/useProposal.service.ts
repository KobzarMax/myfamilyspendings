import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Proposal, Approval } from '../types';
import type { ProposalFormValues } from '../components/proposals/ProposalForm';
import type { User } from '@supabase/supabase-js';

export function useProposalService(familyId: string | null, user: User | null | undefined) {
    const queryClient = useQueryClient();

    // Queries
    const { data: proposals, isLoading: proposalsLoading } = useQuery({
        queryKey: ['proposals', familyId],
        queryFn: async () => {
            if (!familyId) return [];
            const { data, error } = await supabase
                .from('proposals')
                .select('*')
                .eq('family_id', familyId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Proposal[];
        },
        enabled: !!familyId,
    });

    const { data: approvals } = useQuery({
        queryKey: ['approvals', familyId],
        queryFn: async () => {
            if (!familyId) return [];
            const { data, error } = await supabase.from('approvals').select('*');
            if (error) throw error;
            return data as Approval[];
        },
        enabled: !!familyId,
    });

    const { data: familyMembers } = useQuery({
        queryKey: ['family-members', familyId],
        queryFn: async () => {
            if (!familyId) return [];
            const { data, error } = await supabase.from('profiles').select('id').eq('family_id', familyId);
            if (error) throw error;
            return data;
        },
        enabled: !!familyId,
    });

    // Mutations
    const createProposalMutation = useMutation({
        mutationFn: async (newProposal: ProposalFormValues) => {
            if (!familyId || !user) throw new Error('Missing family or user');
            const { data, error } = await supabase
                .from('proposals')
                .insert([{ ...newProposal, family_id: familyId, proposer_id: user.id }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposals', familyId] }),
    });

    const voteProposalMutation = useMutation({
        mutationFn: async ({ proposalId, voteStatus }: { proposalId: string; voteStatus: 'approved' | 'rejected' }) => {
            if (!user) throw new Error('Missing user');

            // 1. Check existing vote
            const { data: existingVote } = await supabase
                .from('approvals')
                .select('*')
                .eq('proposal_id', proposalId)
                .eq('user_id', user.id)
                .single();

            if (existingVote) {
                const { error } = await supabase.from('approvals').update({ status: voteStatus }).eq('id', existingVote.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('approvals').insert([{ proposal_id: proposalId, user_id: user.id, status: voteStatus }]);
                if (error) throw error;
            }

            // 2. Check consensus
            const { data: allApprovals } = await supabase.from('approvals').select('*').eq('proposal_id', proposalId);
            const totalMembers = familyMembers?.length || 0;
            const approvedCount = allApprovals?.filter(a => a.status === 'approved').length || 0;
            const rejectedCount = allApprovals?.filter(a => a.status === 'rejected').length || 0;

            if (approvedCount === totalMembers && totalMembers > 0) {
                await supabase.from('proposals').update({ status: 'approved' }).eq('id', proposalId);
            } else if (rejectedCount > 0) {
                await supabase.from('proposals').update({ status: 'rejected' }).eq('id', proposalId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proposals', familyId] });
            queryClient.invalidateQueries({ queryKey: ['approvals', familyId] });
        },
    });

    return {
        // Data
        proposals,
        proposalsLoading,
        approvals,
        familyMembers,

        // Actions
        createProposal: createProposalMutation.mutate,
        createProposalAsync: createProposalMutation.mutateAsync,
        voteProposal: voteProposalMutation.mutate,
        voteProposalAsync: voteProposalMutation.mutateAsync,

        // States
        isCreating: createProposalMutation.isPending,
        isVoting: voteProposalMutation.isPending,
    };
}
