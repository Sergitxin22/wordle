import json

# Ruta del archivo
file_path = r"c:\Users\sergio.morales\Documents\GitHub\wordle\src\data\galego\5.json"

# Cargar las palabras del archivo
with open(file_path, "r", encoding="utf-8") as file:
    words = json.load(file)

# Letras válidas en gallego
valid_letters = set("abcdefghijklmnopqrstuvwxyzáéíóúñü")

# Filtrar palabras únicas y válidas
filtered_words = sorted(set(word for word in words if all(char in valid_letters for char in word)))

# Guardar el resultado en el archivo original
with open(file_path, "w", encoding="utf-8") as file:
    json.dump(filtered_words, file, ensure_ascii=False, indent=4)

print("Palabras repetidas y no válidas eliminadas.")
