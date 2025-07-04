const translations = {
    es: {
        wordNotFound: "La palabra no existe",
        send: "ENVIAR",
        options: "Opciones",
        darkMode: "Modo oscuro",
        colorblindMode: "Modo para daltónicos",
        accessibilityMode: "Activar accesibilidad",
        accessibilityModeDescription: "Al pinchar la letra explica la situación.",
        unlimitedMode: "Activar modo ilimitado",
        alreadyPlayedTitle: "¡Ya has jugado hoy!",
        alreadyPlayedMessage: "Ya has adivinado la palabra del día en este idioma.",
        playUnlimitedMode: "Jugar en modo ilimitado",
        comeTomorrow: "Vuelve mañana para una nueva palabra.",
    },
    en: {
        wordNotFound: "The word does not exist",
        send: "SEND",
        options: "Options",
        darkMode: "Dark mode",
        colorblindMode: "Color blind mode",
        accessibilityMode: "Activate accessibility",
        accessibilityModeDescription: "When clicking on the letter, it explains the situation.",
        unlimitedMode: "Activate unlimited mode",
        alreadyPlayedTitle: "You've already played today!",
        alreadyPlayedMessage: "You have already guessed today's word in this language.",
        playUnlimitedMode: "Play in unlimited mode",
        comeTomorrow: "Come back tomorrow for a new word.",
    },
    eu: {
        wordNotFound: "Hitza ez da existitzen",
        send: "BIDALI",
        options: "Aukerak",
        darkMode: "Modu iluna",
        colorblindMode: "Daltonikoetarako modua",
        accessibilityMode: "Aktibatu irisgarritasuna",
        accessibilityModeDescription: "Letra sakatzean egoera azaltzen du.",
        unlimitedMode: "Aktibatu modu mugagabea",
        alreadyPlayedTitle: "Dagoeneko jokatu duzu gaur!",
        alreadyPlayedMessage: "Dagoeneko asmatu duzu gaurko hitza hizkuntza honetan.",
        playUnlimitedMode: "Jokatu modu mugagabean",
        comeTomorrow: "Itzuli bihar hitz berri baterako.",
    },
    gl: {
        wordNotFound: "A palabra non existe",
        send: "ENVIAR",
        options: "Opcións",
        darkMode: "Modo escuro",
        colorblindMode: "Modo daltónico",
        accessibilityMode: "Activar accesibilidade",
        accessibilityModeDescription: "Ao premer a letra explica a situación.",
        unlimitedMode: "Activar modo ilimitado",
        alreadyPlayedTitle: "Xa xogaches hoxe!",
        alreadyPlayedMessage: "Xa adiviñaches a palabra do día neste idioma.",
        playUnlimitedMode: "Xogar en modo ilimitado",
        comeTomorrow: "Volta mañá para unha nova palabra.",
    },
};

// Función reutilizable para obtener la traducción
export const getTranslation = (key, language = 'es') => {
    return translations[language]?.[key] || key; // Si no existe la traducción, se usa la clave como texto por defecto
};

export default translations;