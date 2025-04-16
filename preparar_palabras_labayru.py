from bs4 import BeautifulSoup
import requests
import json
import random
from datetime import datetime

# Encabezado para simular una solicitud de un navegador real
HEADER = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

def leer_palabras():
    try:
        with open('5.json', 'r', encoding='utf-8') as file:
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
        url = f'https://hiztegia.labayru.eus/bilatu/LH/eu/{palabra}?locale=es'
        request = requests.get(url)
        request.raise_for_status()
        soup = BeautifulSoup(request.text, 'lxml')

        acepciones = []
        
        # Iterar sobre los bloques de resultados
        for result_block in soup.find_all('div', class_='results-block'):
            # Obtener el contenido del span con la clase 'bilatuHitza'
            span_bilatuHitza = result_block.find('span', class_='bilatuHitza')
            if not span_bilatuHitza:
                continue
            
            # Obtener el texto del span
            span_text = span_bilatuHitza.get_text(strip=True)
            
            # Obtener el contenido del strong
            strong = result_block.find('strong')
            strong_text = strong.get_text(strip=True)
            
            # Comprobar si el contenido del strong es exactamente igual al del span
            if span_text == palabra and strong_text == span_text:
                for acep in result_block.find_all('dd'):
                    try:
                        numero = acep.find('span', class_='numero-acepcion').get_text(strip=True)
                    except:
                        numero = '1'
                    
                    try:
                        categoria = acep.find('span', class_='info-acepcion').get_text(strip=True) + ' '
                    except:
                        categoria = ''
                    
                    palabras = []
                    equivalencias = acep.find('div', class_='blockEquivalencias')
                    if equivalencias:
                        for elemento in equivalencias.children:
                            if isinstance(elemento, str):
                                # Mantener el texto y procesar signos de puntuación
                                text = elemento.strip()
                                if text:
                                    palabras.append(text)
                            elif elemento.name == 'a':
                                palabras.append(elemento.get_text(strip=True))
                            elif elemento.name == 'span':
                                if 'equivalencia-word' in elemento.get('class', []):
                                    # Añadir el texto seguido de un espacio si no está vacío
                                    text = elemento.get_text(strip=True)
                                    if text:
                                        palabras.append(text + ' ')
                                elif 'notasSemanticas' in elemento.get('class', []):
                                    # Añadir espacio al inicio del texto
                                    text = elemento.get_text(strip=True)
                                    if text:
                                        palabras.append(' ' + text)
                                else:
                                    palabras.append(elemento.get_text(strip=True))

                    # Unir las palabras y añadir punto y espacio solo después de signos de puntuación
                    acepcion_texto = f"{numero}. {categoria}{''.join(palabras).strip()}"
                    acepciones.append(acepcion_texto)

        if not acepciones:
            return ['La palabra que has indicado no está recogida en el diccionario.']

        return acepciones

    except requests.exceptions.RequestException as e:
        print(f"Error en la petición HTTP: {e}")
        return ['No se pudo obtener la definición.']
    except Exception as e:
        print(f"Error al procesar la palabra '{palabra}': {e}")
        return ['Ocurrió un error inesperado al obtener la definición.']


def guardar_definiciones(palabras_definiciones):
    try:
        with open('./5-definiciones-labayru.json', 'w', encoding='utf-8') as file:
            json.dump(palabras_definiciones, file, ensure_ascii=False, indent=4)
        print(f'\nDefiniciones guardadas en "5-definiciones.json".')
    except Exception as e:
        print(f"Error al guardar las definiciones en el archivo JSON: {e}")

def main():
    palabras = leer_palabras()
    if not palabras:
        print('No se pudieron obtener las palabras del archivo.')
        return
    
    palabras_definiciones = []
    
    for palabra in palabras:
        print(f'Obteniendo definición de {palabra}...')
        aceps = acepciones(palabra)
        palabras_definiciones.append({
            'palabra': palabra,
            'acepciones': aceps[:2]  # Limita las acepciones a las dos primeras
        })
    
    guardar_definiciones(palabras_definiciones)

if __name__ == '__main__':
    main()

# print(acepciones('agur'))
# print(acepciones('abonu'))
# # acepciones('abonu')