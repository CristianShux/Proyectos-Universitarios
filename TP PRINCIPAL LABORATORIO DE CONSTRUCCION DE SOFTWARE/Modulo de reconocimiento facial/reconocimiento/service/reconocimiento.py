import numpy as np

from crud.database import db
from reconocimiento.utils.cifrado import descifrar_vector
from reconocimiento.utils.utilsVectores import cargar_vectores, UMBRAL, cargar_vectores_por_tipo

from reconocimiento.utils.utils_gestos import detectar_sonrisa, detectar_giro, detectar_cejas_levantadas

UMBRAL_GESTO = 0.35  # 🔧 Ajusta según pruebas

GESTOS_VALIDOS = {
    "sonrisa": detectar_sonrisa,
    "giro": detectar_giro,
    "cejas": detectar_cejas_levantadas
}

def identificar_persona(vector_actual):
    """Compara el rostro detectado con los registrados para identificar a la persona."""

    if vector_actual is None or not isinstance(vector_actual, np.ndarray):
        print("❌ Error: Datos inválidos en identificación facial")
        return None, None

    vector_actual = vector_actual.astype(np.float64)  # 👈 Asegura tipo correcto

    vectores_neutros = cargar_vectores_por_tipo("neutro")

    for persona_id, vectores_guardados in vectores_neutros.items():
        for tipo, vector_guardado in vectores_guardados.items():
            vector_guardado = vector_guardado.astype(np.float64)  # 👈 Asegura tipo correcto
            print(f"🧪 Tipos: actual={vector_actual.dtype}, guardado={vector_guardado.dtype}")
            distancia = np.linalg.norm(vector_actual - vector_guardado)
            if distancia < UMBRAL:
                return persona_id, distancia  # Persona reconocida

    return None, None  # No se encontró coincidencia


def identificar_gesto(image_np, gesto_requerido):
    if gesto_requerido == "sonrisa":
        return detectar_sonrisa(image_np)
    elif gesto_requerido == "giro":
        return detectar_giro(image_np)
    elif gesto_requerido == "cejas":
        return detectar_cejas_levantadas(image_np)
    return False

def buscar_mejor_match(vector_actual):
    """
    Compara el vector_actual contra todos los vectores 'neutro' guardados en la DB
    y devuelve (id_empleado, distancia) si encuentra un match dentro del umbral.
    Si un vector es inválido, lo saltea sin cortar la ejecución.
    """
    try:
        conn = db.get_connection()
        cur = conn.cursor()

        query = """
            SELECT id_empleado, vector_biometrico
            FROM dato_biometrico_facial
            WHERE tipo_vector = 'Neutro'
        """
        cur.execute(query)
        resultados = cur.fetchall()

        mejor_match = None
        menor_distancia = float('inf')

        for id_empleado, vector_cifrado in resultados:
            try:
                vector_guardado = descifrar_vector(vector_cifrado)

                if vector_guardado is None or not isinstance(vector_guardado, np.ndarray):
                    print(f"⚠️ Vector inválido para {id_empleado}, salteando...")
                    continue

                distancia = np.linalg.norm(vector_actual - vector_guardado)

                print(f"🧪 Comparando con {id_empleado}, distancia={distancia:.4f}")

                if distancia < UMBRAL and distancia < menor_distancia:
                    mejor_match = id_empleado
                    menor_distancia = distancia

            except Exception as e:
                print(f"⚠️ Error procesando vector de {id_empleado}, se omite: {e}")
                continue

        return (mejor_match, menor_distancia) if mejor_match else (None, None)

    except Exception as e:
        print(f"❌ Error en la comparación de vectores: {e}")
        return None, None

    finally:
        cur.close()
        db.return_connection(conn)
