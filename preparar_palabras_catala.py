from bs4 import BeautifulSoup
import requests
import json
import random
import re
from datetime import datetime
import time
import urllib.parse

# Encabezado para simular una solicitud de un navegador real
HEADER = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ca,en-US;q=0.7,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

def leer_palabras():
    try:
        with open('./src/data/catala/5.json', 'r', encoding='utf-8') as file:
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
        # Intentar diferentes URLs del diccionario catalán
        urls_to_try = [
            f'https://ca.wiktionary.org/wiki/{palabra}',
            f'https://dlc.iec.cat/Results?DecEntradaText={palabra}&AllInfoMorf=True',
            f'https://www.diccionari.cat/lexicx.jsp?GECART=0001144#{palabra}'
        ]
        
        acepciones = []
        
        for url in urls_to_try:
            try:
                # Añadir un pequeño delay para evitar ser bloqueados
                # time.sleep(0.5)
                request = requests.get(url, headers=HEADER, timeout=10)
                request.raise_for_status()
                soup = BeautifulSoup(request.text, 'html.parser')
                
                # Estrategia específica para cada fuente
                if 'wiktionary.org' in url:
                    # Para Wiktionary
                    acepciones = extraer_definiciones_wiktionary(soup, palabra)
                elif 'dlc.iec.cat' in url:
                    # Para el diccionario de la IEC
                    acepciones = extraer_definiciones_iec(soup, palabra)
                elif 'diccionari.cat' in url:
                    # Para diccionari.cat
                    acepciones = extraer_definiciones_diccionari_cat(soup, palabra)
                
                if acepciones and acepciones[0] != 'No s\'ha trobat la definició de la paraula al diccionari.':
                    return acepciones[:2]
                    
            except Exception as e:
                continue
        
        return ['No s\'ha trobat la definició de la paraula al diccionari.']

    except Exception as e:
        print(f"Error al procesar la palabra '{palabra}': {e}")
        return ['S\'ha produït un error inesperat en obtenir la definició.']

def extraer_definiciones_wiktionary(soup, palabra):
    """Extraer definiciones de Wiktionary en catalán"""
    acepcions = []
    
    # Buscar listas ordenadas que contengan definiciones
    ols = soup.find_all('ol')
    
    for ol in ols:
        items = ol.find_all('li')
        for item in items[:2]:
            texto = item.get_text().strip()
            # Limpiar texto y filtrar definiciones válidas
            if (len(texto) > 20 and 
                not texto.startswith('(') and
                not any(filtro in texto.lower() for filtro in 
                       ['vegeu', 'vegeu també', 'category:', 'categoria:'])):
                
                # Limpiar el texto de referencias y enlaces
                texto_limpio = re.sub(r'\[.*?\]', '', texto)  # Quitar referencias [1], [2], etc.
                texto_limpio = re.sub(r'\s+', ' ', texto_limpio).strip()
                
                if len(texto_limpio) > 15:
                    acepcions.append(f"{len(acepcions)+1}. {texto_limpio}")
                    if len(acepcions) >= 2:
                        break
        if acepcions:
            break
    
    return acepcions

def extraer_definiciones_iec(soup, palabra):
    """Extraer definiciones del diccionario de la IEC"""
    acepcions = []
    
    # Buscar el div con id "Definition"
    definition_div = soup.find('div', id='Definition')
    
    if definition_div:
        # Buscar spans con clase "body" que contienen las definiciones
        body_spans = definition_div.find_all('span', class_='body')
        
        definicion_completa = ""
        
        for span in body_spans:
            texto = span.get_text().strip()
            
            # Filtrar spans que solo contienen etiquetas o información irrelevante
            if (len(texto) > 10 and 
                not texto.startswith('[') and 
                not texto.endswith(']') and
                len(texto) > 20):
                
                if definicion_completa:
                    definicion_completa += " "
                definicion_completa += texto
        
        if definicion_completa and len(definicion_completa) > 20:
            # Limpiar la definición
            definicion_limpia = re.sub(r'\s+', ' ', definicion_completa).strip()
            acepcions.append(f"1. {definicion_limpia}")
    
    return acepcions

def extraer_definiciones_diccionari_cat(soup, palabra):
    """Extraer definiciones de diccionari.cat"""
    acepcions = []
    
    # Buscar divs con definiciones
    definiciones_divs = soup.find_all('div', class_=['definicio', 'definition', 'def'])
    
    for div in definiciones_divs:
        texto = div.get_text().strip()
        if len(texto) > 20:
            acepcions.append(f"{len(acepcions)+1}. {texto}")
            if len(acepcions) >= 2:
                break
    
    return acepcions


def guardar_definiciones(palabras_definiciones):
    try:
        with open('./src/data/catala/5-definiciones.json', 'w', encoding='utf-8') as file:
            json.dump(palabras_definiciones, file, ensure_ascii=False, indent=4)
        # print(f'\nDefinicions guardades en "src/data/catala/5-definiciones.json".')
    except Exception as e:
        print(f"Error al guardar las definiciones en el archivo JSON: {e}")

def cargar_definiciones_existentes():
    """Carga las definiciones existentes del archivo JSON si existe"""
    try:
        with open('./src/data/catala/5-definiciones.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error al cargar definiciones existentes: {e}")
        return []

def traducir_definicion(definicion_catalan):
    """Traduce una definición del catalán al español usando la API de Softcatalà"""
    try:
        url = "https://www.softcatala.org/api/traductor/translate"
        
        # Configurar los headers exactos que especificaste
        headers = {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "es-ES,es;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_gid=GA1.2.1019954455.1752173127; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQUVhkAQUVhkAEsACBCABzFoAP_gAEPgAAiQK1ID_C7EbCFCiDp3IKMEMAhHABBAYsAwAAYBAwAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAVAABAAAwAIBAIIAAAgAAAAEAIAAAACIAAEQCAAAAEAEAAkAgAAAIASAAAAAAAAACBAAAAAAAAAAAAAAAABAAAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQR2QD-F2I2EKFEHCuQUYIYBCuACAAxYBgAAwCBgAAGCQgQAgFJIIkCAEAIEAAEAAAQAgCAABQABAAAIAAAAAqAACAABgAQCAQQIABAAAAgIAAAAAAEQAAIgEAAAAIAIABABAAAAQAkAAAAAAAAAECAAAAAAAAAAAAAAAAAAAAAEABgAAAAAABEAAAAAAAACAQIAAA.YAAAAGgAAAA%22%2C%222~61.89.122.184.196.230.314.318.442.445.494.550.576.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1765.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2387.2416.2501.2567.2568.2575.2657.2686.2778.2869.2878.2908.2920.2963.3005.3023.3100.3126.3219.3234.3235.3253.3309.3731.6931.8931.13731.15731~dv.%22%2C%22CE06CB5F-68EA-460B-AB45-011D7A1EBD17%22%5D%5D; sc-traductor=%7Csource-lang%3Dcat%7Ctarget-lang%3Dspa; _pk_ref.2.b21f=%5B%22%22%2C%22%22%2C1752175172%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.2.b21f=1; _gat=1; _pk_id.2.b21f=108ab19e6d70cc4b.1752173127.2.1752175498.1752173155.; _ga=GA1.1.1606752897.1752173127; __gads=ID=b61701a5babb6708:T=1752173126:RT=1752175497:S=ALNI_MZ3rsWUGKseM5xDHyRIRMtO0ED64Q; __gpi=UID=000010ed6ffa496d:T=1752173126:RT=1752175497:S=ALNI_MapvBPsaLHUrX2nF-uhmNoC7jdXlg; __eoi=ID=59154b77dcc25650:T=1752173126:RT=1752175497:S=AA-AfjZDVIBVoz4iUJCqxLJYfasA; FCNEC=%5B%5B%22AKsRol_mzCr_nX9xx1n2aVgPmA6XINXrgJghsprPoLmgtMAlZZV8VnVB01sDytraLa1awQavaB7IQZLQQNzJ0EjiA_-MNsv6uyE-SvblRkwiUA021sO1Jwu4AYaXxx3AZkgHTniuyoeDdVdI_7RWOKBFajFHJ8TJAg%3D%3D%22%5D%5D; _ga_8L2DZMHJ4K=GS2.1.s1752175172$o2$g1$t1752175507$j50$l0$h0",
            "Referer": "https://www.softcatala.org/traductor/"
        }
        
        # Preparar el cuerpo de la petición
        # URL encode del texto a traducir
        texto_encoded = urllib.parse.quote(definicion_catalan, safe='')
        body = f"langpair=cat%7Cspa&q={texto_encoded}&markUnknown=yes&key=NmQ3NmMyNThmM2JjNWQxMjkxN2N"
        
        # Hacer la petición POST
        response = requests.post(url, headers=headers, data=body, timeout=10)
        response.raise_for_status()
        
        # Parsear la respuesta JSON
        data = response.json()
        
        if (data.get('responseStatus') == 200 and 
            data.get('responseData') and 
            data['responseData'].get('translatedText')):
            
            return data['responseData']['translatedText']
        else:
            print(f"Error en la traducción: {data}")
            return definicion_catalan  # Devolver el original si falla
            
    except Exception as e:
        print(f"Error al traducir '{definicion_catalan}': {e}")
        return definicion_catalan  # Devolver el original si falla

def main():
    palabras = leer_palabras()
    if not palabras:
        print('No se pudieron obtener las palabras del archivo.')
        return
    
    # Cargar definiciones existentes
    palabras_definiciones = cargar_definiciones_existentes()
    palabras_procesadas = {item['palabra'] for item in palabras_definiciones}
    
    # Procesar todas las palabras desde el principio
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
        if (aceps and 
            aceps[0] != 'No s\'ha trobat la definició de la paraula al diccionari.' and 
            aceps[0] != 'No s\'ha pogut obtenir la definició.' and 
            aceps[0] != 'S\'ha produït un error inesperat en obtenir la definició.'):
            
            # Traducir cada definición del catalán al español
            acepciones_traducidas = []
            for acepcion in aceps[:2]:  # Solo las dos primeras
                print(f"    Traduciendo: {acepcion}")
                traduccion = traducir_definicion(acepcion)
                acepciones_traducidas.append(traduccion)
                print(f"    Traducido a: {traduccion}")
                # Pequeña pausa para no saturar la API
                time.sleep(0.1)
            
            palabras_definiciones.append({
                'palabra': palabra,
                'acepciones': acepciones_traducidas
            })
            palabras_encontradas += 1
            print(f"  ✓ Definiciones traducidas para '{palabra}' (total: {len(palabras_definiciones)})")
            
            # Guardar inmediatamente después de cada palabra exitosa
            guardar_definiciones(palabras_definiciones)
        else:
            print(f"  ✗ No se encontraron definiciones para '{palabra}', se omite del JSON")
    
    print(f"\nProcesadas {len(palabras)} palabras, encontradas definiciones para {len(palabras_definiciones)} palabras en total")
    print(f"Archivo final guardado en 'src/data/catala/5-definiciones.json'")

if __name__ == '__main__':
    # Ejecutar el script completo directamente
    print("Iniciando procesamiento de todas las palabras catalanas...")
    main()
