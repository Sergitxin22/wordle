import wordBank from './wordle-bank.txt'
import todaysWordJson from './data/hoy/5/spanish/definiciones.json'

export const boardDefault = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

export const generateWordSet = async () => {
    let wordSet
    let todaysWord
    let todaysWordDefinitions

    await fetch(wordBank)
        .then((response) => response.text())
        .then((result) => {
            // Dividimos el resultado por las líneas y eliminamos los espacios innecesarios
            const wordArr = result.split("\n").map(word => word.trim());
            todaysWord = wordArr[Math.floor(Math.floor(Math.random() * wordArr.length))];
            // Creamos un Set con las palabras ya limpiadas
            wordSet = new Set(wordArr);
        });

    todaysWord = todaysWordJson.palabra
    wordSet.add(todaysWord)

    todaysWordDefinitions = todaysWordJson.acepciones
    
    // console.log('hola:', { wordSet, todaysWord, todaysWordDefinitions });

    return { wordSet, todaysWord, todaysWordDefinitions }
}