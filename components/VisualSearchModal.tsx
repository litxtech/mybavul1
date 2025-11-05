import React, { useState, useCallback } from 'react';
import { useLanguage } from '../i18n';
import { Property } from '../types';
import { getSupabaseClient } from '../lib/supabase';
import { CameraIcon } from './icons';

interface VisualSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearchComplete: (properties: Property[]) => void;
}

// Utility to convert a Blob to a base64 string, removing the data URL prefix.
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose, onSearchComplete }) => {
    const { t } = useLanguage();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const resetState = () => {
        setImageFile(null);
        setPreviewUrl(null);
        setStatus('idle');
        setErrorMessage('');
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const processFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setErrorMessage('');
        } else {
            setErrorMessage('Please upload a valid image file (JPEG, PNG).');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleSearch = async () => {
        if (!imageFile) return;
        setStatus('loading');
        setErrorMessage('');
        try {
            const base64Data = await blobToBase64(imageFile);
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.functions.invoke('visual-search', {
                body: { image: base64Data, mimeType: imageFile.type }
            });

            if (error) throw new Error(error.message);
            
            onSearchComplete(data.properties);
            handleClose();
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'An unknown error occurred.');
            console.error('Visual search failed:', err);
        } finally {
             if (status !== 'error') setStatus('idle');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('search.withImage')}</h2>
                    <button onClick={handleClose} className="text-2xl" aria-label="Close">&times;</button>
                </header>
                <main className="p-6">
                    {previewUrl ? (
                        <div className="text-center">
                            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                            <button onClick={() => { setImageFile(null); setPreviewUrl(null); }} className="mt-4 text-sm text-red-500 hover:underline">Remove image</button>
                        </div>
                    ) : (
                        <div 
                            onDrop={handleDrop}
                            onDragEnter={handleDragEvents}
                            onDragLeave={handleDragEvents}
                            onDragOver={handleDragEvents}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600'}`}
                        >
                            <CameraIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <p className="font-semibold">Drag & drop your image here</p>
                            <p className="text-sm text-slate-500 my-2">or</p>
                            <label htmlFor="file-upload" className="cursor-pointer font-semibold text-primary-600 hover:text-primary-700">
                                Choose a file
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                        </div>
                    )}
                    {errorMessage && <p className="text-red-500 text-center mt-4 text-sm">{errorMessage}</p>}
                </main>
                <footer className="p-4 border-t dark:border-slate-700 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!imageFile || status === 'loading'}
                        className="btn-primary"
                    >
                        {status === 'loading' ? 'Searching...' : 'Find similar stays'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
export default VisualSearchModal;