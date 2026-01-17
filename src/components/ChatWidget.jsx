import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = ({ onChecklistUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! Soy tu asistente virtual del IESS. ¿En qué puedo ayudarte hoy?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now(),
                text: data.response,
                sender: 'bot'
            }]);

            // Actualizar la checklist si el backend envió información
            if (data.checklist && onChecklistUpdate) {
                onChecklistUpdate(data.checklist);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed top-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center"
                >
                    {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed top-20 right-6 w-80 md:w-96 h-[500px] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden"
                    >
                        <div className="p-4 bg-slate-900 border-b border-slate-700">
                            <h3 className="text-lg font-semibold text-white">Chat de Soporte</h3>
                            <p className="text-xs text-slate-400">En línea</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-slate-700 text-slate-200 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe tu consulta..."
                                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
