import deleteIcon from '../assets/delete.svg';
import { useContext } from "react";
import { AppContext } from "../App";

function DeleteKey() {
  const { onDelete } = useContext(AppContext);

  const deleteKey = () => {
    onDelete()
  }

  return (
    <div className="key delete" onClick={deleteKey}><img src={deleteIcon} alt="Delete Icon" /></div>
  )
}

export default DeleteKey