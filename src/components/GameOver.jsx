import { useContext, useEffect } from 'react'
import { AppContext } from '../App'
import { UserService } from '../auth/UserService'
import { useAuth } from '../auth/AuthProvider'
import { UserStats } from './UserStats'

function GameOver() {
    const { gameOver, currAttempt, correctWord, wordDefinitions, gameMode, toggleGameMode, language } = useContext(AppContext)
    const { session, status, configError } = useAuth();

    // Registrar la completitud de la palabra cuando el juego termina (victoria o derrota)
    useEffect(() => {
        if (gameOver.gameOver && status === 'authenticated' && session?.user?.id && !gameMode) {
            // Registrar el día completado en el perfil del usuario
            UserService.registerCompletedDay(
                session.user.id,
                new Date(),
                language,  // el idioma actual
                currAttempt.attempt  // número de intentos
            );
        }
    }, [gameOver.gameOver, status, session, language, currAttempt.attempt, gameMode]);

    return (
        <div className='px-5 py-5 mb-10 text-center'>
            <h2 className='text-xl'>{!gameOver.guessedWord && 'Has fallado'}</h2>
            {gameOver.guessedWord && (<h1 style={{ marginBottom: '5px' }} className='text-5xl font-bold'>Has acertado!!</h1>)}

            {(gameOver.guessedWord && currAttempt.attempt === 1) && (<h3 className='mt-4 text-lg font-semibold'>en {currAttempt.attempt} intento</h3>)}
            {(gameOver.guessedWord && currAttempt.attempt !== 1) && (<h3 className='mt-4 text-lg font-semibold'>en {currAttempt.attempt} intentos</h3>)}

            {!gameOver.guessedWord && (<h2 className='text-3xl'>La palabra de hoy era: <span className='text-4xl font-bold'>{correctWord}</span></h2>)}
            <hr className='my-3' />

            <div className='text-left'>
                {wordDefinitions.map((definition, index) => (
                    <h3 key={index} className='text-xl font-semibold leading-8'>{definition}</h3>
                ))}
            </div>

            {/* Mostrar estadísticas del usuario si está autenticado */}
            {!configError && status === 'authenticated' && (
                <div className="my-4">
                    <UserStats />
                </div>
            )}

            {gameMode && (
                <div className="flex justify-center gap-4 mt-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => { toggleGameMode(); window.location.reload() }}
                    >
                        Volver a jugar
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.reload()}
                    >
                        Siguiente palabra
                    </button>
                </div>
            )}

            {/* Si el usuario no está autenticado y Firebase está configurado, mostrar mensaje para incentivar el inicio de sesión */}
            {!configError && status !== 'authenticated' && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
                    <p className="text-sm">Inicia sesión para guardar tus estadísticas y ver tu racha de palabras completadas.</p>
                </div>
            )}
        </div>
    )
}

export default GameOver