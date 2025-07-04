import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { LoginButton, LogoutButton, UserProfile } from "./AuthComponents";
import { useAuth } from "../auth/AuthProvider";
import { UserStats } from "./UserStats";

function Header() {
    // Obtener language y setLanguage del contexto
    const { language, setLanguage } = useContext(AppContext);
    // Obtener la información de autenticación
    const { status, session } = useAuth();
    // Estado para mostrar/ocultar el menú de autenticación
    const [showAuthMenu, setShowAuthMenu] = useState(false);
    // Estado para mostrar/ocultar las estadísticas
    const [showStats, setShowStats] = useState(false);

    // Efecto para cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAuthMenu && !event.target.closest('.auth-menu-container')) {
                setShowAuthMenu(false);
            }
            if (showStats && !event.target.closest('.stats-container')) {
                setShowStats(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAuthMenu, showStats]);

    // Efecto para cargar el idioma desde localStorage al inicio
    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, [setLanguage]);

    // Función para manejar el cambio de idioma
    const handleChangeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage); // Actualiza el estado del idioma en el contexto
        localStorage.setItem('language', selectedLanguage); // Almacena el idioma en localStorage
    };

    const { showOptions, setShowOptions } = useContext(AppContext)
    return (
        <header className={`flex flex-row items-center max-w-lg py-2 px-3 border-b dark:border-neutral-700 transition-opacity duration-300 ${showOptions ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Icono de autenticación (reemplazando el ícono de "cómo jugar") */}
            <div className="relative auth-menu-container flex items-center mr-1">
                <button
                    onClick={() => setShowAuthMenu(!showAuthMenu)}
                    className="flex items-center justify-center"
                    aria-label="Autenticación"
                >
                    {status === 'authenticated' && session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt="Usuario"
                            className="h-6 w-6 rounded-full"
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-neutral-500 dark:text-neutral-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                            </path>
                        </svg>
                    )}
                </button>

                {/* Menú flotante de autenticación */}
                {showAuthMenu && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 p-3 border border-gray-200 dark:border-gray-700">
                        {status === 'authenticated' ? (
                            <div className="flex flex-col gap-2">
                                <UserProfile />
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <LogoutButton />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm mb-2">Iniciar sesión con:</p>
                                <LoginButton />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Botón de estadísticas */}
            <div className="relative stats-container mr-1">
                <button
                    className={`text-xl flex items-center ${status !== 'authenticated' ? 'cursor-not-allowed opacity-50' : ''}`}
                    aria-label="estadísticas de juego"
                    onClick={() => status === 'authenticated' && setShowStats(!showStats)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-neutral-500 dark:text-neutral-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                    </svg>
                </button>

                {/* Panel flotante de estadísticas */}
                {showStats && (
                    <div className="absolute left-0 top-full mt-1 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                        <UserStats />
                    </div>
                )}
            </div>

            <button className="flex items-center mr-1" aria-label="opciones de juego" onClick={() => setShowOptions(!showOptions)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-neutral-500 dark:text-neutral-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                    </path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                    </path>
                </svg>
            </button>

            <div className="flex-auto text-center">
                <h1 className="uppercase font-extrabold text-2xl sm:text-3xl tracking-wider">Wordle ({language})</h1>
            </div>

            {/* // En el JSX de tu componente: */}
            <label htmlFor="language-select" className="sr-only">
                Selecciona un idioma
            </label>
            <select id="language-select" onChange={(e) => handleChangeLanguage(e.target.value)} value={language} className="text-black dark:text-white dark:bg-[#121212] self-center">
                <option value="es" className="text-black dark:text-white">Español</option>
                <option value="en" className="text-black dark:text-white">English</option>
                <option value="eu" className="text-black dark:text-white">Euskara</option>
                <option value="gl" className="text-black dark:text-white">Galego</option>
            </select>
        </header>
    )
}

export default Header