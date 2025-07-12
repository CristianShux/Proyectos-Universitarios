from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "una-clave-secreta-supersegura"
ALGORITHM = "HS256"
EXPIRATION_MINUTES = 60 * 24  # 1 día

def crear_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None