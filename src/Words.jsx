import wordBank from './wordle-bank.txt'

// Importaciones estáticas de definiciones en distintos idiomas
import spanishDefinitions from './data/hoy/5/spanish/definiciones.json';
import englishDefinitions from './data/hoy/5/english/definiciones.json';
import basqueDefinitions from './data/hoy/5/euskera/definiciones.json';

export const boardDefault = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

export const generateWordSet = async (language) => {
    let wordSet
    let todaysWord
    let todaysWordDefinitions

    // Seleccionar el archivo JSON adecuado según el idioma
    let todaysWordJson;
    switch (language) {
        case 'en':
            todaysWordJson = englishDefinitions;
            break;
        case 'eu':
            todaysWordJson = basqueDefinitions;
            break;
        case 'es':
        default:
            todaysWordJson = spanishDefinitions;
            break;
    }

    console.log(language);
    console.log(todaysWordJson);



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