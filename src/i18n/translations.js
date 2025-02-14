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
    },
};

// Función reutilizable para obtener la traducción
export const getTranslation = (key, language = 'es') => {
    return translations[language]?.[key] || key; // Si no existe la traducción, se usa la clave como texto por defecto
};

export default translations;  