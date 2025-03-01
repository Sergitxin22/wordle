import React from 'react';
import { useAuth } from '../auth/AuthProvider';

export function LoginButton() {
  const { signInWithGoogle, signInWithGithub, status, configError } = useAuth();
  const isLoading = status === 'loading';

  if (configError) {
    return (
      <button 
        onClick={() => alert("Firebase no está configurado. Revisa la consola para ver las instrucciones.")}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
      >
        Configurar
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={signInWithGithub} 
        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-1 px-3 rounded text-sm"
        disabled={isLoading}
      >
        GitHub
      </button>
      <button 
        onClick={signInWithGoogle} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        disabled={isLoading}
      >
        Google
      </button>
    </div>
  );
}

export function LogoutButton() {
  const { signOut, status } = useAuth();
  const isLoading = status === 'loading';

  return (
    <button 
      onClick={signOut} 
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm whitespace-nowrap"
      disabled={isLoading}
    >
      Cerrar sesión
    </button>
  );
}

export function UserProfile() {
  const { session, status } = useAuth();
  
  if (status === 'loading') {
    return <div className="text-sm">Cargando...</div>;
  }
  
  if (status === 'unauthenticated' || !session) {
    return <div className="text-sm">No has iniciado sesión</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      {session.user?.image && (
        <img 
          src={session.user.image} 
          alt="Perfil" 
          className="h-6 w-6 rounded-full flex-shrink-0"
        />
      )}
      <span className="text-sm truncate max-w-[80px] sm:max-w-[120px]">
        {session.user?.name || 'Usuario'}
      </span>
    </div>
  );
}