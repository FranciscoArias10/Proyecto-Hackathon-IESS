import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInterface = ({ onChecklistUpdate }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [status, setStatus] = useState("Toque para hablar con el Asistente IESS");
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Inicializar Web Speech API (Speech Recognition)
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'es-ES'; // Español

            recognitionRef.current.onstart = () => {
                setStatus("Escuchando...");
                setError("");
            };

            recognitionRef.current.onresult = async (event) => {
                const speechResult = event.results[0][0].transcript;
                setTranscript(speechResult);
                setStatus("Procesando...");

                // Enviar a la IA
                await sendToAI(speechResult);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Error de reconocimiento:', event.error);
                setError(`Error: ${event.error}`);
                setStatus("Error al escuchar. Intente nuevamente.");
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setError("Su navegador no soporta reconocimiento de voz");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            // Detener cualquier síntesis de voz al desmontar
            synthRef.current.cancel();
        };
    }, []);

    // Función para enviar el texto a la IA
    const sendToAI = async (text) => {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log('📦 [VoiceInterface] Respuesta recibida del servidor:', data);

            const aiResponse = data.response;

            setResponse(aiResponse);
            setStatus("IA Respondiendo...");

            // Actualizar la checklist si el backend envió información
            if (data.checklist) {
                console.log('✅ [VoiceInterface] Checklist encontrada:', data.checklist);
                if (onChecklistUpdate) {
                    console.log('🔄 [VoiceInterface] Llamando a updateChecklist');
                    onChecklistUpdate(data.checklist);
                } else {
                    console.error('❌ [VoiceInterface] onChecklistUpdate no está definida');
                }
            } else {
                console.warn('⚠️ [VoiceInterface] No se recibió checklist en la respuesta');
            }

            // Hablar la respuesta
            speakResponse(aiResponse);

        } catch (error) {
            console.error('Error:', error);
            setError("Error al conectar con la IA");
            setStatus("Error. Intente nuevamente.");
            setIsListening(false);
        }
    };

    // Función para convertir texto a voz (Text-to-Speech)
    const speakResponse = (text) => {
        // Cancelar cualquier síntesis anterior
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0; // Velocidad normal
        utterance.pitch = 1.0; // Tono normal
        utterance.volume = 1.0; // Volumen máximo

        utterance.onstart = () => {
            setIsSpeaking(true);
            setStatus("IA Hablando...");
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setStatus("Toque para hablar con el Asistente IESS");
        };

        utterance.onerror = (event) => {
            console.error('Error en síntesis de voz:', event);
            setIsSpeaking(false);
            setStatus("Error al reproducir respuesta");
        };

        synthRef.current.speak(utterance);
    };

    // Toggle listening
    const toggleListening = () => {
        if (isListening) {
            // Detener escucha
            recognitionRef.current?.stop();
            setIsListening(false);
            setStatus("Toque para hablar con el Asistente IESS");
        } else {
            // Detener cualquier voz reproduciéndose
            synthRef.current.cancel();
            setIsSpeaking(false);

            // Iniciar escucha
            try {
                recognitionRef.current?.start();
                setIsListening(true);
                setTranscript("");
                setResponse("");
                setError("");
            } catch (error) {
                console.error('Error al iniciar reconocimiento:', error);
                setError("Error al iniciar micrófono");
            }
        }
    };

    // Función para detener la voz
    const stopSpeaking = () => {
        synthRef.current.cancel();
        setIsSpeaking(false);
        setStatus("Toque para hablar con el Asistente IESS");
    };

    // Manejar sugerencias de prompts
    const handlePromptClick = async (prompt) => {
        setTranscript(prompt);
        setStatus("Procesando...");
        await sendToAI(prompt);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
            <div className="relative group">
                {/* Animated Background Pulse */}
                <motion.div
                    animate={{
                        scale: isListening || isSpeaking ? [1, 1.2, 1] : 1,
                        opacity: isListening || isSpeaking ? 0.5 : 0.1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`absolute inset-0 rounded-full blur-xl ${isSpeaking ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                />

                {/* Main Mic Button */}
                <button
                    onClick={toggleListening}
                    disabled={isSpeaking}
                    className={`relative z-10 p-8 rounded-full border-4 transition-all duration-300 shadow-2xl ${isListening
                        ? 'bg-red-500 border-red-400 text-white shadow-red-500/50'
                        : isSpeaking
                            ? 'bg-green-500 border-green-400 text-white shadow-green-500/50'
                            : 'bg-white border-blue-100 text-blue-600 hover:scale-105 shadow-blue-500/30'
                        } ${isSpeaking ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                >
                    {isListening ? (
                        <Activity size={64} className="animate-pulse" />
                    ) : isSpeaking ? (
                        <Volume2 size={64} className="animate-pulse" />
                    ) : (
                        <Mic size={64} />
                    )}
                </button>

                {/* Stop Speaking Button */}
                {isSpeaking && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={stopSpeaking}
                        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                        title="Detener respuesta"
                    >
                        <VolumeX size={24} />
                    </motion.button>
                )}
            </div>

            <div className="text-center space-y-2 max-w-md">
                <h2 className={`text-3xl font-bold transition-colors duration-300 ${isListening ? 'text-red-400' :
                    isSpeaking ? 'text-green-400' :
                        'text-blue-200'
                    }`}>
                    {status}
                </h2>
                <p className="text-slate-400">
                    Pregunte sobre trámites, citas médicas, o afiliación.
                </p>

                {/* Mostrar error si existe */}
                {error && (
                    <p className="text-red-400 text-sm mt-2">
                        {error}
                    </p>
                )}
            </div>

            {/* Transcripción y Respuesta */}
            <AnimatePresence>
                {(transcript || response) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full max-w-2xl space-y-4"
                    >
                        {transcript && (
                            <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-4">
                                <p className="text-xs text-blue-400 mb-1 font-semibold">Tu pregunta:</p>
                                <p className="text-white">{transcript}</p>
                            </div>
                        )}

                        {response && (
                            <div className="bg-green-900/30 border border-green-700/50 rounded-2xl p-4">
                                <p className="text-xs text-green-400 mb-1 font-semibold">Respuesta:</p>
                                <p className="text-white">{response}</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Suggested Prompts */}
            {!isListening && !isSpeaking && (
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {["¿Cómo desbloqueo mi clave?", "Agendar cita médica", "Generar comprobante de pago"].map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handlePromptClick(prompt)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-700 transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VoiceInterface;
