from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from auth.jwt import verificar_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def obtener_usuario_actual(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload  # contiene username, id_empleado, rol

def solo_admin_rrhh(usuario = Depends(obtener_usuario_actual)):
    if usuario["rol"] != "admin_rrhh":
        raise HTTPException(status_code=403, detail="No autorizado")
    return usuario

def solo_empleado(usuario = Depends(obtener_usuario_actual)):
    if usuario["rol"] != "empleado":
        raise HTTPException(status_code=403, detail="No autorizado")
    return usuario
