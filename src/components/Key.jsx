import { useContext } from "react";
import { AppContext } from "../App";

function Key({ keyVal, bigKey, disabled }) {
  const { onSelectLetter, onEnter, disabledLetters } = useContext(AppContext);

  const selectLetter = () => {
    if (keyVal === "ENVIAR") {
      onEnter()
    } else {
      if (disabledLetters.includes(keyVal)) return
      onSelectLetter(keyVal)
    }
  }

  return (
    <div 
      className="key" 
      id={bigKey ? "big" : (disabled ? "disabled" : undefined)}
      onClick={selectLetter}>
        {keyVal}
    </div>
  )
}

export default Key