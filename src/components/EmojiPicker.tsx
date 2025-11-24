import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
    currentEmoji?: string;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const EMOJI_CATEGORIES = {
    'Food': ['🍕', '🍔', '🍟', '🍿', '🥗', '🍜', '🍱', '🍛', '🍝', '🥘', '🍲', '🥙', '🌮', '🌯', '🥪', '🍞', '🥖', '🧀', '🥚', '🍳', '🥓', '🥞', '🧇', '🍗', '🍖'],
    'Shopping': ['🛒', '🛍️', '💳', '🏪', '🏬', '📦', '🎁', '🧺', '👕', '👔', '👗', '👠', '👟', '🎽', '🧥', '👜', '🎒', '👓', '🕶️', '💄', '💅'],
    'Money': ['💰', '💵', '💴', '💶', '💷', '💳', '💸', '🪙', '💹', '📊', '📈', '📉', '🏦', '🏧', '💼', '📱', '💻'],
    'Transport': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🏍️', '🛵', '🚲', '🛴', '✈️', '🚁', '🚂', '🚆', '🚇', '🚊', '⛽'],
    'Home': ['🏠', '🏡', '🏘️', '🏗️', '🏢', '🏬', '🏥', '🏦', '🏨', '🏪', '🛏️', '🛋️', '🪑', '🚪', '🛁', '🚿', '🚽', '🧻', '🧼', '🧽', '🧹', '🧺'],
    'Fun': ['🎮', '🎯', '🎲', '🎰', '🎳', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎻', '📚', '📖', '🎟️', '🎫'],
    'Health': ['💊', '💉', '🩺', '🩹', '🦷', '🏥', '⚕️', '🏋️', '🤸', '🧘', '🚴', '🏃', '🏊', '🧗', '⛷️', '🏂'],
    'School': ['📚', '📖', '📝', '✏️', '✒️', '🖊️', '🖍️', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📄', '📰', '📑', '🔖', '💼', '📁', '📂', '📅', '📆', '📊', '📋', '📌', '📍', '📎', '✂️'],
    'Tools': ['💡', '🔦', '🕯️', '🧯', '🛢️', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🧲'],
    'Nature': ['🌱', '🌿', '☘️', '🍀', '🌾', '🌵', '🎄', '🌲', '🌳', '🌴', '🌷', '🌹', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌙', '⭐', '🌟', '✨', '⚡', '🔥', '🌈', '☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '☃️', '💧', '💦', '☔', '🌊'],
};

export default function EmojiPicker({ onSelect, onClose, currentEmoji, buttonRef }: EmojiPickerProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(EMOJI_CATEGORIES)[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, buttonRef]);

    // Close on Escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 flex flex-col"
            role="dialog"
            aria-label="Emoji picker"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-semibold text-gray-900">
                    Select Emoji
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 p-1 rounded-md hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Current Selection */}
            {currentEmoji && (
                <div className="px-3 py-2 bg-indigo-50 border-b text-xs text-gray-600">
                    Current: <span className="text-lg ml-1">{currentEmoji}</span>
                </div>
            )}

            {/* Category Tabs */}
            <div className="border-b overflow-x-auto scrollbar-thin">
                <div className="flex gap-1 p-2 min-w-max">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${selectedCategory === category
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Emoji Grid */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-8 gap-1">
                    {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                        <button
                            key={`${emoji}-${index}`}
                            onClick={() => {
                                onSelect(emoji);
                                onClose();
                            }}
                            className="text-2xl p-1.5 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
