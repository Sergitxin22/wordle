import { useContext } from 'react'
import { AppContext } from '../App'

function GameOver() {
    const { gameOver, currAttempt, correctWord, wordDefinitions } = useContext(AppContext)

    console.log('--------------------------', wordDefinitions);    

    return (
        <div className='gameOver'>
            <h2>{!gameOver.guessedWord && 'Has fallado'}</h2>            
            {gameOver.guessedWord && (<h1 style={{marginBottom: '5px'}}>Has acertado!!</h1>)}

            {(gameOver.guessedWord && currAttempt.attempt === 1) && (<h3 style={{marginTop: '5px'}}>en {currAttempt.attempt} intento</h3>)}
            {(gameOver.guessedWord && currAttempt.attempt !== 1) && (<h3>en {currAttempt.attempt} intentos</h3>)}
                <hr />
            <div style={{ textAlign: 'center', maxWidth: '900px'}}>
                <div style={{ textAlign: 'left'}}>
                    {!gameOver.guessedWord && (<h1>La palabra de hoy era: {correctWord}</h1>)}
                    
                    {wordDefinitions.map((definition, index) => (
                        <h3 key={index}>{definition}</h3>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GameOver