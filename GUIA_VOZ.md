# 🎤 Guía de Uso - Interfaz de Voz IESS Asistente

## ✨ Características Implementadas

Tu aplicación ahora tiene una interfaz de voz completa similar a ChatGPT con:

### 1. **🎤 Reconocimiento de Voz (Speech-to-Text)**
- Captura tu voz y la convierte a texto automáticamente
- Usa la Web Speech API del navegador
- Configurado para español (es-ES)

### 2. **🤖 Procesamiento con IA (Groq)**
- Envía tu pregunta al modelo Llama 3.3 70B
- Obtiene respuestas inteligentes sobre trámites del IESS
- Procesamiento rápido y eficiente

### 3. **🔊 Síntesis de Voz (Text-to-Speech)**
- La IA te responde con voz
- Pronunciación en español
- Control de volumen y velocidad

---

## 📖 Cómo Usar

### **Método 1: Hablar Directamente**

1. **Haz clic** en el botón grande del micrófono (centro de la pantalla)
2. **Habla** tu pregunta cuando veas "Escuchando..."
3. **Espera** a que la IA procese tu pregunta
4. **Escucha** la respuesta en voz alta

**Ejemplo:**
- Click → "¿Cómo puedo agendar una cita médica en el IESS?" → Espera → ¡La IA responde!

### **Método 2: Usar Sugerencias Rápidas**

1. **Haz clic** en uno de los botones de sugerencia:
   - "¿Cómo desbloqueo mi clave?"
   - "Agendar cita médica"
   - "Generar comprobante de pago"
2. **Espera** la respuesta de la IA
3. **Escucha** la respuesta en voz alta

---

## 🎨 Indicadores Visuales

| Color del Botón | Estado | Significado |
|----------------|---------|-------------|
| 🔵 **Azul** (blanco) | Inactivo | Listo para escuchar |
| 🔴 **Rojo** | Escuchando | Grabando tu voz |
| 🟢 **Verde** | Hablando | IA respondiendo |

### **Texto de Estado:**
- "Toque para hablar..." → Listo
- "Escuchando..." → Grabando tu voz
- "Procesando..." → Enviando a la IA
- "IA Hablando..." → Reproduciendo respuesta

---

## 🛠️ Controles Adicionales

### **Detener la Respuesta de Voz**
Si quieres que la IA deje de hablar:
- Haz clic en el botón **rojo con ícono de volumen tachado** que aparece debajo del botón principal

### **Cancelar Grabación**
Si quieres cancelar mientras estás hablando:
- Haz clic de nuevo en el botón del micrófono

---

## 🌐 Requisitos del Navegador

### **Navegadores Compatibles:**
✅ Google Chrome (Recomendado)
✅ Microsoft Edge
✅ Safari (macOS/iOS)
⚠️ Firefox (Soporte limitado para TTS)

### **Permisos Necesarios:**
- **Micrófono**: El navegador pedirá permiso la primera vez
- **Auto-reproducción**: Para escuchar las respuestas

---

## 💡 Consejos de Uso

### **Para Mejores Resultados:**

1. **Habla Claro**: Pronuncia claramente y a velocidad normal
2. **Ambiente Silencioso**: Reduce ruido de fondo
3. **Preguntas Específicas**: 
   - ✅ "¿Cómo agendo una cita en el IESS?"
   - ❌ "IESS"
4. **Espera a que termine**: Deja que la IA termine de hablar antes de hacer otra pregunta

### **Ejemplos de Preguntas:**
- "¿Qué documentos necesito para afiliarme al IESS?"
- "¿Cómo puedo desbloquear mi clave del IESS?"
- "¿Dónde está la oficina del IESS más cercana?"
- "¿Cómo genero un comprobante de pago?"
- "¿Qué pasos debo seguir para agendar una cita médica?"

---

## 🔧 Solución de Problemas

### **El micrófono no funciona:**
1. Verifica que tu navegador tiene permiso para usar el micrófono
2. Revisa la configuración de privacidad del navegador
3. Prueba con otro navegador (Chrome recomendado)

### **La IA no responde:**
1. Verifica que el servidor backend esté corriendo (`npm run server`)
2. Revisa que la API key de Groq esté en el archivo `.env`
3. Mira la consola del navegador (F12) para ver errores

### **No escucho la respuesta:**
1. Verifica el volumen de tu sistema
2. Revisa que el navegador tenga permiso para reproducir audio
3. Haz clic en "Detener" y vuelve a preguntar

---

## 🚀 Comandos para Ejecutar

### **Iniciar el Backend:**
```bash
npm run server
```

### **Iniciar el Frontend:**
```bash
npm run dev
```

### **Abrir en el navegador:**
```
http://localhost:5173
```

---

## 📱 Características Adicionales

Tu aplicación también incluye:

- **💬 Chat Widget**: Chat de texto en la esquina superior derecha
- **✅ Checklist**: Guía de pasos para trámites
- **🗺️ Mapa**: Ubicación de oficinas del IESS
- **📞 WhatsApp**: Botón de contacto directo

---

## 🎯 Próximos Pasos Sugeridos

1. **Prueba la interfaz de voz** haciendo varias preguntas
2. **Ajusta la velocidad de la voz** si es muy rápida/lenta
3. **Personaliza las sugerencias** de preguntas frecuentes
4. **Agrega más idiomas** si lo necesitas

---

¡Disfruta tu asistente de voz del IESS! 🎉
