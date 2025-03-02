// Configuración de Firebase usando variables de entorno
// en lugar de credenciales hardcodeadas

// Función para obtener credenciales dinámicamente
export const getFirebaseConfiguration = async () => {
  try {
    // En entorno de desarrollo, imprimimos un mensaje útil en la consola
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("Ejecutando en modo de desarrollo local");
    }
    
    // Lista de dominios permitidos para esta aplicación
    const allowedDomains = [
      'wordle.sergiomorales.dev',
      'localhost',
      '127.0.0.1'
    ];
    
    // Verificar si estamos en un dominio permitido
    const isAllowedDomain = allowedDomains.some(domain => 
      window.location.hostname === domain || 
      window.location.hostname.endsWith('.' + domain)
    );
    
    if (!isAllowedDomain) {
      console.warn(`Dominio no autorizado: ${window.location.hostname}`);
      return generateEmptyConfig();
    }
    
    // Usamos las variables de entorno que se incluyen durante el build por GitHub Actions
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  } catch (error) {
    console.error('Error obteniendo configuración de Firebase:', error);
    return generateEmptyConfig();
  }
};

// Función auxiliar para generar una configuración vacía
function generateEmptyConfig() {
  return {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
}