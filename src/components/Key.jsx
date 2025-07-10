import { useContext } from "react";
import { AppContext } from "../App";
import { getTranslation } from '../i18n/translations';
import { KEYS } from '../i18n/constants';

function Key({ keyVal, bigKey, disabled, almost, correct }) {
  const { onSelectLetter, onEnter, disabledLetters, language, colorBlindMode } = useContext(AppContext);

  const selectLetter = () => {
    if (keyVal === "ENVIAR") {
      onEnter()
    } else {
      // if (disabledLetters.includes(keyVal)) return
      onSelectLetter(keyVal)
    }
  }

  const displayText = keyVal === "ENVIAR"
    ? getTranslation(KEYS.SEND, language)
    : keyVal;

  const colorBlindClass = colorBlindMode ? "colorblind" : "";
  const keyClasses = [
    "flex-1 rounded uppercase font-bold p-1 sm:p-2 h-16 text-xs tiny:text-base bg-key",
    almost ? "almost" : "",
    correct ? "correct" : "",
    colorBlindClass
  ].join(" ");

  return (
    <button
      className={keyClasses}
      id={disabled ? "disabled" : undefined}
      aria-label={keyVal}
      onClick={selectLetter}>
      {displayText}
    </button>
  )
}

export default Key