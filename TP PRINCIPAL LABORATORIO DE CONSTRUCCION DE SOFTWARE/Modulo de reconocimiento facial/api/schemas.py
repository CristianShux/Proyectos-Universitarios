from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class EmpleadoResponse(BaseModel):
    """Modelo SOLO para respuestas (GET)"""
    id_empleado: int
    nombre: str
    apellido: str
    tipo_identificacion: str
    numero_identificacion: str
    fecha_nacimiento: date  # Ajusta el tipo según tu BD
    correo_electronico: Optional[str] = None
    telefono: Optional[str] = None
    calle: Optional[str] = None
    numero_calle: Optional[str] = None
    localidad: Optional[str] = None
    partido: Optional[str] = None
    provincia: Optional[str] = None
    genero: Optional[str] = None
    nacionalidad: Optional[str] = None
    estado_civil: Optional[str] = None

class EmpleadoBase(BaseModel):
        nombre: str
        apellido: str
        tipo_identificacion: str
        numero_identificacion: str
        fecha_nacimiento: str
        correo_electronico: str
        telefono: str
        calle: str
        numero_calle: str
        localidad: str
        partido: str
        provincia: str
        genero: str
        pais_nacimiento: str
        estado_civil: str

class EmpleadoUpdate(BaseModel):
        telefono: Optional[str] = None
        correo_electronico: Optional[str] = None
        calle: Optional[str] = None
        numero_calle: Optional[str] = None
        localidad: Optional[str] = None
        partido: Optional[str] = None  # Nueva variable agregada
        provincia: Optional[str] = None

