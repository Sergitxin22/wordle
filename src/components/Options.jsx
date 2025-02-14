import { useContext } from 'react'
import { AppContext } from '../App'

import { getTranslation } from '../i18n/translations';
import { KEYS } from '../i18n/constants';

function Options() {

    const { showOptions, setShowOptions, darkMode, toggleDarkMode, gameMode, toggleGameMode, language } = useContext(AppContext);

    return (
        <div className="h-full w-full">
            <div className="flex flex-col w-full h-full outline-none focus:outline-none">
                <div className="flex-initial relative my-5">
                    <h3 className="flex-auto uppercase text-center text-xl font-bold">{getTranslation(KEYS.OPTIONS, language)}</h3>
                    <button className="absolute top-0 right-0 p-1 ml-auto" onClick={() => setShowOptions(!showOptions)}>
                        <span className="leading-[0.25] h-5 w-5 text-3xl text-neutral-400 block outline-none focus:outline-none">×</span>
                    </button>
                </div>
                <div className="flex-auto grow">
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <p className="text-md">{getTranslation(KEYS.DARK_MODE, language)}</p>
                        </div>
                        <div className="flex-initial form-check form-switch">
                            <input
                                className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                                type="checkbox" role="switch" id="darkModeMode" checked={darkMode} onChange={toggleDarkMode} />
                        </div>
                    </div>
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <p className="text-md">{getTranslation(KEYS.COLOR_BLIND_MODE, language)}</p>
                        </div>
                        <div className="flex-initial form-check form-switch"><input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" id="colorBlindMode" /></div>
                    </div>
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <div className="flex flex-col">
                                <p className="text-md">{getTranslation(KEYS.ACCESSIBILITY_MODE, language)}</p>
                                <p className="text-[12px] text-neutral-500">{getTranslation(KEYS.ACCESSIBILITY_MODE_DESCRIPTION, language)}</p>
                            </div>
                        </div>
                        <div className="flex-initial form-check form-switch"><input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" id="accessibilityMode" /></div>
                    </div>
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <div className="flex flex-col">
                                <p className="text-md">{getTranslation(KEYS.UNLIMITED_MODE, language)}</p>
                            </div>
                        </div>
                        <div className="flex-initial form-check form-switch"><input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" id="gameMode" checked={gameMode} onChange={toggleGameMode} /></div>
                    </div>
                </div>
                <div className="flex-initial my-2">
                    <p className="text-[10px] text-neutral-500">Estilos de <a href="https://wordle.talaios.coop/"
                        className="underline">wordle.talaios.coop</a></p>
                </div>
            </div>
        </div >
    )
}

export default Options