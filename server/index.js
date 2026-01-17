import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un asistente virtual experto en trámites del IESS (Instituto Ecuatoriano de Seguridad Social). Tu objetivo es ayudar a los usuarios con información clara, precisa y amable sobre cómo realizar trámites, requisitos, y agendamiento de citas. Responde siempre en español."
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
    const responseContent = completion.choices[0]?.message?.content || "No pude generar una respuesta.";

    res.json({ response: responseContent });

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
