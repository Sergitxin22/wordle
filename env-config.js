// This file will be loaded before the application and will provide environment variables
// En producción, las variables se cargarán desde un endpoint seguro
window.__ENV__ = window.__ENV__ || {};

// Función para cargar las variables de entorno desde el servidor
async function loadEnvVars() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // En desarrollo local, usar valores por defecto o de desarrollo
    return;
  }
  
  try {
    // En producción, cargar las variables de un archivo generado en tiempo de construcción
    // Este archivo no será comprometido en Git
    const response = await fetch('/env-vars.json');
    if (response.ok) {
      const envVars = await response.json();
      window.__ENV__ = { ...window.__ENV__, ...envVars };
      console.log('Variables de entorno cargadas correctamente');
    } else {
      console.error('Error al cargar las variables de entorno');
    }
  } catch (error) {
    console.error('Error al cargar las variables de entorno:', error);
  }
}

// Cargar las variables de entorno
loadEnvVars();