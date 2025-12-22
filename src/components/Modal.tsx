import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center md:items-center p-4 text-center sm:items-center">
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative transform overflow-hidden rounded-t-[20px] sm:rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6 max-h-[90dvh] overflow-y-auto">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">
                {title}
              </h3>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
