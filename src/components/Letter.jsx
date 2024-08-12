import { useContext } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];

  // No mostrar nada si el intento actual no es mayor que el intento de la letra
  if (currAttempt.attempt <= attemptVal) {
    return <div className="letter">{letter}</div>;
  }

  const correctWordArray = correctWord.split('');
  const attemptArray = board[attemptVal].slice();

  let letterState = 'incorrect';

  // Crear un array para rastrear cuántas veces se ha usado cada letra de la palabra correcta
  const correctLetterUsage = {};

  correctWordArray.forEach((char) => {
    if (char) {
      correctLetterUsage[char] = (correctLetterUsage[char] || 0) + 1;
    }
  });

  // Array para rastrear qué letras ya se han contado
  const guessedLetterUsage = {};

  // Marcar las letras correctas primero
  attemptArray.forEach((char, index) => {
    if (char === correctWordArray[index]) {
      if (index === letterPos) {
        letterState = 'correct';
      }
      guessedLetterUsage[char] = (guessedLetterUsage[char] || 0) + 1;
      correctLetterUsage[char]--;
    }
  });

  // Marcar las letras casi correctas
  // TODO: error, si repites una letra, en un sitio equivocado se ponen todas amarillas
  if (letterState !== 'correct' && correctWord.includes(letter)) {
    const alreadyUsed = guessedLetterUsage[letter] || 0;
    const availableInWord = correctLetterUsage[letter] || 0;

    if (alreadyUsed < availableInWord) {
      letterState = 'almost';
      guessedLetterUsage[letter] = alreadyUsed + 1;
    }
    console.log(guessedLetterUsage);
    
  }

  return (
    <div className="letter" id={letterState}>{letter}</div>
  );
}

export default Letter;
