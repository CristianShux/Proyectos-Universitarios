import json

import numpy as np
from cryptography.fernet import Fernet, InvalidToken

# Podés generar una key una vez y guardarla segura (por ejemplo, en una variable de entorno o archivo)
# key = Fernet.generate_key()
# print(key)  # GUARDAR esto

FERNET_KEY = b'esto es privado'
fernet = Fernet(FERNET_KEY)

def cifrar_vector(vector_np):
    vector_json = json.dumps(vector_np.tolist()).encode("utf-8")
    return fernet.encrypt(vector_json)

def descifrar_vector(data):
    """
    Intenta descifrar el vector si fue cifrado con Fernet.
    Si falla, intenta interpretarlo como JSON plano.
    Si todo falla, devuelve None.
    """
    if not data:
        print("⚠️ Vector vacío o nulo recibido.")
        return None

    # Convertir memoryview a bytes
    if isinstance(data, memoryview):
        data = data.tobytes()

    # Si es string hexadecimal tipo "\\x...", convertirlo a bytes reales
    if isinstance(data, str):
        try:
            data = bytes.fromhex(data[2:] if data.startswith("\\x") else data)
        except ValueError:
            data = data.encode("utf-8")

    # Intentar descifrado
    try:
        json_bytes = fernet.decrypt(data)
        vector_list = json.loads(json_bytes.decode("utf-8"))
        return np.array(vector_list, dtype=np.float64)
    except (InvalidToken, json.JSONDecodeError, TypeError, ValueError) as e:
        print(f"⚠️ No se pudo descifrar: {e}")

    # Fallback: intentar como JSON plano
    try:
        if isinstance(data, bytes):
            data = data.decode("utf-8")
        vector_list = json.loads(data)
        return np.array(vector_list, dtype=np.float64)
    except Exception as e:
        print(f"❌ No se pudo interpretar el vector ni como cifrado ni plano: {e}")
        return None
