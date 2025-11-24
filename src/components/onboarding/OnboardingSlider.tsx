import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: string;
    content?: React.ReactNode;
}

interface OnboardingSliderProps {
    slides: OnboardingSlide[];
    onComplete: () => void;
    onSkip?: () => void;
}

export default function OnboardingSlider({ slides, onComplete, onSkip }: OnboardingSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleDotClick = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const currentSlideData = slides[currentSlide];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
            {/* Skip Button */}
            {onSkip && currentSlide < slides.length - 1 && (
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={onSkip}
                        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        Skip
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentSlide}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="text-center"
                        >
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="text-8xl mb-8"
                            >
                                {currentSlideData.icon}
                            </motion.div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                {currentSlideData.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                                {currentSlideData.description}
                            </p>

                            {/* Custom Content */}
                            {currentSlideData.content && (
                                <div className="mt-8">{currentSlideData.content}</div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pb-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 bg-indigo-600'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 justify-between items-center">
                        <Button
                            variant="secondary"
                            onClick={handlePrevious}
                            disabled={currentSlide === 0}
                            className="min-w-[100px]"
                        >
                            Previous
                        </Button>

                        <div className="text-sm text-gray-500">
                            {currentSlide + 1} / {slides.length}
                        </div>

                        <Button
                            onClick={handleNext}
                            className="min-w-[100px]"
                        >
                            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
