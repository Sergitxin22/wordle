from bs4 import BeautifulSoup
import requests
import json
import random
import re
from datetime import datetime

# Encabezado para simular una solicitud de un navegador real
HEADER = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

def leer_palabras():
    try:
        with open('./src/data/galego/5.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Asegúrate de que el archivo JSON sea una lista de palabras
            if isinstance(data, list) and len(data) > 0:
                return data
            else:
                print('El archivo JSON no contiene suficientes palabras o no es una lista.')
                return []
    except Exception as e:
        print(f"Error al leer el archivo JSON: {e}")
        return []

def acepciones(palabra):
    try:
        url = f'https://academia.gal/dicionario/-/termo/{palabra}'
        request = requests.get(url, headers=HEADER)
        request.raise_for_status()
        soup = BeautifulSoup(request.text, 'html.parser')

        acepciones = []
        
        # Debug: Imprimir algunos divs para entender la estructura
        # print(f"  DEBUG: Buscando divs para '{palabra}'...")
        
        # Buscar el div principal que contiene las definiciones
        wordSearchResult = soup.find('div', id='wordSearchResult')
        emptySearch = soup.find('div', id='emptySearch')
        
        # Debug información
        # print(f"  DEBUG: wordSearchResult existe: {wordSearchResult is not None}")
        # if wordSearchResult:
        #     print(f"  DEBUG: wordSearchResult texto: '{wordSearchResult.get_text()[:100]}...'")
        
        # print(f"  DEBUG: emptySearch existe: {emptySearch is not None}")
        # if emptySearch:
        #     print(f"  DEBUG: emptySearch texto: '{emptySearch.get_text()[:100]}...'")
        
        # Si wordSearchResult está vacío, buscar en emptySearch
        if not wordSearchResult or not wordSearchResult.get_text().strip():
            if emptySearch and "non se encontra no dicionario" in emptySearch.get_text():
                return ['A palavra que indicaches non está recollida no dicionario.']
            result_text = ""
        else:
            # Hacer una copia del elemento para no modificar el original
            import copy
            wordSearchResult_copy = copy.copy(wordSearchResult)
            
            # Eliminar todos los span con clase 'Example' y 'Definition__UsageLabel' para limpiar las definiciones
            for example in wordSearchResult_copy.find_all('span', class_='Example'):
                example.decompose()
            for usage_label in wordSearchResult_copy.find_all('span', class_='Definition__UsageLabel'):
                usage_label.decompose()
            
            result_text = wordSearchResult_copy.get_text()
        
        # print(f"  DEBUG: result_text completo: '{result_text[:200]}...'")
        
        if result_text.strip():
            # Primero intentar extraer definiciones usando las clases CSS específicas
            definiciones_css = wordSearchResult_copy.find_all('span', class_='Definition__Definition')
            if definiciones_css:
                # print(f"  DEBUG: Encontradas {len(definiciones_css)} definiciones con CSS")
                for i, def_span in enumerate(definiciones_css, 1):
                    definicion_texto = def_span.get_text().strip()
                    if len(definicion_texto) > 10:
                        # print(f"    Traduciendo definición {i}: {definicion_texto[:50]}...")
                        definicion_traducida = traducir_gallego_castellano(definicion_texto)
                        acepciones.append(f"{i}. {definicion_traducida}")
                        if len(acepciones) >= 2:  # Limitar a 2 acepciones
                            break
            
            # Si no encontramos con CSS, usar el método de regex como fallback
            if not acepciones:
                # El texto viene en una sola línea con el formato: "palabra categoria1definicion1"
                # Ejemplo: "abade substantivo masculino1 Superior dun convento..."
                
                # Buscar el patrón: palabra + categoría gramatical + número + definición
                texto_limpio = result_text.replace('\n', ' ').replace('\t', ' ')
                while '  ' in texto_limpio:
                    texto_limpio = texto_limpio.replace('  ', ' ')
                
                # print(f"  DEBUG: texto_limpio: '{texto_limpio[:200]}...'")
                
                # Buscar definiciones numeradas
                import re
                # Patrón para encontrar números seguidos de texto hasta el siguiente número
                patron_definiciones = r'(\d+)([^0-9]+?)(?=\d+|$)'
                matches = re.findall(patron_definiciones, texto_limpio)
                
                # print(f"  DEBUG: matches encontrados: {matches}")
                
                for numero, definicion in matches:
                    definicion_limpia = definicion.strip()
                    if len(definicion_limpia) > 10:  # Solo si la definición es suficientemente larga
                        # Traducir la definición del gallego al castellano
                        # print(f"    Traduciendo: {definicion_limpia[:50]}...")
                        definicion_traducida = traducir_gallego_castellano(definicion_limpia)
                        acepciones.append(f"{numero}. {definicion_traducida}")
                        if len(acepciones) >= 2:  # Limitar a 2 acepciones
                            break
        
        # Si no encontramos definiciones en wordSearchResult, usar un método simple
        if not acepciones:
            all_text = soup.get_text()
            lines = all_text.split('\n')
            word_found = False
            
            for line in lines:
                line = line.strip()
                
                # Si encontramos la línea con la palabra (sin estar en título)
                if palabra.lower() in line.lower() and len(line) < 100 and 'dicionario' not in line.lower():
                    word_found = True
                    continue
                
                # Si ya encontramos la palabra, buscar definiciones
                if word_found and line:
                    # Buscar líneas que empiecen con número
                    if len(line) > 0 and line[0].isdigit():
                        # Extraer número y texto manualmente
                        i = 0
                        while i < len(line) and line[i].isdigit():
                            i += 1
                        if i > 0 and i < len(line):
                            numero = line[:i]
                            resto = line[i:].strip()
                            if len(resto) > 10:  # Solo si la definición es suficientemente larga
                                # Traducir la definición del gallego al castellano
                                # print(f"    Traduciendo (método alternativo): {resto[:50]}...")
                                resto_traducido = traducir_gallego_castellano(resto)
                                acepciones.append(f"{numero}. {resto_traducido}")
                                if len(acepciones) >= 2:  # Limitar a 2 acepciones
                                    break
                    
                    # Parar si encontramos texto irrelevante
                    if any(stop in line.lower() for stop in ['antes e despois', 'axúdanos', 'contacto']):
                        break

        if not acepciones:
            return ['A palabra que indicaches non está recollida no dicionario.']

        return acepciones[:2]  # Limitar a 2 acepciones

    except requests.exceptions.RequestException as e:
        print(f"Error en la petición HTTP: {e}")
        return ['Non se puido obter a definición.']
    except Exception as e:
        print(f"Error al procesar la palabra '{palabra}': {e}")
        return ['Ocorreu un erro inesperado ao obter a definición.']


def guardar_definiciones(palabras_definiciones):
    try:
        with open('./src/data/galego/5-definiciones.json', 'w', encoding='utf-8') as file:
            json.dump(palabras_definiciones, file, ensure_ascii=False, indent=4)
        # print(f'\nDefinicións gardadas en "src/data/galego/5-definiciones.json".')
    except Exception as e:
        print(f"Error al guardar las definiciones en el archivo JSON: {e}")

def cargar_definiciones_existentes():
    """Carga las definiciones existentes del archivo JSON si existe"""
    try:
        with open('./src/data/galego/5-definiciones.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error al cargar definiciones existentes: {e}")
        return []

def traducir_gallego_castellano(texto):
    """Traduce texto del gallego al castellano usando el traductor da Coruña"""
    try:
        url = "https://tradutor.dacoruna.gal/fron-trad/tradtext.php"
        headers = {
            "accept": "*/*",
            "accept-language": "es-ES,es;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        # Dirección gl-es significa gallego a español
        body = f"direccion=gl-es&marcar=&cuadrotexto={texto}"
        
        response = requests.post(url, headers=headers, data=body)
        response.raise_for_status()
        
        # El servidor devuelve el texto traducido directamente
        traduccion = response.text.strip()
        
        # Si la traducción es muy corta o igual al original, devolver el original
        if len(traduccion) < 5 or traduccion.lower() == texto.lower():
            return texto
            
        return traduccion
        
    except Exception as e:
        print(f"Error al traducir '{texto}': {e}")
        return texto  # Si falla la traducción, devolver el texto original

def main():
    palabras = leer_palabras()
    if not palabras:
        print('No se pudieron obtener las palabras del archivo.')
        return
    
    # Cargar definiciones existentes
    palabras_definiciones = cargar_definiciones_existentes()
    palabras_procesadas = {item['palabra'] for item in palabras_definiciones}
    
    # Encontrar el índice de la palabra "senis"
    try:
        indice_inicio = palabras.index("senis")
        print(f"Iniciando desde la palabra 'senis' (índice {indice_inicio})")
        palabras = palabras[indice_inicio:]  # Procesar desde "senis" en adelante
    except ValueError:
        print("La palabra 'senis' no se encontró en la lista, procesando todas las palabras")
    
    # Procesar todas las palabras desde "grupo"
    print(f"Procesando {len(palabras)} palabras...")
    palabras_encontradas = 0
    
    for i, palabra in enumerate(palabras, 1):
        # Saltar si ya fue procesada
        if palabra in palabras_procesadas:
            print(f'({i}/{len(palabras)}) {palabra} ya procesada, saltando...')
            continue
            
        print(f'({i}/{len(palabras)}) Obteniendo definición de {palabra}...')
        aceps = acepciones(palabra)
        
        # Solo añadir al JSON si la palabra tiene definiciones válidas
        if aceps and aceps[0] != 'A palavra que indicaches non está recollida no dicionario.' and aceps[0] != 'Non se puido obter a definición.' and aceps[0] != 'Ocorreu un erro inesperado ao obter a definición.':
            palabras_definiciones.append({
                'palabra': palabra,
                'acepciones': aceps[:2]  # Limita las acepciones a las dos primeras
            })
            palabras_encontradas += 1
            print(f"  ✓ Definiciones encontradas para '{palabra}' (total: {len(palabras_definiciones)})")
            
            # Guardar inmediatamente después de cada palabra exitosa
            guardar_definiciones(palabras_definiciones)
        else:
            print(f"  ✗ No se encontraron definiciones para '{palabra}', se omite del JSON")
    
    print(f"\nProcesadas {len(palabras)} palabras, encontradas definiciones para {len(palabras_definiciones)} palabras en total")
    print(f"Archivo final guardado en 'src/data/galego/5-definiciones.json'")

if __name__ == '__main__':
    # Ejecutar el script completo directamente
    print("Iniciando procesamiento de todas las palabras gallegas...")
    main()
