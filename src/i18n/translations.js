const translations = {
    es: {
        wordNotFound: "La palabra no existe",
        send: "ENVIAR"
    },
    en: {
        wordNotFound: "The word does not exist",
        send: "SEND"
    },
    eu: {
        wordNotFound: "Hitza ez da existitzen",
        send: "BIDALI"
    },
};

// Función reutilizable para obtener la traducción
export const getTranslation = (key, language = 'es') => {
    return translations[language]?.[key] || key; // Si no existe la traducción, se usa la clave como texto por defecto
};

export default translations;  