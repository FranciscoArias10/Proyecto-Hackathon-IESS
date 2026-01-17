export const tramitesData = {
  "historia_laboral": {
    nombre: "Consulta de Historia Laboral",
    pasos: [
      { id: 1, text: "Ingresar al portal web del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Seleccionar 'Servicios en Línea'", completed: false },
      { id: 3, text: "Hacer clic en 'Historia Laboral'", completed: false },
      { id: 4, text: "Ingresar número de cédula", completed: false },
      { id: 5, text: "Verificar y descargar tu historia laboral en PDF", completed: false }
    ]
  },
  "cita_medica": {
    nombre: "Agendar Cita Médica",
    pasos: [
      { id: 1, text: "Ingresar al portal web del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Ir a 'Afiliados' > 'Agendamiento de Citas'", completed: false },
      { id: 3, text: "Iniciar sesión con tu cédula y contraseña", completed: false },
      { id: 4, text: "Seleccionar especialidad y centro médico", completed: false },
      { id: 5, text: "Elegir fecha y hora disponible", completed: false },
      { id: 6, text: "Confirmar la cita y guardar el comprobante", completed: false }
    ]
  },
  "certificado_afiliacion": {
    nombre: "Obtener Certificado de Afiliación",
    pasos: [
      { id: 1, text: "Ingresar al portal del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Seleccionar 'Servicios en Línea'", completed: false },
      { id: 3, text: "Hacer clic en 'Certificado de Afiliación'", completed: false },
      { id: 4, text: "Ingresar número de cédula y fecha de emisión", completed: false },
      { id: 5, text: "Descargar el certificado en formato PDF", completed: false }
    ]
  },
  "prestamo_quirografario": {
    nombre: "Solicitud de Préstamo Quirografario",
    pasos: [
      { id: 1, text: "Ingresar al portal del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Ir a 'Afiliados' > 'Préstamos'", completed: false },
      { id: 3, text: "Iniciar sesión con cédula y contraseña", completed: false },
      { id: 4, text: "Verificar que cumples con los requisitos (36 aportaciones)", completed: false },
      { id: 5, text: "Seleccionar 'Préstamo Quirografario'", completed: false },
      { id: 6, text: "Ingresar el monto solicitado y plazo", completed: false },
      { id: 7, text: "Revisar y aceptar los términos y condiciones", completed: false },
      { id: 8, text: "Enviar la solicitud y guardar el comprobante", completed: false }
    ]
  },
  "jubilacion": {
    nombre: "Solicitud de Jubilación",
    pasos: [
      { id: 1, text: "Verificar requisitos: edad (60 años) y aportaciones (480 imposiciones)", completed: false },
      { id: 2, text: "Ingresar al portal del IESS (www.iess.gob.ec)", completed: false },
      { id: 3, text: "Ir a 'Pensionistas' > 'Solicitud de Jubilación'", completed: false },
      { id: 4, text: "Iniciar sesión y completar el formulario", completed: false },
      { id: 5, text: "Adjuntar documentos requeridos (cédula, certificados)", completed: false },
      { id: 6, text: "Enviar la solicitud", completed: false },
      { id: 7, text: "Esperar notificación de aprobación (15-30 días)", completed: false }
    ]
  },
  "planillas_aportes": {
    nombre: "Consulta de Planillas de Aportes",
    pasos: [
      { id: 1, text: "Ingresar al portal del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Ir a 'Empleadores' > 'Servicios en Línea'", completed: false },
      { id: 3, text: "Iniciar sesión con RUC y contraseña", completed: false },
      { id: 4, text: "Seleccionar 'Planillas'", completed: false },
      { id: 5, text: "Elegir el mes y año a consultar", completed: false },
      { id: 6, text: "Descargar o imprimir la planilla", completed: false }
    ]
  },
  "defuncion": {
    nombre: "Trámite de Auxilio de Funerales",
    pasos: [
      { id: 1, text: "Reunir documentos: acta de defunción, cédula del fallecido", completed: false },
      { id: 2, text: "Acudir a la oficina del IESS más cercana", completed: false },
      { id: 3, text: "Presentar documentación en ventanilla de Fondos de Terceros", completed: false },
      { id: 4, text: "Llenar formulario de solicitud de auxilio", completed: false },
      { id: 5, text: "Adjuntar factura de gastos funerarios", completed: false },
      { id: 6, text: "Esperar 5-10 días para aprobación y desembolso", completed: false }
    ]
  },
  "atencion_general": {
    nombre: "Proceso General de Trámites IESS",
    pasos: [
      { id: 1, text: "Ingresar al portal web del IESS (www.iess.gob.ec)", completed: false },
      { id: 2, text: "Seleccionar 'Trámites Virtuales'", completed: false },
      { id: 3, text: "Escoger la categoría según tu perfil: Asegurados/Empleadores/Pensionistas", completed: false },
      { id: 4, text: "Ingresar número de cédula y clave", completed: false },
      { id: 5, text: "Seleccionar la opción deseada en el menú lateral", completed: false }
    ]
  }
};

// Función para detectar el tipo de trámite basado en palabras clave
export function detectarTramite(mensaje) {
  const mensajeLower = mensaje.toLowerCase();
  
  // Palabras clave para cada trámite
  const keywords = {
    historia_laboral: ['historia laboral', 'historial laboral', 'historial de trabajo', 'aportes realizados', 'mis aportes'],
    cita_medica: ['cita médica', 'cita doctor', 'agendar cita', 'turno médico', 'consulta médica', 'doctor'],
    certificado_afiliacion: ['certificado de afiliación', 'certificado afiliación', 'comprobante afiliación', 'certificado'],
    prestamo_quirografario: ['préstamo quirografario', 'prestamo', 'préstamo', 'crédito', 'dinero', 'quirografario'],
    jubilacion: ['jubilación', 'jubilacion', 'pensión', 'pension', 'retiro', 'jubilarme'],
    planillas_aportes: ['planilla', 'planillas', 'pago aportes', 'aportes empleador'],
    defuncion: ['defunción', 'defuncion', 'auxilio funerales', 'funeral', 'fallecimiento', 'muerte']
  };
  
  // Buscar coincidencias
  for (const [tramite, palabras] of Object.entries(keywords)) {
    for (const palabra of palabras) {
      if (mensajeLower.includes(palabra)) {
        return tramite;
      }
    }
  }
  
  // Si no se detecta un trámite específico, retornar el general
  return 'atencion_general';
}
