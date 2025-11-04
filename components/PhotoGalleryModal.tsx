import React, { useState, useEffect } from 'react';

interface PhotoGalleryModalProps {
    images: string[];
    isOpen: boolean;
    onClose: () => void;
    startIndex?: number;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ images, isOpen, onClose, startIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(startIndex);
        }
    }, [isOpen, startIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex]);

    if (!isOpen) return null;

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center" role="dialog" aria-modal="true">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50" aria-label="Close gallery">
                &times;
            </button>
            
            {/* Counter */}
            <div className="absolute top-4 left-4 text-white text-lg z-50 bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Main Content */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Previous Button */}
                <button onClick={goToPrevious} className="absolute left-4 p-3 text-white bg-black/40 rounded-full hover:bg-black/60 z-50" aria-label="Previous image">
                    &#10094;
                </button>
                
                {/* Image Display */}
                <div className="w-full h-full flex items-center justify-center p-16">
                    <img src={images[currentIndex]} alt={`View ${currentIndex + 1} of ${images.length}`} className="max-h-full max-w-full object-contain" />
                </div>
                
                {/* Next Button */}
                <button onClick={goToNext} className="absolute right-4 p-3 text-white bg-black/40 rounded-full hover:bg-black/60 z-50" aria-label="Next image">
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default PhotoGalleryModal;