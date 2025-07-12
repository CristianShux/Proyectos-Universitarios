from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time
from pydantic import BaseModel, Field

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
        id_usuario: str


class EmpleadoBase2(BaseModel):
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
        id_usuario: int
        telefono: Optional[str] = None
        correo_electronico: Optional[str] = None
        calle: Optional[str] = None
        numero_calle: Optional[str] = None
        localidad: Optional[str] = None
        partido: Optional[str] = None  # Nueva variable agregada
        provincia: Optional[str] = None

class NominaBase(BaseModel):
    id_nomina: int
    id_empleado: int
    periodo: str
    fecha_de_pago: date

class NominaResponse(NominaBase):
    salario_base: float
    bono_presentismo: Optional[float] = None
    bono_antiguedad: Optional[float] = None
    horas_extra: Optional[float] = None
    descuento_jubilacion: Optional[float] = None
    descuento_obra_social: Optional[float] = None
    descuento_anssal: Optional[float] = None
    descuento_ley_19032: Optional[float] = None
    impuesto_ganancias: Optional[float] = None
    descuento_sindical: Optional[float] = None
    sueldo_bruto: float
    sueldo_neto: float
    tipo: str

class ReciboResponse(BaseModel):
    id_nomina: int
    nombre: str
    apellido: str
    tipo_identificacion: str
    numero_identificacion: str
    puesto: str
    categoria: str
    departamento: str
    tipo: str
    periodo: str
    fecha_de_pago: date
    banco: str
    numero_cuenta: str
    salario_base: float
    bono_presentismo: float
    bono_antiguedad: float
    horas_extra: float
    descuento_jubilacion: float
    descuento_obra_social: float
    descuento_anssal: float
    descuento_ley_19032: float
    impuesto_ganancias: float
    descuento_sindical: float
    sueldo_bruto: float
    sueldo_neto: float

class NominaListResponse(BaseModel):
    nominas: list[ReciboResponse]

class CalculoNominaRequest(BaseModel):
    id_empleado: int
    periodo: str
    fecha_calculo: date
    tipo: str
    id_usuario: int

class EmpleadoNominaRequest(BaseModel):
    id_empleado: int
    periodo: Optional[str] = None

class EmpleadoConsulta(BaseModel):
    numero_identificacion: str

class EmpleadoIDRequest(BaseModel):
    empleado_id: str

class EmpleadoPeriodoRequest(BaseModel):
    empleado_id: str
    año: Optional[int] = None
    mes: Optional[int] = None

class HorasRequest(BaseModel):
    empleado_id: str
    año: int
    mes: int

class BuscarEmpleadoRequest(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    dni: Optional[str] = None
    pagina: int = 1
    por_pagina: int = 10

class EmpleadoIDIntRequest(BaseModel):
    empleado_id: int

class LoginRequest(BaseModel):
    username: str
    password: str

class Permisos(BaseModel):
    online_login: bool
    offline_login: bool
    ver_datos_personales: bool
    editar_datos_personales: bool
    ver_datos_laborales: bool
    agregar_datos_laborales: bool
    editar_datos_laborales: bool
    agregar_empleado: bool
    ver_registro_asistencia: bool
    ver_informacion_bancaria: bool
    editar_informacion_bancaria: bool
    ingresar_asistencia: bool
    ingresar_inasistencia: bool
    ver_historial_nominas: bool
    calcular_nomina_manualmente: bool
    calcular_nomina_automaticamente: bool
    agregar_concepto: bool
    agregar_departamento: bool
    agregar_puesto: bool
    agregar_categoria: bool
    agregar_salario_con_vigencia: bool
    ver_vista_previa_recibo_sueldo: bool
    descargar_recibo_sueldo: bool
    ver_reportes: bool
    cerrar_sesion: bool

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    permisos: Permisos
    rol: str
    id_empleado: int
    numero_identificacion: str
    id_usuario: int

class RegistroUpdate(BaseModel):
    tipo: Optional[str] = None
    fecha: Optional[date] = None
    hora: Optional[time] = None
    estado_asistencia: Optional[str] = None
    turno_asistencia: Optional[str] = None
    puesto_del_asistente: Optional[str] = None
    vector_capturado: Optional[str] = None

class CrearUsuarioRequest(BaseModel):
    id_empleado: int
    id_rol: int
    nombre_usuario: str
    contrasena: str
    motivo: Optional[str] = None

class UsuarioModel(BaseModel):
    id_usuario: int
    id_empleado: int
    id_rol: int
    nombre_usuario: str
    contrasena: str
    esta_activo: bool
    fecha_activacion: date | None
    fecha_creacion: date | None
    motivo: str | None

class Permisos(BaseModel):
    online_login: bool = False
    offline_login: bool = False
    ver_datos_personales: bool = False
    editar_datos_personales: bool = False
    ver_datos_laborales: bool = False
    agregar_datos_laborales: bool = False
    editar_datos_laborales: bool = False
    agregar_empleado: bool = False
    ver_registro_asistencia: bool = False
    ver_informacion_bancaria: bool = False
    editar_informacion_bancaria: bool = False
    ingresar_asistencia: bool = False
    ingresar_inasistencia: bool = False
    ver_historial_nominas: bool = False
    calcular_nomina_manualmente: bool = False
    calcular_nomina_automaticamente: bool = False
    agregar_concepto: bool = False
    agregar_departamento: bool = False
    agregar_puesto: bool = False
    agregar_categoria: bool = False
    agregar_salario_con_vigencia: bool = False
    ver_vista_previa_recibo_sueldo: bool = False
    descargar_recibo_sueldo: bool = False
    ver_reportes: bool = False
    cerrar_sesion: bool = False



class CuentaBancariaInput(BaseModel):
    codigo_banco: str
    numero_cuenta: str
    tipo_cuenta: str

class CuentaBancariaModificar(BaseModel):
    nombre_banco: str = Field(alias="codigo_banco")
    numero_cuenta: str
    tipo_cuenta: str
    
class SalarioInput(BaseModel):
    puesto_id: int
    departamento_id: int
    categoria_id: int
    valor_por_defecto: float
    fecha_inicio: str    

class ConceptoInput(BaseModel):
    descripcion: str
    tipo_concepto: str
    valor_por_defecto: Optional[float] = None
    es_porcentaje: Optional[bool] = False

class ConceptoOutput(BaseModel):
    codigo: str
    descripcion: str
    tipo_concepto: str
    valor_por_defecto: float | None
    es_porcentaje: bool

class ConceptoUpdate(BaseModel):
    descripcion: Optional[str] = None
    tipo_concepto: Optional[str] = None
    valor_por_defecto: Optional[float] = None
    es_porcentaje: Optional[bool] = None

class JornadaRequest(BaseModel):
    id_empleado: int
    fecha: date
    dia: str
    hora_entrada: time
    hora_salida: time
    estado_jornada: str
    horas_normales_trabajadas: float
    horas_extra: float
    motivo: str

class JornadaParcialRequest(BaseModel):
    id_empleado: int
    fecha: date
    hora_entrada: time | None = None
    hora_salida: time | None = None
    motivo: str

class IncidenciaAsistenciaRequest(BaseModel):
    id_empleado: int
    fecha: date
    dia: str
    tipo: str
    descripcion: str
    
class AsistenciaBiometricaRequest(BaseModel):
    id_empleado: int
    fecha: date
    tipo: str
    hora: time
    estado_asistencia: str
    turno_asistencia: str
    
class PuestoInput(BaseModel):
    nombre: str 


class DepartamentoInput(BaseModel):
    nombre: str 
    descripcion: str 


class CategoriaInput(BaseModel):
    nombre_categoria: str 
    

class ConfigAsistenciaUpdate(BaseModel):
    valor: str 
    
class InformacionLaboral(BaseModel):
    id_empleado: int
    id_departamento: int
    id_puesto: int
    id_categoria: int
    fecha_ingreso: date            
    turno: str
    hora_inicio_turno: time        
    hora_fin_turno: time           
    cantidad_horas_trabajo: int
    tipo_contrato: str
    estado: str
    tipo_semana_laboral: str
