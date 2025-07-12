from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def registrar_evento_sistema(conn, id_usuario: int, tipo_evento: str, descripcion: str):
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO evento_sistema (id_usuario, tipo_evento, descripcion)
                VALUES (%s, %s, %s)
            """, (id_usuario, tipo_evento, descripcion))
    except Exception as e:
        print(f"[ERROR] No se pudo registrar el evento: {e}")