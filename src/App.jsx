import { useState, createContext, useEffect } from 'react';
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import { boardDefault, generateWordSet } from './Words';
import GameOver from './components/GameOver';
import Header from './components/Header';
import Toast from './components/Toast';
import Options from './components/Options';
import { getTranslation } from './i18n/translations';
import { KEYS } from './i18n/constants';
import { useAuth } from './auth/AuthProvider';
import { UserService } from './auth/UserService';
import AlreadyPlayed from './components/AlreadyPlayed';

export const AppContext = createContext();

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || "es");
  const [gameMode, setGameMode] = useState(() => localStorage.getItem('unlimited') === 'true');
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState('');
  const [wordDefinitions, setWordDefinitions] = useState([]);
  const [gameOver, setGameOver] = useState({ gameOver: false, guessedWord: false });
  const [showToast, setShowToast] = useState(false);
  const [hasAlreadyPlayed, setHasAlreadyPlayed] = useState(false);

  // Obtener la información de autenticación
  const { session, status } = useAuth();

  // Cambiar el idioma también cambia el idioma en localStorage
  useEffect(() => {
    localStorage.setItem('language', language); // Guarda el idioma actual en localStorage
  }, [language]);

  const [showOptions, setShowOptions] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro

  useEffect(() => {
    // Efecto para sincronizar con la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Función para aplicar el modo oscuro basado en localStorage o preferencia del sistema
    const applyDarkMode = () => {
      const savedMode = localStorage.getItem('darkMode');

      if (savedMode === null) {
        // Si no hay valor en localStorage, usar la preferencia del sistema
        const isDarkMode = mediaQuery.matches;
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
      } else {
        // Si hay valor en localStorage, usar ese valor
        const isDarkMode = savedMode === 'true';
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
      }
    };

    applyDarkMode(); // Aplicar modo oscuro al cargar el componente

    // Manejar cambios en la preferencia del sistema
    const handleChange = (e) => {
      // Solo aplica cambios si no hay un valor en localStorage
      if (localStorage.getItem('darkMode') === null) {
        const isDarkMode = e.matches;
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Limpiar el efecto
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode); // Guardar el nuevo estado en localStorage
      document.documentElement.classList.toggle('dark', newMode); // Cambiar la clase en <html>
      return newMode;
    });
  };

  const toggleGameMode = () => {
    setGameMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('unlimited', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (language && gameMode !== null) {
      // Verificar si el usuario ya ha jugado la palabra del día (solo si está autenticado y no en modo ilimitado)
      if (status === 'authenticated' && session?.user?.id && !gameMode) {
        UserService.hasCompletedTodaysWord(session.user.id, language)
          .then(alreadyPlayed => {
            setHasAlreadyPlayed(alreadyPlayed);
          })
          .catch(error => {
            console.error('Error al verificar si ya jugó:', error);
            setHasAlreadyPlayed(false);
          });
      } else {
        setHasAlreadyPlayed(false);
      }

      generateWordSet(language, gameMode).then((words) => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord.toUpperCase());
        setWordDefinitions(words.todaysWordDefinitions);

        setBoard(boardDefault.map(row => [...row]));
        setCurrAttempt({ attempt: 0, letterPos: 0 });
        setDisabledLetters([]);
        setCorrectLetters([]);
        setAlmostLetters([]);
        setGameOver({ gameOver: false, guessedWord: false });
      });
    }
  }, [language, gameMode, status, session?.user?.id, session?.user]); // Añadimos session?.user para que se dispare cuando cambia el estado de autenticación

  const [guessedLetterUsage, setGuessedLetterUsage] = useState({});

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return

    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal
    setBoard(newBoard)
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 })
  }

  const onDelete = () => {
    if (currAttempt.letterPos === 0) return

    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = ''
    setBoard(newBoard)
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 })
  }

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return

    let currWord = ''
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i]
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 })
    } else {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // Ocultar después de 3 segundos
      return;
    }

    if (currWord === correctWord) {
      // Registrar el juego completado si el usuario está autenticado
      if (status === 'authenticated' && session?.user?.id && !gameMode) {
        UserService.registerCompletedDay(
          session.user.id,
          new Date(),
          language,
          currAttempt.attempt + 1
        );
      }
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  }

  return (
    <div className="dark:bg-dark dark:text-neutral-100 text-black">
      <div className="min-h-screen container mx-auto flex flex-col max-w-md">
        <AppContext.Provider
          value={{
            language,
            setLanguage,
            gameMode,
            setGameMode,
            toggleGameMode,
            board,
            setBoard,
            currAttempt,
            setCurrAttempt,
            onSelectLetter,
            onDelete,
            onEnter,
            correctWord,
            guessedLetterUsage,
            setGuessedLetterUsage,
            disabledLetters,
            setDisabledLetters,
            correctLetters,
            setCorrectLetters,
            almostLetters,
            setAlmostLetters,
            gameOver,
            setGameOver,
            wordDefinitions,
            setWordDefinitions,
            showOptions,
            setShowOptions,
            darkMode,
            toggleDarkMode, // Agregar toggleDarkMode al contexto
          }}>
          <Header opacity={showOptions} />

          {/* Contenido principal: Ocultar visualmente pero sin desmontar */}
          <div
            className={`transition-opacity duration-300 ${showOptions ? "opacity-0 pointer-events-none" : "opacity-100"
              } flex flex-col flex-auto`}
          >
            {showToast && <Toast message={getTranslation(KEYS.WORD_NOT_FOUND, language)} onClose={() => setShowToast(false)} />}
            <main className="flex flex-auto justify-center items-center px-[2rem] py-2">
              {/* Mostrar AlreadyPlayed cuando el usuario ya ha jugado la palabra del día */}
              {!gameMode && hasAlreadyPlayed ? (
                <AlreadyPlayed />
              ) : (
                <Board />
              )}
            </main>
            {!gameMode && hasAlreadyPlayed ? (
              null // No mostrar teclado si ya jugó
            ) : gameOver.gameOver ? (
              <GameOver />
            ) : (
              <Keyboard />
            )}
          </div>

          {/* Mostrar Options sobre el resto del contenido */}
          <div
            className={`container mx-auto flex flex-col max-w-md h-dvh absolute inset-0 flex justify-center items-center px-5 md:px-0 bg-opacity-100 transition-opacity duration-300 ${showOptions ? "opacity-100 pointer-events-auto z-10" : "opacity-100 pointer-events-none"
              }`}
          >
            {showOptions && <Options />}
          </div>
        </AppContext.Provider>
      </div>
    </div>
  )
}

export default App
