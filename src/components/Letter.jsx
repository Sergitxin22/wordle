import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

function getNumOfOccurrencesInWord(word, letter) {
  return word.split("").filter((l) => l === letter).length;
}

function getPositionOfOccurrence(word, letter, position) {
  let count = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) count++;
  }
  return count;
}

function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const [letterState, setLetterState] = useState("");

  useEffect(() => {
    const correctWordArray = correctWord.split("");
    const attemptArray = board[attemptVal];

    // Número de ocurrencias de la letra en la palabra correcta
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(correctWord, letter);
    // Número de ocurrencias de la letra en el intento actual
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(attemptArray.join(""), letter);
    // Posición de la ocurrencia actual de la letra en el intento
    const letterPosition = getPositionOfOccurrence(attemptArray, letter, letterPos);

    let state = "incorrect";

    // Si la letra es exactamente igual en la posición correcta
    if (letter === correctWord[letterPos]) {
      state = "correct";
    } 
    // Si la letra está en la palabra correcta, pero no en la posición correcta
    else if (correctWord.includes(letter)) {
      const correctLetterUsage = correctWordArray.reduce((acc, char, index) => {
        if (char === letter) acc++;
        return acc;
      }, 0);

      const usedLetters = attemptArray.slice(0, letterPos).filter((char) => char === letter).length;

      if (usedLetters < correctLetterUsage && letterPosition <= numOfOccurrencesSecret) {
        state = "almost";
      }
    }

    setLetterState(state);
  }, [letter, correctWord, letterPos, board, attemptVal]);

  // <div className='letter' id={letterState}>
  return (
    <div className={`letter ${letterState}`} id={`box${attemptVal}${letterPos}`}>
      {letter}
    </div>
  );
}

export default Letter;
