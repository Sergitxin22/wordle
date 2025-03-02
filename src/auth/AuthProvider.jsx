import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { getFirebaseConfiguration } from './firebaseConfig';

// Variables para inicialización de Firebase
let app;
let auth;
let googleProvider;
let githubProvider;
let firebaseInitialized = false;

// Crear contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export function AuthProviderWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  // Inicializar Firebase de forma asíncrona
  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Obtener la configuración de Firebase dinámicamente
        const firebaseConfig = await getFirebaseConfiguration();
        
        // Verificar si las credenciales son válidas
        const isFirebaseConfigured = Object.values(firebaseConfig).every(value => 
          value && typeof value === 'string' && value.length > 0
        );

        if (!isFirebaseConfigured) {
          console.warn("Firebase no está configurado correctamente. Credenciales inválidas o vacías.");
          setConfigError(true);
          setLoading(false);
          return;
        }

        // Inicializar Firebase solo si no se ha inicializado antes
        if (!firebaseInitialized) {
          try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            googleProvider = new GoogleAuthProvider();
            githubProvider = new GithubAuthProvider();
            firebaseInitialized = true;

            // Escuchar cambios en el estado de autenticación
            onAuthStateChanged(auth, (currentUser) => {
              setUser(currentUser);
              setLoading(false);
            });
          } catch (initError) {
            console.error("Error al inicializar Firebase:", initError);
            setConfigError(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error al obtener la configuración de Firebase:", error);
        setConfigError(true);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    if (!firebaseInitialized) {
      console.warn("Firebase no está configurado correctamente.");
      return;
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      // Mostrar un mensaje de error al usuario
      alert("Error al iniciar sesión con Google. Por favor intenta de nuevo.");
    }
  };

  // Función para iniciar sesión con GitHub
  const signInWithGithub = async () => {
    if (!firebaseInitialized) {
      console.warn("Firebase no está configurado correctamente.");
      return;
    }
    
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
      // Mostrar un mensaje de error al usuario
      alert("Error al iniciar sesión con GitHub. Por favor intenta de nuevo.");
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    if (!firebaseInitialized) return;
    
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor intenta de nuevo.");
    }
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    configError,
    // Propiedades para compatibilidad con el código existente
    session: user ? { user: { 
      id: user?.uid,
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL
    }} : null,
    status: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}