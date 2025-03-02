import { getDatabase, ref, get, set, onValue } from 'firebase/database';

// Servicio para manejar los datos de los usuarios y sus estadísticas
export const UserService = {
  // Referencia a la base de datos
  getDbRef(userId, path = '') {
    const db = getDatabase();
    return ref(db, `users/${userId}${path}`);
  },

  // Obtener o crear perfil de usuario
  async getUserProfile(userId) {
    if (!userId) return null;
    
    try {
      const snapshot = await get(this.getDbRef(userId));
      let profile = snapshot.exists() ? snapshot.val() : null;
      
      // Si existe el perfil pero le faltan campos, los inicializamos
      if (profile) {
        const defaultFields = {
          userId,
          completedDays: {},
          streak: profile.streak || 0,
          lastCompleted: profile.lastCompleted || null,
          streaksByLanguage: profile.streaksByLanguage || {}
        };
        
        // Actualizar solo los campos que faltan
        profile = {
          ...defaultFields,
          ...profile,
          completedDays: profile.completedDays || {}
        };
        
        // Guardar el perfil actualizado
        await this.saveUserProfile(userId, profile);
      } else {
        // Si no existe, crear un nuevo perfil
        profile = {
          userId,
          completedDays: {},
          streak: 0,
          lastCompleted: null,
          streaksByLanguage: {}
        };
        await this.saveUserProfile(userId, profile);
      }
      
      return profile;
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      return null;
    }
  },
  
  // Guardar perfil de usuario
  async saveUserProfile(userId, profile) {
    if (!userId) return null;
    
    try {
      await set(this.getDbRef(userId), profile);
      return profile;
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      return null;
    }
  },
  
  // Registrar un día completado
  async registerCompletedDay(userId, date, language, attempts) {
    if (!userId) return null;
    
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return null;

      // Usar la fecha local del usuario
      const dateStr = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0');
      
      // Asegurarse de que completedDays es un objeto
      if (!profile.completedDays) {
        profile.completedDays = {};
      }
      
      // Registrar el día completado usando una clave única
      const dayKey = `${dateStr}_${language}`;
      profile.completedDays[dayKey] = {
        date: dateStr,
        language,
        attempts
      };
      
      // Actualizar racha general usando fechas locales
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
        
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.getFullYear() + '-' + 
        String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
        String(yesterday.getDate()).padStart(2, '0');
      
      if (dateStr === todayStr) {
        if (profile.lastCompleted === yesterdayStr) {
          profile.streak += 1;
        } else if (profile.lastCompleted !== todayStr) {
          profile.streak = 1;
        }
        profile.lastCompleted = todayStr;
        
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
        if (profile.streaksByLanguage[language].lastCompleted === yesterdayStr) {
          profile.streaksByLanguage[language].current += 1;
        } else if (profile.streaksByLanguage[language].lastCompleted !== todayStr) {
          profile.streaksByLanguage[language].current = 1;
        }
        profile.streaksByLanguage[language].lastCompleted = todayStr;
      }
      
      // Guardar cambios en Firebase
      await this.saveUserProfile(userId, profile);
      return profile;
    } catch (error) {
      console.error('Error al registrar día completado:', error);
      return null;
    }
  },
  
  // Verificar si el usuario ya ha completado el juego para el día actual en un idioma específico
  async hasCompletedTodaysWord(userId, language) {
    if (!userId) return false;
    
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile || !profile.completedDays) {
        return false;
      }
      
      // Usar la fecha local del usuario
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
      
      const dayKey = `${todayStr}_${language}`;
      
      return profile.completedDays && profile.completedDays.hasOwnProperty(dayKey);
    } catch (error) {
      console.error('Error al verificar palabra completada:', error);
      return false;
    }
  },
  
  // Obtener estadísticas del usuario
  async getUserStats(userId) {
    if (!userId) return null;
    
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile || !profile.completedDays) {
        return {
          totalCompleted: 0,
          streak: 0,
          byLanguage: {}
        };
      }

      const completedDaysArray = Object.values(profile.completedDays);
      const byLanguage = this.getStatsByLanguage(completedDaysArray);
      
      // Calcular correctamente las rachas por idioma
      if (completedDaysArray.length > 0) {
        const sortedDays = [...completedDaysArray].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        const daysByLanguage = {};
        
        sortedDays.forEach(day => {
          if (!daysByLanguage[day.language]) {
            daysByLanguage[day.language] = [];
          }
          daysByLanguage[day.language].push(day);
        });
        
        Object.entries(daysByLanguage).forEach(([lang, days]) => {
          if (byLanguage[lang]) {
            days.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            if (days[0].date === today || days[0].date === yesterday) {
              let currentStreak = 1;
              let currentDate = new Date(days[0].date);
              
              for (let i = 1; i < days.length; i++) {
                const prevDate = new Date(days[i].date);
                const dayDiff = Math.round((currentDate - prevDate) / (24 * 60 * 60 * 1000));
                
                if (dayDiff === 1) {
                  currentStreak += 1;
                  currentDate = prevDate;
                } else {
                  break;
                }
              }
              
              byLanguage[lang].streak = currentStreak;
            } else {
              byLanguage[lang].streak = 0;
            }
          }
        });
      }
      
      return {
        totalCompleted: completedDaysArray.length,
        streak: profile.streak,
        byLanguage
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  },

  // Agrupar estadísticas por idioma
  getStatsByLanguage(completedDaysArray) {
    if (!Array.isArray(completedDaysArray)) return {};
    
    return completedDaysArray.reduce((stats, day) => {
      if (!stats[day.language]) {
        stats[day.language] = { 
          count: 0, 
          avgAttempts: 0,
          streak: 0
        };
      }
      
      stats[day.language].count += 1;
      stats[day.language].avgAttempts = 
        (stats[day.language].avgAttempts * (stats[day.language].count - 1) + day.attempts) / 
        stats[day.language].count;
        
      return stats;
    }, {});
  },

  // Suscribirse a cambios en el perfil del usuario
  subscribeToUserProfile(userId, callback) {
    if (!userId) return () => {};
    
    const userRef = this.getDbRef(userId);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error('Error en la suscripción:', error);
    });

    return unsubscribe;
  }
}