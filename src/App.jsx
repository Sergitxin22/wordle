import { useState, createContext, useEffect } from 'react';
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import { boardDefault, generateWordSet } from './Words';
import GameOver from './components/GameOver';
import Header from './components/Header';

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState('');
  const [wordDefinitions, setWordDefinitions] = useState([]);
  const [gameOver, setGameOver] = useState({ gameOver: false, guessedWord: false });

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet)
      setCorrectWord(words.todaysWord.toUpperCase())
      setWordDefinitions(words.todaysWordDefinitions)
    })
  }, [])

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

    // console.log(currWord);
    // console.log(wordSet);

    // console.log({wordSet, currWord});
    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 })
    } else {
      alert('La palabra no existe')
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true })
      return
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false })
      return
    }
  }

  return (
    <div className="dark">
      <div className="dark:bg-dark dark:text-neutral-100 text-black">
        <div className="container mx-auto flex flex-col max-w-md h-screen">
          <Header />
          <div className="Toastify"></div>
          <AppContext.Provider
            value={{
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
              gameOver,
              setGameOver,
              wordDefinitions,
              setWordDefinitions
            }}>
            <main className="flex flex-auto justify-center items-center">
              <Board />
            </main>
              {gameOver.gameOver ? <GameOver /> : <Keyboard />}
          </AppContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default App
