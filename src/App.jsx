import React, { useState } from 'react';
import VoiceInterface from './components/VoiceInterface';
import ChatWidget from './components/ChatWidget';
import Checklist from './components/Checklist';
import MapWidget from './components/MapWidget';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const [checklistData, setChecklistData] = useState({
    nombre: "Proceso General de Trámites IESS",
    pasos: [
      { id: 1, text: "Ingresar al portal web del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Seleccionar 'Trámites Virtuales'", completed: false },
      { id: 3, text: "Escoger la categoría según tu perfil", completed: false },
      { id: 4, text: "Ingresar número de cédula y clave", completed: false },
      { id: 5, text: "Seleccionar la opción deseada en el menú lateral", completed: false },
    ]
  });

  const updateChecklist = (newChecklist) => {
    if (newChecklist) {
      setChecklistData(newChecklist);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 overflow-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 container mx-auto p-4 md:p-8 h-screen flex flex-col md:flex-row gap-6">

        {/* Left Column: Voice Interface (Main) */}
        <div className="flex-1 flex flex-col min-h-[50vh]">
          <header className="mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/50">
              I
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">IESS Asistente</h1>
          </header>

          <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <VoiceInterface />
          </div>
        </div>

        {/* Right Column: Information & Tools */}
        <div className="md:w-[400px] flex flex-col gap-6">

          {/* Top Panel: Checklist */}
          <div className="flex-1 min-h-[300px]">
            <Checklist checklistData={checklistData} />
          </div>

          {/* Bottom Panel: Map */}
          <div className="h-[250px] md:h-[300px]">
            <MapWidget />
          </div>
        </div>

      </div>

      {/* Floating Chat Widget */}
      <ChatWidget onChecklistUpdate={updateChecklist} />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
