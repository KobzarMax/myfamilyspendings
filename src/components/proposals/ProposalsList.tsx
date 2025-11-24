import { ProposalCardSkeleton } from '../Skeleton';
import ProposalCard from './ProposalCard';
import type { Proposal, Approval } from '../../types';

interface ProposalsListProps {
    proposals: Proposal[] | undefined;
    approvals: Approval[] | undefined;
    familyMembers: { id: string }[] | undefined;
    userId: string | undefined;
    isLoading: boolean;
    onVote: (proposalId: string, voteStatus: 'approved' | 'rejected') => void;
    isVoting: boolean;
}

export default function ProposalsList({
    proposals,
    approvals,
    familyMembers,
    userId,
    isLoading,
    onVote,
    isVoting,
}: ProposalsListProps) {
    const getUserVote = (proposalId: string) => {
        return approvals?.find(a => a.proposalId === proposalId && a.userId === userId);
    };

    const getApprovalCount = (proposalId: string) => {
        return approvals?.filter(a => a.proposalId === proposalId && a.status === 'approved').length || 0;
    };

    if (isLoading) {
        return (
            <div className="mt-8 space-y-4">
                <ProposalCardSkeleton />
                <ProposalCardSkeleton />
                <ProposalCardSkeleton />
            </div>
        );
    }

    if (proposals?.length === 0) {
        return (
            <div className="mt-8 text-center py-10 text-gray-500">
                No proposals yet
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            {proposals?.map((proposal) => {
                const userVote = getUserVote(proposal.id);
                const approvalCount = getApprovalCount(proposal.id);
                const totalMembers = familyMembers?.length || 0;

                return (
                    <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        userVote={userVote}
                        approvalCount={approvalCount}
                        totalMembers={totalMembers}
                        onVote={onVote}
                        isVoting={isVoting}
                    />
                );
            })}
        </div>
    );
}
