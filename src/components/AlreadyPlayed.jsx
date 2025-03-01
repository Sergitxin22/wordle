import React, { useContext } from 'react';
import { AppContext } from "../App";
import { getTranslation } from '../i18n/translations';
import { KEYS } from '../i18n/constants';

function AlreadyPlayed() {
  const { language, toggleGameMode } = useContext(AppContext);
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-full mx-auto text-center">
      <h2 className="text-xl font-bold mb-3">
        {getTranslation(KEYS.ALREADY_PLAYED_TITLE, language)}
      </h2>
      
      <p className="mb-4">
        {getTranslation(KEYS.ALREADY_PLAYED_MESSAGE, language)}
      </p>
      
      <div className="flex flex-col gap-3 mt-3">
        <button 
          onClick={toggleGameMode}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {getTranslation(KEYS.PLAY_UNLIMITED_MODE, language)}
        </button>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getTranslation(KEYS.COME_TOMORROW, language)}
        </p>
      </div>
    </div>
  );
}

export default AlreadyPlayed;