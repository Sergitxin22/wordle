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
import { firebaseConfig } from './firebaseConfig';

// Verificar si las credenciales de Firebase están configuradas
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => 
  value && value !== 'tu-api-key' && !value.includes('tu-proyecto')
);

// Inicializar Firebase solo si está configurado correctamente
let app;
let auth;
let googleProvider;
let githubProvider;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
  }
}

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
  const [configError] = useState(!isFirebaseConfigured);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase no está configurado correctamente. Consulta las instrucciones de configuración.");
      return;
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  // Función para iniciar sesión con GitHub
  const signInWithGithub = async () => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase no está configurado correctamente. Consulta las instrucciones de configuración.");
      return;
    }
    
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    if (!isFirebaseConfigured) return;
    
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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