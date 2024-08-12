import { useContext } from "react";
import { AppContext } from "../App";

function Key({ keyVal, bigKey }) {
  const { onSelectLetter, onEnter } = useContext(AppContext);

  const selectLetter = () => {
    if (keyVal === "ENVIAR") {
      onEnter()
    } else {
      onSelectLetter(keyVal)
    }
  }

  return (
    <div className="key" id={ bigKey && "big" } onClick={selectLetter}>{keyVal}</div>
  )
}

export default Key