import { useContext } from 'react'
import { AppContext } from '../App'

function Options() {

    const { showOptions, setShowOptions, darkMode, toggleDarkMode } = useContext(AppContext);

    return (
        <div className="h-full w-full">
            <div className="flex flex-col w-full h-full outline-none focus:outline-none">
                <div className="flex-initial relative m-5">
                    <h3 className="flex-auto uppercase text-center text-xl font-bold">Opciones</h3>
                    <button className="absolute top-0 right-0 p-1 ml-auto" onClick={() => setShowOptions(!showOptions)}>
                        <span className="leading-[0.25] h-5 w-5 text-3xl text-neutral-400 block outline-none focus:outline-none">×</span>
                    </button>
                </div>
                <div className="flex-auto grow mx-5">
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <p className="text-md">Modo oscuro</p>
                        </div>
                        <div className="flex-initial form-check form-switch">
                            <input
                                className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                                type="checkbox" role="switch" id="darkModeMode" checked={darkMode} onChange={toggleDarkMode} />
                        </div>
                    </div>
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <p className="text-md">Modo para daltónicos</p>
                        </div>
                        <div className="flex-initial form-check form-switch"><input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" id="colorBlindMode" /></div>
                    </div>
                    <div className="flex py-5 border-b border-solid">
                        <div className="flex flex-auto">
                            <div className="flex flex-col">
                                <p className="text-md">Activar accesibilidad</p>
                                <p className="text-[12px] text-neutral-500">Al pinchar la letra explica la situación.</p>
                            </div>
                        </div>
                        <div className="flex-initial form-check form-switch"><input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-neutral-300 dark:bg-neutral-700 checked:dark:bg-blue-500 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" id="accessibilityMode" /></div>
                    </div>
                </div>
                <div className="flex-initial my-2 mx-6 ">
                    <p className="text-[10px] text-neutral-500">Estilos de <a href="https://wordle.talaios.coop/"
                        className="underline">wordle.talaios.coop</a></p>
                </div>
            </div>
        </div >
    )
}

export default Options