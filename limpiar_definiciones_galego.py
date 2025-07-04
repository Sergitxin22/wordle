import json

def limpiar_definiciones():
    """Elimina todas las entradas que contengan el mensaje de palabra no encontrada"""
    try:
        # Leer el archivo JSON
        with open('./src/data/galego/5-definiciones.json', 'r', encoding='utf-8') as file:
            datos = json.load(file)
        
        print(f"Total de entradas antes de limpiar: {len(datos)}")
        
        # Filtrar las entradas que NO contengan el mensaje de error
        datos_limpios = []
        entradas_eliminadas = 0
        
        for entrada in datos:
            # Verificar si alguna acepción contiene el mensaje de error
            tiene_error = any(
                "A palabra que indicaches non está recollida no dicionario." in acepcion 
                for acepcion in entrada.get('acepciones', [])
            )
            
            if not tiene_error:
                datos_limpios.append(entrada)
            else:
                entradas_eliminadas += 1
                print(f"Eliminando entrada para '{entrada['palabra']}'")
        
        print(f"Total de entradas después de limpiar: {len(datos_limpios)}")
        print(f"Entradas eliminadas: {entradas_eliminadas}")
        
        # Guardar el archivo limpio
        with open('./src/data/galego/5-definiciones.json', 'w', encoding='utf-8') as file:
            json.dump(datos_limpios, file, ensure_ascii=False, indent=4)
        
        print("Archivo limpiado y guardado exitosamente.")
        
    except Exception as e:
        print(f"Error al limpiar el archivo: {e}")

if __name__ == '__main__':
    limpiar_definiciones()
