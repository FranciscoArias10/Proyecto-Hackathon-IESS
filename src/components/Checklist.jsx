import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const Checklist = () => {
    const [steps, setSteps] = useState([
        { id: 1, text: "Ingresar al portal web del IESS (www.iess.gob.ec)", completed: true },
        { id: 2, text: "Seleccionar 'Trámites Virtuales'", completed: false },
        { id: 3, text: "Escoger 'Asegurados' > 'Afiliados'", completed: false },
        { id: 4, text: "Ingresar número de cédula y clave", completed: false },
        { id: 5, text: "Seleccionar la opción deseada en el menú lateral", completed: false },
    ]);

    const toggleStep = (id) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, completed: !step.completed } : step
        ));
    };

    const progress = Math.round((steps.filter(s => s.completed).length / steps.length) * 100);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-white">Guía de Trámites</h3>
                <span className="text-blue-400 font-mono text-lg">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-3">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${step.completed ? 'bg-blue-900/20 opacity-60' : 'bg-slate-700/50 hover:bg-slate-700'
                            }`}
                    >
                        <div className={`mt-1 ${step.completed ? 'text-green-400' : 'text-slate-400'}`}>
                            {step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </div>
                        <span className={`text-sm ${step.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Checklist;
