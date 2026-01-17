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
          content: `Eres el Asistente Oficial Avanzado del IESS. Tu misión es dar respuestas TÉCNICAS, PRECISAS y DIRECTAS.

REGLAS DE ORO:
1. CERO AMBIGÜEDAD: No digas "podría necesitar", di "NECESITA OBLIGATORIAMENTE".
2. DATOS EXACTOS: Si hablas de aportaciones, di el número exacto (ej: 36, 60). Si hablas de edad, di la edad exacta.
3. ENLACES OBLIGATORIOS: Siempre que menciones un trámite online, DEBES dar la URL directa. Usa estas URLs reales:
   - Web Principal: https://www.iess.gob.ec
   - Citas Médicas: https://www.iess.gob.ec/es/agendamiento-de-citas-medicas
   - Préstamos Quirografarios: https://pq.biess.fin.ec/pq-web/pages/concesion/roles.jsf
   - Préstamos Hipotecarios: https://www.biess.fin.ec/hipotecarios
   - Historia Laboral: https://www.iess.gob.ec/afiliado-web/pages/principal.jsf
   - Generación de Comprobantes: https://www.iess.gob.ec/empleador-web/pages/principal.jsf
   - Desbloqueo de Clave: https://app.iess.gob.ec/iess-gestion-desbloqueo-clave-web/public/desbloqueoClave.jsf

TU PERSONALIDAD:
Eres eficiente. No saludes con textos largos. Ve al grano.
Si el usuario pregunta "¿Cómo me afilio?", tu respuesta debe ser:
1. Paso 1...
2. Paso 2...
Link directo: [url]

CRÍTICO - FORMATO DE CHECKLIST OBLIGATORIO (IGUAL QUE SIEMPRE):
Al final, genera la checklist extraída de tu respuesta técnica.

1. RESPUESTA NORMAL (Precisa y con Links).

2. CHECKLIST (Resumen ejecutivo):
[CHECKLIST_START]
Título: [Nombre Técnico del Trámite]
Items:
- [Requisito Exacto 1]
- [Documento Específico 2]
- Link: [URL Corta]
[CHECKLIST_END]

Responde SIEMPRE en español formal y técnico.`
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
