import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Proposal, Approval } from '../../types';

interface ProposalCardProps {
    proposal: Proposal;
    userVote: Approval | undefined;
    approvalCount: number;
    totalMembers: number;
    onVote: (proposalId: string, voteStatus: 'approved' | 'rejected') => void;
    isVoting: boolean;
}

export default function ProposalCard({
    proposal,
    userVote,
    approvalCount,
    totalMembers,
    onVote,
    isVoting,
}: ProposalCardProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{proposal.description}</h3>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${proposal.type === 'spending' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                            {proposal.type}
                        </span>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {proposal.status}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Amount: ${Number(proposal.amount).toFixed(2)}</p>
                    {proposal.target_date && (
                        <p className="mt-1 text-sm text-gray-500">
                            Target Date: {new Date(proposal.target_date).toLocaleDateString()}
                        </p>
                    )}
                    <p className="mt-2 text-sm text-gray-600">
                        Approvals: {approvalCount} / {totalMembers}
                    </p>
                </div>

                {proposal.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => onVote(proposal.id, 'approved')}
                            disabled={userVote?.status === 'approved' || isVoting}
                            className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${userVote?.status === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50`}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            Approve
                        </button>
                        <button
                            onClick={() => onVote(proposal.id, 'rejected')}
                            disabled={userVote?.status === 'rejected' || isVoting}
                            className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${userVote?.status === 'rejected'
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50`}
                        >
                            <ThumbsDown className="h-4 w-4" />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
