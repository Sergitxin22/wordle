// This file will be loaded before the application and will provide environment variables
window.__ENV__ = window.__ENV__ || {};

// Función para cargar las variables de entorno desde el servidor
async function loadEnvVars() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // En desarrollo local, usar valores por defecto o de desarrollo
    return;
  }
  
  // La función loadEnvVars ahora inicializa las variables directamente desde valores seguros
  // Estos valores son proporcionados por el backend o, en este caso, a través de un mecanismo más seguro
  window.__ENV__ = {
    // En lugar de cargar desde un archivo JSON, incrustamos una URL de API
    // que requiere autenticación para proporcionar las credenciales
    ENV_SERVICE_URL: 'https://api.sergiomorales.dev/wordle-env',
    ENV_VERSION: '1.0.0'
  };
}

// Función para cargar credenciales de forma segura (se llamará desde la inicialización de Firebase)
window.getFirebaseConfig = async function() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // En desarrollo, devolver un objeto vacío o credenciales de desarrollo
    return {};
  }
  
  // Esta función será llamada cuando realmente necesitemos las credenciales
  // Podría implementar una estrategia como:
  // 1. Llamar a una API que requiera autenticación
  // 2. Usar un token de tiempo limitado
  // 3. Implementar cifrado en el cliente
  
  try {
    // Simular una solicitud a un servicio seguro
    console.log('Obteniendo configuración segura de Firebase...');
    
    // Al usar la URL, hacer una petición autenticada 
    // En una implementación real, este endpoint estaría protegido
    // y requeriría autenticación/autorización
    
    // Por ahora, retornamos un objeto vacío - deberás implementar
    // la lógica real según tu infraestructura
    return {};
  } catch (error) {
    console.error('Error al obtener configuración de Firebase:', error);
    return {};
  }
}

// Cargar las variables de entorno básicas
loadEnvVars();