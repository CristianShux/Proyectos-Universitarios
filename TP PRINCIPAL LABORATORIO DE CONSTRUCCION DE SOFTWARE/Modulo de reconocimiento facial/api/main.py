
from fastapi import FastAPI, HTTPException, Depends, WebSocket, status
from typing import Optional
from datetime import datetime, date, time

from crud.crudAdmintrador import AdminCRUD
from crud.crudEmpleado import RegistroHorario
from crud.crudEmpleado import Empleado
from pydantic import BaseModel, Field
from typing import Tuple, List

from reconocimiento.serverReconocimiento import registrar_empleado, verificar_identidad
from .schemas import (EmpleadoResponse, EmpleadoBase, EmpleadoUpdate)
from crud.database import db
from fastapi.middleware.cors import CORSMiddleware


class AsistenciaManual(BaseModel):
    id_empleado: int
    tipo: str
    fecha: date
    hora: time
    estado_asistencia: Optional[str] = None


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)


@app.get("/health")
def health_check():
    """
    Verifica el estado de la API y conexión a la base de datos
    Returns:
        {
            "status": "healthy"|"unhealthy",
            "database": true|false,
            "timestamp": "ISO-8601",
            "details": {
                "database_status": "string"
            }
        }
    """
    try:
        # Verificar conexión a la base de datos
        db_ok = db.health_check()

        status = "healthy" if db_ok else "unhealthy"

        return {
            "status": status,
            "database": db_ok,
            "timestamp": datetime.utcnow().isoformat(),
            "details": {
                "database_status": "Connected" if db_ok else "Disconnected"
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.post("/empleados/", response_model=EmpleadoBase)
async def crear_empleado(empleado: EmpleadoBase):
    try:
        print(f"[API] Inicio creación empleado - Datos recibidos:")
        print(f"Nombre: {empleado.nombre}")
        print(f"Apellido: {empleado.apellido}")
        # Agrega logs para otros campos importantes

        empleado_creado = AdminCRUD.crear_empleado(empleado)
        print("[API] Empleado creado exitosamente")
        return empleado_creado
    except ValueError as e:
        print(f"[API] Error de valor: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"[API] Error inesperado:\n{tb}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

@app.get("/empleados/{numero_identificacion}")
def obtener_empleado(numero_identificacion: str):
    empleado = AdminCRUD.obtener_detalle_empleado(numero_identificacion)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

@app.delete("/empleados/{id_empleado}", status_code=status.HTTP_204_NO_CONTENT)
async def borrar_empleado(
        id_empleado: int,
        empleado_crud: Empleado = Depends()
):
    """
    Elimina un empleado por su ID.

    Devuelve:
    - 204 No Content si se borró correctamente
    - 404 Not Found si el empleado no existe
    - 400 Bad Request si hay un error en la operación
    """
    try:
        borrado_exitoso = empleado_crud.borrar_por_id(id_empleado)
        if not borrado_exitoso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empleado no encontrado"
            )
        return EmpleadoResponse(status_code=status.HTTP_204_NO_CONTENT)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/registros/{empleado_id}")
def obtener_registros(
    empleado_id: str,
    año: Optional[int] = None,
    mes: Optional[int] = None
):
    if año and mes:
        registros = RegistroHorario.obtener_registros_mensuales(empleado_id, año, mes)
    else:
        registros = RegistroHorario.obtener_todos_los_registros(empleado_id)
    return [r for r in registros]

@app.get("/registroscompleto/{empleado_id}")
def obtener_registros(empleado_id: str):

    registros = RegistroHorario.obtener_todos_los_registros(empleado_id)
    return [r for r in registros]

# Creo que está bien, tengo que verificarlo con un registro de la base de datos
@app.get("/horas/{empleado_id}")
def calcular_horas(empleado_id: str, año: int, mes: int):
    horas = RegistroHorario.calcular_horas_mensuales(empleado_id, año, mes)
    return {"horas_trabajadas": horas}

# Actualizar datos de empleado
@app.put("/empleados/{empleado_id}/datos-personales")
def actualizar_datos_empleado(
    empleado_id: int,
    datos: EmpleadoUpdate,
    # Agregar autenticación para que solo el empleado o admin pueda actualizar
):
    try:
        empleado_actualizado = Empleado.actualizar_datos_personales(
            id_empleado=empleado_id,
            telefono=datos.telefono,
            correo_electronico=datos.correo_electronico,
            calle=datos.calle,
            numero_calle=datos.numero_calle,
            localidad=datos.localidad,
            partido=datos.partido,  # Nueva variable agregada
            provincia=datos.provincia
        )
        return empleado_actualizado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



# Registro manual de asistencia (admin)
@app.post("/admin/registros/manual", tags=["Admin"])
def registrar_asistencia_manual(
    registro: AsistenciaManual,
    # Agrega dependencia de autenticación de admin:
    # current_user: dict = Depends(verificar_admin)
):
    try:
        nuevo_registro = RegistroHorario.registrar_asistencia_manual(
            id_empleado=registro.id_empleado,
            tipo=registro.tipo,
            fecha=registro.fecha,
            hora=registro.hora,
            estado_asistencia=registro.estado_asistencia
        )
        return nuevo_registro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

# Obtener todos los empleados (para listados)
@app.get("/empleados/")
def listar_empleados():
    try:
        empleados = AdminCRUD.obtener_empleado()
        return [e for e in empleados]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Búsqueda avanzada de empleados
@app.get("/empleados/buscar/", response_model=Tuple[List[EmpleadoResponse], int])  # <- Cambiado a Tuple
def buscar_empleados(
    nombre: Optional[str] = None,
    apellido: Optional[str] = None,
    dni: Optional[str] = None,
    pagina: int = 1,
    por_pagina: int = 10
):
    return AdminCRUD.buscar_avanzado(nombre, apellido, dni, pagina, por_pagina)

@app.get("/empleados/{empleado_id}/informacion-laboral")
def obtener_informacion_laboral(empleado_id: int):
    try:
        info = AdminCRUD.buscar_informacion_laboral_por_id_empleado(empleado_id)
        if info:
            return {
                "departamento": info[0],
                "puesto": info[1],
                "turno": info[2],
                "horario_entrada": str(info[3]),
                "horario_salida": str(info[4]),
                "fecha_ingreso": info[5].strftime('%Y-%m-%d'),
                "tipo_contrato": info[6]
            }
        raise HTTPException(status_code=404, detail="No encontrado")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/{empleado_id}/puesto")
def obtener_puesto_empleado(empleado_id: int):
    try:
        puesto = AdminCRUD.obtener_puesto_por_id_empleado(empleado_id)
        if puesto:
            return {"puesto": puesto}
        raise HTTPException(status_code=404, detail="Puesto no encontrado para el empleado especificado")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/{empleado_id}/categoria")
def obtener_categoria_empleado(empleado_id: int):
    try:
        categoria = AdminCRUD.obtener_categoria_por_id_empleado(empleado_id)
        if categoria:
            return {"categoria": categoria}
        raise HTTPException(status_code=404, detail="Categoría no encontrada para el empleado especificado")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/{empleado_id}/departamento")
def obtener_departamento_empleado(empleado_id: int):
    try:
        departamento_info = AdminCRUD.obtener_departamento_por_id_empleado(empleado_id)
        if departamento_info:
            return {
                "departamento": departamento_info[0],
                "descripcion": departamento_info[1] if departamento_info[1] else "Sin descripción"
            }
        raise HTTPException(status_code=404, detail="Departamento no encontrado para el empleado especificado")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket abierto, esperando imágenes...")

    while True:
        try:
            data = await websocket.receive_json()
            id_empleado = data.get("id_empleado")
            registrar = data.get("registrar", False)

            if registrar and id_empleado:
                await registrar_empleado(websocket, data, id_empleado)
            else:
                await verificar_identidad(websocket, data)

        except Exception as e:
            print("❌ Error en el procesamiento:", e)
            break
