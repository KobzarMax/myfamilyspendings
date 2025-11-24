import { X } from 'lucide-react';
import ProposalForm from './ProposalForm';
import type { ProposalFormValues } from './ProposalForm';

interface CreateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: ProposalFormValues) => void;
    isSubmitting: boolean;
}

export default function CreateProposalModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
}: CreateProposalModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Create Proposal</h3>
                            <ProposalForm
                                onSubmit={onSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
