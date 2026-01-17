import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { tramitesData, detectarTramite } from './tramites-data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post('/api/chat', async (req, res) => {
  console.log('Recibida petición POST a /api/chat');
  console.log('Cuerpo de la petición:', req.body);
  
  try {
    const { message } = req.body;

    if (!message) {
      console.log('Error: Mensaje vacío');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Enviando mensaje a Groq:', message);

    // Detectar el tipo de trámite
    const tipoTramite = detectarTramite(message);
    console.log('Trámite detectado:', tipoTramite);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un asistente virtual experto en trámites del IESS (Instituto Ecuatoriano de Seguridad Social). 

Tu objetivo es ayudar a los usuarios con información clara, precisa y amable sobre cómo realizar trámites, requisitos, y agendamiento de citas.

CRÍTICO - FORMATO DE RESPUESTA OBLIGATORIO:
Debes responder en DOS partes claramente separadas:

1. RESPUESTA NORMAL: Explica la información solicitada de forma clara y completa.

2. CHECKLIST: Extrae los puntos MÁS IMPORTANTES de tu respuesta y créalos como una checklist.

REGLAS PARA LA CHECKLIST:
- Si mencionas DOCUMENTOS necesarios → Ponlos en la checklist (ej: "Cédula de identidad", "Certificado de votación")
- Si mencionas REQUISITOS → Ponlos en la checklist (ej: "Tener 36 aportaciones", "No tener mora")
- Si mencionas PASOS → Ponlos en la checklist (ej: "Ingresar al portal", "Descargar PDF")
- Si mencionas DATOS importantes → Ponlos en la checklist (ej: "Edad mínima 60 años", "Costo: gratuito")

FORMATO EXACTO (OBLIGATORIO):
[CHECKLIST_START]
Título: [Nombre corto y descriptivo]
Items:
- [Item 1 - específico y accionable]
- [Item 2 - específico y accionable]
- [Item 3 - específico y accionable]
[CHECKLIST_END]

EJEMPLO:
Usuario: "¿Qué necesito para un préstamo quirografario?"
Tu respuesta:
"Para solicitar un préstamo quirografario en el IESS necesitas cumplir varios requisitos. Primero, debes tener al menos 36 aportaciones consecutivas. También necesitas tu cédula de identidad vigente y no tener préstamos en mora. El proceso se realiza en línea..."

[CHECKLIST_START]
Título: Requisitos para Préstamo Quirografario
Items:
- Cédula de identidad vigente
- Mínimo 36 aportaciones consecutivas
- No tener préstamos en mora
- Cuenta bancaria activa
- Acceso al portal web del IESS
[CHECKLIST_END]

La checklist debe tener entre 3 y 8 items. Responde SIEMPRE en español.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1200,
    });

    console.log('Respuesta recibida de Groq');
    const fullResponse = completion.choices[0]?.message?.content || "No pude generar una respuesta.";
    
    console.log('\n=== RESPUESTA COMPLETA DE LA IA ===');
    console.log(fullResponse);
    console.log('=================================\n');

    // Extraer la checklist de la respuesta
    let responseContent = fullResponse;
    let checklistData = null;

    const checklistMatch = fullResponse.match(/\[CHECKLIST_START\]([\s\S]*?)\[CHECKLIST_END\]/);
    
    console.log('¿Se encontró checklist?', checklistMatch ? 'SÍ' : 'NO');
    
    if (checklistMatch) {
      console.log('Contenido de la checklist encontrada:', checklistMatch[1]);
      
      // Remover la checklist de la respuesta visible
      responseContent = fullResponse.replace(/\[CHECKLIST_START\][\s\S]*?\[CHECKLIST_END\]/, '').trim();
      
      const checklistContent = checklistMatch[1];
      const titleMatch = checklistContent.match(/Título:\s*(.+)/i);
      // Regex flexible para capturar items: acepta -, *, o números como viñetas
      const itemsMatches = checklistContent.match(/^[\s\t]*[-*•\d\.]+\s+(.+)$/gm);
      
      console.log('Título encontrado:', titleMatch ? titleMatch[1] : 'NO');
      console.log('Items encontrados:', itemsMatches ? itemsMatches.length : 0);
      
      if (titleMatch && itemsMatches && itemsMatches.length > 0) {
        checklistData = {
          nombre: titleMatch[1].trim(),
          pasos: itemsMatches.map((item, index) => ({
            id: index + 1,
            // Limpia el item quitando cualquier tipo de viñeta al principio
            text: item.replace(/^[\s\t]*[-*•\d\.]+\s+/, '').trim(),
            completed: false
          }))
        };
        console.log('Checklist creada exitosamente:', checklistData.nombre);
      }
    }

    // Si no se generó checklist dinámica, usar la predefinida del trámite
    if (!checklistData) {
      console.log('Usando checklist predefinida del trámite:', tipoTramite);
      const tramiteInfo = tramitesData[tipoTramite];
      if (tramiteInfo) {
        checklistData = {
          nombre: tramiteInfo.nombre,
          pasos: tramiteInfo.pasos
        };
      }
    }

    console.log('Checklist final enviada:', checklistData ? checklistData.nombre : 'NULL');

    res.json({ 
      response: responseContent,
      checklist: checklistData
    });

  } catch (error) {
    console.error('Error llamando a Groq API:', error);
    if (error.error && error.error.code === 'invalid_api_key') {
         console.error('CRÍTICO: La API Key de Groq es inválida o no se encontró.');
    }
    res.status(500).json({ error: 'Error processing your request: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
