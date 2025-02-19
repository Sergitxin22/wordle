import { useContext } from 'react'
import { AppContext } from '../App'

function GameOver() {
    const { gameOver, currAttempt, correctWord, wordDefinitions, gameMode, toggleGameMode } = useContext(AppContext)

    // console.log('--------------------------', wordDefinitions);

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

        </div>
    )
}

export default GameOver