import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import { SparklesIcon, PaperAirplaneIcon } from './icons';
import { SearchParams } from '../types';
import { createAIPlannerChat } from '../services/geminiService';
import { Chat } from '@google/genai';

interface AIPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (params: SearchParams) => void;
}

type Message = {
    role: 'user' | 'model';
    text: string;
}

const AIPlannerModal: React.FC<AIPlannerModalProps> = ({ isOpen, onClose, onSearch }) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            const chat = createAIPlannerChat(language.name);
            if (chat) {
                chatRef.current = chat;
                setMessages([{ role: 'model', text: t('ai.planner.welcome') }]);
            } else {
                setMessages([{ role: 'model', text: 'Sorry, the AI Planner is currently unavailable due to a configuration issue.' }]);
            }
        } else if (!isOpen) {
            // Reset on close
            chatRef.current = null;
            setMessages([]);
            setUserInput('');
        }
    }, [isOpen, language.name, t]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userInput.trim() || isLoading || !chatRef.current) return;

        const newUserMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            // FIX: Per @google/genai guidelines, chat.sendMessage requires an object with a `message` property, not a raw string.
            const result = await chatRef.current.sendMessage({ message: currentInput });
            
            if (result.functionCalls && result.functionCalls.length > 0) {
                const functionCall = result.functionCalls[0];
                if (functionCall.name === 'searchHotels') {
                    const args = functionCall.args as unknown as SearchParams;
                     setMessages(prev => [...prev, { role: 'model', text: `Harika! ${args.city} için en iyi otelleri arıyorum...` }]);
                     setTimeout(() => {
                         onSearch(args);
                         onClose();
                     }, 1500);
                }
            } else {
                 setMessages(prev => [...prev, { role: 'model', text: result.text }]);
            }

        } catch (error) {
            console.error("Error communicating with AI Planner:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble right now." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md h-[70vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ai-planner-title"
            >
                <header className="p-4 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <SparklesIcon className="w-6 h-6 text-primary-600" />
                        <h3 id="ai-planner-title" className="font-bold text-lg text-slate-800 dark:text-white">{t('ai.planner.title')}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl" aria-label="Close">&times;</button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                                msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 
                                'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                            }`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2">
                                <span className="animate-pulse">...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder={t('ai.planner.placeholder')}
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700"
                            disabled={isLoading || !chatRef.current}
                        />
                        <button type="submit" className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 disabled:bg-slate-400" disabled={isLoading || !userInput.trim() || !chatRef.current}>
                           <PaperAirplaneIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default AIPlannerModal;