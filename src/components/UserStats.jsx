import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { UserService } from '../auth/UserService';

export function UserStats() {
  const { session, status } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Verificamos que el usuario esté autenticado y que tenga un ID
    if (status === 'authenticated' && session?.user?.id) {
      const userStats = UserService.getUserStats(session.user.id);
      setStats(userStats);
    } else {
      setStats(null);
    }
  }, [status, session]);

  if (status !== 'authenticated' || !stats) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-full overflow-hidden">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Tus estadísticas</h3>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="text-xl sm:text-2xl font-bold">{stats.totalCompleted}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Partidas</div>
        </div>
        <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="text-xl sm:text-2xl font-bold">{stats.streak}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Racha actual</div>
        </div>
      </div>
      
      <h4 className="font-semibold mb-2 text-sm sm:text-base">Por idioma:</h4>
      <div className="space-y-2">
        {Object.entries(stats.byLanguage).map(([lang, data]) => (
          <div key={lang} className="flex flex-col p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm sm:text-base">
                {lang === 'es' ? 'Español' : 
                 lang === 'en' ? 'English' : 
                 lang === 'eu' ? 'Euskara' : lang}
              </span>
              <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                Racha: <span className="font-bold">{data.streak}</span> días
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold">{data.count}</span> partidas
              <span className="ml-1 text-gray-600 dark:text-gray-400">
                (media: {data.avgAttempts.toFixed(1)} intentos)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}