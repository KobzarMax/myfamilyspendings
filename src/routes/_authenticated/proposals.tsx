import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import ProposalsList from '../../components/proposals/ProposalsList';
import CreateProposalModal from '../../components/proposals/CreateProposalModal';
import EmptyState from '../../components/shared/EmptyState';
import type { ProposalFormValues } from '../../components/proposals/ProposalForm';
import { profileQueryOptions } from '../../lib/queries';
import { useProposalService } from '../../service/useProposal.service';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export const Route = createFileRoute('/_authenticated/proposals')({
  loader: async ({ context: { queryClient } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await queryClient.ensureQueryData(profileQueryOptions(user.id));
    }
  },
  component: ProposalsPage,
});

function ProposalsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use TanStack Query to fetch profile and derive familyId
  const { data: profile, isLoading: isLoadingProfile } = useQuery(profileQueryOptions(user?.id));
  const familyId = profile?.family_id;

  const service = useProposalService(familyId, user);

  const handleSubmit = (values: ProposalFormValues) => {
    service.createProposal(values, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const handleVote = (proposalId: string, voteStatus: 'approved' | 'rejected') => {
    service.voteProposal({ proposalId, voteStatus });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-full max-w-lg animate-pulse rounded-lg bg-muted/50 p-6">
          <div className="h-6 w-1/3 rounded bg-muted/50 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted/50"></div>
            <div className="h-4 w-5/6 rounded bg-muted/50"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!familyId) {
    return (
      <EmptyState
        title="No Family Found"
        description="Please create or join a family first."
      />
    );
  }

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="sm:flex sm:items-center" variants={itemVariants}>
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
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Proposal
          </button>
        </div>
      </motion.div>

      {/* Proposals List */}
      <motion.div variants={itemVariants}>
        <ProposalsList
          proposals={service.proposals}
          approvals={service.approvals}
          familyMembers={service.familyMembers}
          userId={user?.id}
          isLoading={service.proposalsLoading}
          onVote={handleVote}
          isVoting={service.isVoting}
        />
      </motion.div>

      {/* Create Proposal Modal */}
      <CreateProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={service.isCreating}
      />
    </motion.div>
  );
}
