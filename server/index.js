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

IMPORTANTE: Al final de cada respuesta, debes incluir una checklist contextual según lo que el usuario pregunta:
- Si pregunta sobre REQUISITOS o DOCUMENTOS: Lista los documentos/requisitos necesarios
- Si pregunta sobre PASOS o PROCESO: Lista los pasos del procedimiento
- Si pregunta sobre INFORMACIÓN GENERAL: Lista puntos clave a recordar

Formato de la checklist (SIEMPRE al final de tu respuesta):
[CHECKLIST_START]
Título: [Nombre descriptivo de la checklist]
Items:
- [Item 1]
- [Item 2]
- [Item 3]
[CHECKLIST_END]

La checklist debe tener entre 3 y 8 items relevantes y específicos a la pregunta. Responde siempre en español.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    console.log('Respuesta recibida de Groq');
    const fullResponse = completion.choices[0]?.message?.content || "No pude generar una respuesta.";

    // Extraer la checklist de la respuesta
    let responseContent = fullResponse;
    let checklistData = null;

    const checklistMatch = fullResponse.match(/\[CHECKLIST_START\]([\s\S]*?)\[CHECKLIST_END\]/);
    
    if (checklistMatch) {
      // Remover la checklist de la respuesta visible
      responseContent = fullResponse.replace(/\[CHECKLIST_START\][\s\S]*?\[CHECKLIST_END\]/, '').trim();
      
      const checklistContent = checklistMatch[1];
      const titleMatch = checklistContent.match(/Título:\s*(.+)/);
      const itemsMatches = checklistContent.match(/^-\s*(.+)$/gm);
      
      if (titleMatch && itemsMatches) {
        checklistData = {
          nombre: titleMatch[1].trim(),
          pasos: itemsMatches.map((item, index) => ({
            id: index + 1,
            text: item.replace(/^-\s*/, '').trim(),
            completed: false
          }))
        };
      }
    }

    // Si no se generó checklist dinámica, usar la predefinida del trámite
    if (!checklistData) {
      const tramiteInfo = tramitesData[tipoTramite];
      if (tramiteInfo) {
        checklistData = {
          nombre: tramiteInfo.nombre,
          pasos: tramiteInfo.pasos
        };
      }
    }

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
