/**
 * Google Apps Script para recibir datos del formulario de contacto
 * y guardarlos en Google Sheets con notificación por email
 */

// CONFIGURACIÓN
const SHEET_ID   = '1zgt-bNMQ86v1GDQQj-kZJffkCvsxzYOYXbwTipJ8KB8';
const SHEET_NAME = 'Sheet1';
const NOTIFICATION_EMAIL = 'aminael.iv@gmail.com';  // Email para notificaciones

function doGet() {
  // Solo para que la URL del Web App no falle al abrirse en el navegador
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  let data = {};
  if (e.postData && e.postData.contents) {
    try { data = JSON.parse(e.postData.contents); } catch(_) {}
  }
  if (!Object.keys(data).length && e.parameter) data = { ...e.parameter };

  // Guardar en la hoja
  sheet.appendRow([
    new Date(),
    data.nombre || '',
    data.email || '',
    data.telefono || '',
    data.mensaje || '',
    data.fuente || 'web',
    data.url || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.user_agent || ''
  ]);

  // Enviar notificación por email
  try {
    sendNotificationEmail(data);
  } catch (error) {
    Logger.log('Error al enviar email: ' + error.toString());
    // No lanzamos el error para que el formulario siga funcionando
  }

  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Envía un email de notificación cuando se recibe un nuevo contacto
 */
function sendNotificationEmail(data) {
  const timestamp = new Date();
  const subject = '🔔 Nuevo contacto desde 7Speaking';
  
  // Formatear fecha en español
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Guayaquil'
  };
  const fechaFormateada = timestamp.toLocaleDateString('es-ES', options);
  
  // Crear cuerpo del email en HTML
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #124E73 0%, #1a6b99 100%);
          color: white;
          padding: 30px 20px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .field {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #124E73;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .value {
          color: #2b4150;
          font-size: 15px;
          word-wrap: break-word;
        }
        .message-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #E63B3F;
          margin-top: 10px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 10px 10px;
        }
        .timestamp {
          color: #e0e0e0;
          font-size: 13px;
          margin-top: 5px;
        }
        .utm-info {
          background: #fff6f6;
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📬 Nuevo Contacto Recibido</h1>
        <div class="timestamp">${fechaFormateada}</div>
      </div>
      
      <div class="content">
        <div class="field">
          <div class="label">👤 Nombre</div>
          <div class="value">${data.nombre || 'No proporcionado'}</div>
        </div>
        
        <div class="field">
          <div class="label">📧 Email</div>
          <div class="value"><a href="mailto:${data.email}">${data.email || 'No proporcionado'}</a></div>
        </div>
        
        <div class="field">
          <div class="label">📱 Teléfono</div>
          <div class="value">${data.telefono || 'No proporcionado'}</div>
        </div>
        
        <div class="field">
          <div class="label">💬 Mensaje</div>
          <div class="message-box">${data.mensaje || 'No proporcionado'}</div>
        </div>
        
        <div class="field">
          <div class="label">🌐 Información de Origen</div>
          <div class="value">
            <strong>Fuente:</strong> ${data.fuente || 'web'}<br>
            <strong>URL:</strong> <a href="${data.url}">${data.url || 'No disponible'}</a>
          </div>
          ${data.utm_source || data.utm_medium || data.utm_campaign ? `
            <div class="utm-info">
              <strong>📊 Parámetros UTM:</strong><br>
              ${data.utm_source ? `Source: ${data.utm_source}<br>` : ''}
              ${data.utm_medium ? `Medium: ${data.utm_medium}<br>` : ''}
              ${data.utm_campaign ? `Campaign: ${data.utm_campaign}` : ''}
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="footer">
        <p>Este email fue generado automáticamente por el sistema de contacto de 7Speaking.</p>
        <p>Los datos también han sido guardados en tu Google Sheet.</p>
      </div>
    </body>
    </html>
  `;
  
  // Crear versión de texto plano como fallback
  const plainBody = `
Nuevo contacto recibido - ${fechaFormateada}

Nombre: ${data.nombre || 'No proporcionado'}
Email: ${data.email || 'No proporcionado'}
Teléfono: ${data.telefono || 'No proporcionado'}

Mensaje:
${data.mensaje || 'No proporcionado'}

---
Fuente: ${data.fuente || 'web'}
URL: ${data.url || 'No disponible'}
${data.utm_source ? 'UTM Source: ' + data.utm_source : ''}
${data.utm_medium ? 'UTM Medium: ' + data.utm_medium : ''}
${data.utm_campaign ? 'UTM Campaign: ' + data.utm_campaign : ''}
  `;
  
  // Enviar el email
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: '7Speaking Notifications'
  });
  
  Logger.log('Email de notificación enviado a: ' + NOTIFICATION_EMAIL);
}

/**
 * Función de prueba para verificar que el email funciona
 * Ejecuta esta función desde el editor de Apps Script para probar
 */
function testNotificationEmail() {
  const testData = {
    nombre: 'Usuario de Prueba',
    email: 'test@example.com',
    telefono: '+593999999999',
    mensaje: 'Este es un mensaje de prueba del sistema de notificaciones.',
    fuente: 'web',
    url: 'https://7speaking.com/test',
    utm_source: 'test',
    utm_medium: 'email',
    utm_campaign: 'test_campaign'
  };
  
  sendNotificationEmail(testData);
  Logger.log('Email de prueba enviado a ' + NOTIFICATION_EMAIL);
}
