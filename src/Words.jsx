// Importaciones estáticas de definiciones en distintos idiomas
import spanishDefinitions from './data/hoy/5/spanish/definiciones.json';
import englishDefinitions from './data/hoy/5/english/definiciones.json';
import basqueDefinitions from './data/hoy/5/euskara/definiciones.json';

// Importaciones estáticas de palabras válidas en distintos idiomas
import spanishWords from './data/spanish/sin-tildes/5.json';
import englishWords from './data/english/5.json';
import basqueWords from './data/euskara/5.json';

// Importaciones estáticas de palabras válidas con definiciones en distintos idiomas
import spanishAllDefinitions from './data/spanish/sin-tildes/5-definiciones.json';
import englishAllDefinitions from './data/english/5-definiciones.json';
import basqueAllDefinitions from './data/euskara/5-definiciones.json';

export const boardDefault = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

export const generateWordSet = async (language, gameMode) => {
    // console.log(gameMode);
    let wordSet;
    let todaysWord;
    let todaysWordDefinitions;

    let todaysWordJson;
    let allDefinitions;

    switch (language) {
        case 'en':
            todaysWordJson = englishDefinitions;
            wordSet = new Set(englishWords);
            allDefinitions = englishAllDefinitions;
            break;
        case 'eu':
            todaysWordJson = basqueDefinitions;
            wordSet = new Set(basqueWords);
            allDefinitions = basqueAllDefinitions;
            break;
        case 'es':
        default:
            todaysWordJson = spanishDefinitions;
            wordSet = new Set(spanishWords);
            allDefinitions = spanishAllDefinitions;
            break;
    }

    if (gameMode) {
        // Escoger una palabra aleatoria del archivo 5-definiciones.json
        const randomIndex = Math.floor(Math.random() * allDefinitions.length);
        todaysWord = allDefinitions[randomIndex].palabra;
        todaysWordDefinitions = allDefinitions[randomIndex].acepciones;
    } else {
        // Usar la palabra fija del JSON
        todaysWord = todaysWordJson.palabra;
        todaysWordDefinitions = todaysWordJson.acepciones;
    }

    wordSet.add(todaysWord); // Asegurar que la palabra del día está en el conjunto

    // console.log(todaysWord);

    return { wordSet, todaysWord, todaysWordDefinitions };
};