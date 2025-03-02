// Configuración de Firebase simplificada para GitHub Pages

// Función para obtener credenciales dinámicamente
export const getFirebaseConfiguration = async () => {
  try {
    // En entorno de desarrollo, imprimimos un mensaje útil en la consola
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("Ejecutando en modo de desarrollo local");
    }
    
    // Lista de dominios permitidos para esta aplicación
    const allowedDomains = [
      'sergio890.github.io',
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
    
    // Usamos las credenciales directamente para simplificar y evitar problemas
    return {
      apiKey: "AIzaSyDGHOq1Ikgq57_w7h9S9iZP4AiOyRWKrPQ",
      authDomain: "wordle-63088.firebaseapp.com",
      projectId: "wordle-63088",
      storageBucket: "wordle-63088.firebasestorage.app",
      messagingSenderId: "908345573894",
      appId: "1:908345573894:web:671a9e75f83d7c22b9f987"
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
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
}