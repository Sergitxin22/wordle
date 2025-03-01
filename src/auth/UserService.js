// Servicio para manejar los datos de los usuarios y sus estadísticas
export const UserService = {
  // Obtener o crear perfil de usuario
  getUserProfile(userId) {
    const userKey = `wordle_user_${userId}`;
    const userData = localStorage.getItem(userKey);
    
    if (userData) {
      return JSON.parse(userData);
    }
    
    // Si no existe, crear un nuevo perfil
    const newProfile = {
      userId,
      completedDays: [],
      streak: 0,
      lastCompleted: null,
      streaksByLanguage: {} // Nuevo campo para rachas por idioma
    };
    
    this.saveUserProfile(userId, newProfile);
    return newProfile;
  },
  
  // Guardar perfil de usuario
  saveUserProfile(userId, profile) {
    const userKey = `wordle_user_${userId}`;
    localStorage.setItem(userKey, JSON.stringify(profile));
    return profile;
  },
  
  // Registrar un día completado
  registerCompletedDay(userId, date, language, attempts) {
    const profile = this.getUserProfile(userId);
    const dateStr = date.toISOString().split('T')[0]; // formato YYYY-MM-DD
    
    // Verificar si ya completó este día
    const existingIndex = profile.completedDays.findIndex(
      day => day.date === dateStr && day.language === language
    );
    
    if (existingIndex >= 0) {
      // Actualizar si ya existe
      profile.completedDays[existingIndex] = {
        ...profile.completedDays[existingIndex],
        attempts
      };
    } else {
      // Añadir nuevo día completado
      profile.completedDays.push({
        date: dateStr,
        language,
        attempts
      });
    }
    
    // Actualizar racha general
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateStr === today) {
      if (profile.lastCompleted === yesterday) {
        profile.streak += 1;
      } else if (profile.lastCompleted !== today) {
        profile.streak = 1;
      }
      profile.lastCompleted = today;
      
      // Inicializar o actualizar las rachas por idioma
      if (!profile.streaksByLanguage) {
        profile.streaksByLanguage = {};
      }
      
      if (!profile.streaksByLanguage[language]) {
        profile.streaksByLanguage[language] = {
          current: 0,
          lastCompleted: null
        };
      }
      
      // Actualizar racha por idioma
      if (profile.streaksByLanguage[language].lastCompleted === yesterday) {
        profile.streaksByLanguage[language].current += 1;
      } else if (profile.streaksByLanguage[language].lastCompleted !== today) {
        profile.streaksByLanguage[language].current = 1;
      }
      profile.streaksByLanguage[language].lastCompleted = today;
    }
    
    // Guardar cambios
    this.saveUserProfile(userId, profile);
    return profile;
  },
  
  // Verificar si el usuario ya ha completado el juego para el día actual en un idioma específico
  hasCompletedTodaysWord(userId, language) {
    const profile = this.getUserProfile(userId);
    if (!profile || !profile.completedDays || profile.completedDays.length === 0) {
      return false;
    }
    
    const today = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    
    return profile.completedDays.some(
      day => day.date === today && day.language === language
    );
  },
  
  // Obtener estadísticas del usuario
  getUserStats(userId) {
    const profile = this.getUserProfile(userId);
    const byLanguage = this.getStatsByLanguage(profile.completedDays);
    
    // Calcular correctamente las rachas por idioma
    if (profile.completedDays && profile.completedDays.length > 0) {
      // Ordenar los días completados por fecha (más reciente primero)
      const sortedDays = [...profile.completedDays].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      // Agrupar por idioma
      const daysByLanguage = {};
      
      sortedDays.forEach(day => {
        if (!daysByLanguage[day.language]) {
          daysByLanguage[day.language] = [];
        }
        daysByLanguage[day.language].push(day);
      });
      
      // Calcular racha para cada idioma
      Object.entries(daysByLanguage).forEach(([lang, days]) => {
        if (byLanguage[lang]) {
          // Ordenar los días por fecha (más reciente primero)
          days.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // Verificar si el día más reciente es hoy o ayer
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (days[0].date === today || days[0].date === yesterday) {
            // Comprobar la racha
            let currentStreak = 1;
            let currentDate = new Date(days[0].date);
            
            for (let i = 1; i < days.length; i++) {
              const prevDate = new Date(days[i].date);
              const dayDiff = Math.round((currentDate - prevDate) / (24 * 60 * 60 * 1000));
              
              if (dayDiff === 1) {
                // Día consecutivo
                currentStreak += 1;
                currentDate = prevDate;
              } else {
                // Racha interrumpida
                break;
              }
            }
            
            byLanguage[lang].streak = currentStreak;
          } else {
            // Si el último día no es hoy ni ayer, la racha es 0
            byLanguage[lang].streak = 0;
          }
        }
      });
    }
    
    return {
      totalCompleted: profile.completedDays.length,
      streak: profile.streak,
      byLanguage
    };
  },
  
  // Agrupar estadísticas por idioma
  getStatsByLanguage(completedDays) {
    return completedDays.reduce((stats, day) => {
      if (!stats[day.language]) {
        stats[day.language] = { 
          count: 0, 
          avgAttempts: 0,
          streak: 0 // Por defecto la racha es 0
        };
      }
      
      stats[day.language].count += 1;
      stats[day.language].avgAttempts = 
        (stats[day.language].avgAttempts * (stats[day.language].count - 1) + day.attempts) / 
        stats[day.language].count;
        
      return stats;
    }, {});
  }
};