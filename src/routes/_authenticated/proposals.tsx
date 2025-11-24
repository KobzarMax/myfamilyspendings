import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import type { Proposal, Approval } from '../../types';
import ProposalsList from '../../components/proposals/ProposalsList';
import CreateProposalModal from '../../components/proposals/CreateProposalModal';
import EmptyState from '../../components/shared/EmptyState';
import type { ProposalFormValues } from '../../components/proposals/ProposalForm';

export const Route = createFileRoute('/_authenticated/proposals')({
  component: ProposalsPage,
});

function ProposalsPage() {
  const { user } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFamilyId() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', user.id)
        .single();
      if (data) setFamilyId(data.family_id);
    }
    getFamilyId();
  }, [user]);

  const { data: proposals, isLoading } = useQuery({
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
      const { data, error } = await supabase
        .from('approvals')
        .select('*');

      if (error) throw error;
      return data as Approval[];
    },
    enabled: !!familyId,
  });

  const { data: familyMembers } = useQuery({
    queryKey: ['family-members', familyId],
    queryFn: async () => {
      if (!familyId) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('family_id', familyId);

      if (error) throw error;
      return data;
    },
    enabled: !!familyId,
  });

  const createProposalMutation = useMutation({
    mutationFn: async (newProposal: ProposalFormValues) => {
      if (!familyId || !user) throw new Error('Missing family or user');

      const { data, error } = await supabase
        .from('proposals')
        .insert([
          {
            ...newProposal,
            family_id: familyId,
            proposer_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', familyId] });
      setIsModalOpen(false);
    },
  });

  const voteProposalMutation = useMutation({
    mutationFn: async ({ proposalId, voteStatus }: { proposalId: string; voteStatus: 'approved' | 'rejected' }) => {
      if (!user) throw new Error('Missing user');

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('approvals')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('approvals')
          .update({ status: voteStatus })
          .eq('id', existingVote.id);
        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('approvals')
          .insert([
            {
              proposal_id: proposalId,
              user_id: user.id,
              status: voteStatus,
            },
          ]);
        if (error) throw error;
      }

      // Check if all members have approved
      const { data: allApprovals, error: approvalsError } = await supabase
        .from('approvals')
        .select('*')
        .eq('proposal_id', proposalId);

      if (approvalsError) throw approvalsError;

      const totalMembers = familyMembers?.length || 0;
      const approvedCount = allApprovals?.filter(a => a.status === 'approved').length || 0;
      const rejectedCount = allApprovals?.filter(a => a.status === 'rejected').length || 0;

      // If all members approved, update proposal status
      if (approvedCount === totalMembers) {
        const { error: updateError } = await supabase
          .from('proposals')
          .update({ status: 'approved' })
          .eq('id', proposalId);
        if (updateError) throw updateError;
      } else if (rejectedCount > 0) {
        // If anyone rejected, mark as rejected
        const { error: updateError } = await supabase
          .from('proposals')
          .update({ status: 'rejected' })
          .eq('id', proposalId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', familyId] });
      queryClient.invalidateQueries({ queryKey: ['approvals', familyId] });
    },
  });

  const handleSubmit = (values: ProposalFormValues) => {
    createProposalMutation.mutate(values);
  };

  const handleVote = (proposalId: string, voteStatus: 'approved' | 'rejected') => {
    voteProposalMutation.mutate({ proposalId, voteStatus });
  };

  if (!familyId) {
    return (
      <EmptyState
        title="No Family Found"
        description="Please create or join a family first."
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Proposals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and vote on spending or savings proposals.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Create Proposal
          </button>
        </div>
      </div>

      {/* Proposals List */}
      <ProposalsList
        proposals={proposals}
        approvals={approvals}
        familyMembers={familyMembers}
        userId={user?.id}
        isLoading={isLoading}
        onVote={handleVote}
        isVoting={voteProposalMutation.isPending}
      />

      {/* Create Proposal Modal */}
      <CreateProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createProposalMutation.isPending}
      />
    </div>
  );
}
