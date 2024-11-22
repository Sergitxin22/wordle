import json
import random

# Diccionario con las rutas de los archivos para cada idioma
IDIOMAS_RUTAS = {
    'spanish': 'src/data/spanish/sin-tildes/5-definiciones.json',
    'english': 'src/data/english/5-definiciones.json',
    'euskara': 'src/data/euskara/5-definiciones.json'
}

# Ruta de salida por idioma
SALIDA_RUTAS = {
    'spanish': 'src/data/hoy/5/spanish/definiciones.json',
    'english': 'src/data/hoy/5/english/definiciones.json',
    'euskara': 'src/data/hoy/5/euskara/definiciones.json'
}

def leer_definiciones(ruta):
    """Lee un archivo JSON y retorna los datos como una lista."""
    try:
        with open(ruta, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"Error al leer el archivo {ruta}: {e}")
        return []

def guardar_definicion_hoy(definicion, ruta_salida):
    """Guarda una definición en un archivo JSON."""
    try:
        with open(ruta_salida, 'w', encoding='utf-8') as file:
            json.dump(definicion, file, ensure_ascii=False, indent=4)
        print(f'Definición guardada en "{ruta_salida}".')
    except Exception as e:
        print(f"Error al guardar la definición en {ruta_salida}: {e}")

def seleccionar_definicion(idioma):
    """Selecciona una definición aleatoria para un idioma específico."""
    ruta_entrada = IDIOMAS_RUTAS.get(idioma)
    if not ruta_entrada:
        print(f"Idioma '{idioma}' no soportado.")
        return
    
    definiciones = leer_definiciones(ruta_entrada)
    if not definiciones:
        print(f'No se pudieron obtener las definiciones para el idioma "{idioma}".')
        return
    
    definicion_aleatoria = random.choice(definiciones)
    guardar_definicion_hoy(definicion_aleatoria, SALIDA_RUTAS[idioma])

def main():
    seleccionar_definicion("spanish")
    seleccionar_definicion("english")
    seleccionar_definicion("euskara")

if __name__ == '__main__':
    main()
