import uuid
from datetime import datetime, timedelta, date, time
import io

from .database import db, Database
import cloudinary
import cloudinary.uploader
import psycopg2

from crud import validacion_entrada

db = Database()  # O como se llame tu clase
db._initialize_pool()

class Empleado:
    def __init__(self, id_empleado=None, nombre=None, apellido=None, tipo_identificacion=None,
                 numero_identificacion=None, fecha_nacimiento=None, correo_electronico=None,
                 telefono=None, calle=None, numero_calle=None, localidad=None, partido=None, provincia=None,
                 genero=None, pais_nacimiento=None, estado_civil=None):

        # Validar provincia
        provincias_validas = ['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
                              'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
                              'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
                              'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
                              'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
                              'Ciudad Autónoma de Buenos Aires']
        if provincia and provincia not in provincias_validas:
            raise ValueError(f"Provincia inválida. Opciones válidas: {provincias_validas}")

        # Validar nacionalidad
        nacionalidades_validas = ['Argentina', 'Brasil', 'Chile', 'Uruguay', 'Paraguay',
                                  'Bolivia', 'Perú', 'Ecuador', 'Colombia', 'Venezuela', 'México']
        if pais_nacimiento and pais_nacimiento not in nacionalidades_validas:
            raise ValueError(f"Nacionalidad inválida. Opciones válidas: {nacionalidades_validas}")

        # Validar tipo_identificacion
        tipos_id_validos = ['DNI', 'Pasaporte', 'Cédula']
        if tipo_identificacion and tipo_identificacion not in tipos_id_validos:
            raise ValueError(f"Tipo de identificación inválido. Opciones válidas: {tipos_id_validos}")

        # Validar género
        generos_validos = ['Masculino', 'Femenino', 'No binario', 'Prefiere no especificar', 'Otro']
        if genero and genero not in generos_validos:
            raise ValueError(f"Género inválido. Opciones válidas: {generos_validos}")

        self.id_empleado = id_empleado
        self.nombre = nombre
        self.apellido = apellido
        self.tipo_identificacion = tipo_identificacion
        self.numero_identificacion = numero_identificacion
        self.fecha_nacimiento = fecha_nacimiento
        self.correo_electronico = correo_electronico
        self.telefono = telefono
        self.calle = calle
        self.numero_calle = numero_calle
        self.localidad = localidad
        self.partido = partido
        self.provincia = provincia
        self.genero = genero
        self.pais_nacimiento = pais_nacimiento
        self.estado_civil = estado_civil

    @staticmethod
    def crear(id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion,
            fecha_nacimiento, correo_electronico, telefono, calle, numero_calle, localidad,
            partido, provincia, genero, pais_nacimiento, estado_civil):
        """Crea un nuevo empleado"""
        conn = None
        try:
            with db.conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO empleado (id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion, 
                    fecha_nacimiento, correo_electronico, telefono, calle, numero_calle, localidad, partido, provincia, 
                    genero, pais_nacimiento, estado_civil)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id_empleado
                    """,
                    (
                        str(uuid.uuid4()),  # Generamos nuevo UUID
                        nombre,
                        apellido,
                        tipo_identificacion,
                        numero_identificacion,
                        fecha_nacimiento,
                        correo_electronico,
                        telefono,
                        calle,
                        numero_calle,
                        localidad,
                        partido,
                        provincia,
                        genero,
                        pais_nacimiento,
                        estado_civil
                    )
                )
                id_empleado = cur.fetchone()[0]
                db.conn.commit()
                return Empleado.obtener_por_id(id_empleado)
        except Exception as e:
            db.conn.rollback()
            raise ValueError(f"Error al crear empleado: {e}")

    @staticmethod
    def obtener_por_id(id_empleado):
        """Obtiene un empleado por su ID"""
        conn = None
        try:
            conn = db.get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id_empleado, nombre, apellido, tipo_identificacion, 
                           numero_identificacion, fecha_nacimiento, correo_electronico, 
                           telefono, calle, numero_calle, localidad, partido, provincia, 
                           genero, pais_nacimiento, estado_civil
                    FROM empleado
                    WHERE id_empleado = %s
                    """,
                    (str(id_empleado),)
                )
                result = cur.fetchone()

                if result:
                    return Empleado(
                        id_empleado=result[0],
                        nombre=result[1],
                        apellido=result[2],
                        tipo_identificacion=result[3],
                        numero_identificacion=result[4],
                        fecha_nacimiento=result[5],
                        correo_electronico=result[6],
                        telefono=result[7],
                        calle=result[8],
                        numero_calle=result[9],
                        localidad=result[10],
                        partido=result[11],
                        provincia=result[12],
                        genero=result[13],
                        pais_nacimiento=result[14],
                        estado_civil=result[15]
                    )
                return None
        except Exception as e:
            print(f"Error al obtener empleado: {e}")
            return None
        finally:
            if conn:
                db.return_connection(conn)


    @staticmethod
    def borrar_por_id(id_empleado):
        """Elimina un empleado por su ID"""
        with db.conn.cursor() as cur:
            try:
                # Primero verificamos si el empleado existe
                cur.execute(
                    "SELECT id_empleado FROM empleado WHERE id_empleado = %s",
                    (str(id_empleado),)
                )
                if not cur.fetchone():
                    return False  # No existe el empleado

                # Si existe, procedemos a borrar
                cur.execute(
                    "DELETE FROM empleado WHERE id_empleado = %s",
                    (str(id_empleado),)
                )
                db.conn.commit()
                return True  # Borrado exitoso

            except Exception as e:
                db.conn.rollback()
                raise ValueError(f"Error al borrar empleado: {str(e)}")

    @staticmethod
    def obtener_por_numero_identificacion(numero_identificacion):
        """Obtiene un empleado por su número de identificación"""
        with db.conn.cursor() as cur:
            cur.execute(
                """
                SELECT id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion, 
                    fecha_nacimiento, correo_electronico, telefono, calle, numero_calle, 
                    localidad, partido, provincia, genero, pais_nacimiento, estado_civil
                FROM empleado
                WHERE numero_identificacion = %s
                """,
                (numero_identificacion,)
            )
            result = cur.fetchone()
            if result:
                return Empleado(
                    id_empleado=result[0],
                    nombre=result[1],
                    apellido=result[2],
                    tipo_identificacion=result[3],
                    numero_identificacion=result[4],
                    fecha_nacimiento=result[5],
                    correo_electronico=result[6],
                    telefono=result[7],
                    calle=result[8],
                    numero_calle=result[9],
                    localidad=result[10],
                    partido=result[11],
                    provincia=result[12],
                    genero=result[13],
                    pais_nacimiento=result[14],
                    estado_civil=result[15]
                )
            return None

    @staticmethod
    def actualizar_datos_personales(id_empleado: int,
                                    telefono: str = None,
                                    correo_electronico: str = None,
                                    calle: str = None,
                                    numero_calle: str = None,
                                    localidad: str = None,
                                    partido: str = None,
                                    provincia: str = None):
        """
        Actualiza los datos personales de un empleado. Solo actualiza los campos recibidos.

        Returns:
            Objeto Empleado actualizado o lanza ValueError
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            # Validar correo electrónico único si se quiere actualizar
            if correo_electronico:
                cur.execute("""
                    SELECT 1 FROM empleado 
                    WHERE correo_electronico = %s AND id_empleado != %s
                """, (correo_electronico, id_empleado))
                if cur.fetchone():
                    raise ValueError("El correo electrónico ya está en uso por otro empleado.")

            #Valida si los formatos que tienen son validos
            validacion_entrada.validar_actualizar_datos_empleado(
                telefono,
                correo_electronico,
                calle,
                numero_calle,
                localidad,
                partido,
                provincia,
            )

            # Armar consulta dinámica
            campos = []
            valores = []

            if telefono: campos.append("telefono = %s"); valores.append(telefono)
            if correo_electronico: campos.append("correo_electronico = %s"); valores.append(correo_electronico)
            if calle: campos.append("calle = %s"); valores.append(calle)
            if numero_calle: campos.append("numero_calle = %s"); valores.append(numero_calle)
            if localidad: campos.append("localidad = %s"); valores.append(localidad)
            if partido: campos.append("partido = %s"); valores.append(partido)
            if provincia: campos.append("provincia = %s"); valores.append(provincia)

            if not campos:
                raise ValueError("No se proporcionaron datos para actualizar.")

            # Ejecutar update
            query = f"""
                UPDATE empleado
                SET {', '.join(campos)}
                WHERE id_empleado = %s
                RETURNING id_empleado
            """
            valores.append(id_empleado)

            cur.execute(query, valores)
            if cur.rowcount == 0:
                raise ValueError("No se encontró el empleado con ese ID.")

            conn.commit()
            return Empleado.obtener_por_id(id_empleado)

        except Exception as e:
            try:
                conn.rollback()
            except:
                pass
            raise ValueError(f"Error al actualizar datos: {str(e)}")

        finally:
            try:
                db.return_connection(conn)
            except:
                pass





class RegistroHorario:
    def __init__(self, id_asistencia_biometrica, id_empleado, tipo, fecha, hora,
                 estado_asistencia, turno_asistencia, puesto_del_asistente, vector_capturado):
        self.id_asistencia_biometrica = id_asistencia_biometrica
        self.id_empleado = id_empleado
        self.tipo = tipo
        self.fecha = fecha
        self.hora = hora
        self.estado_asistencia = estado_asistencia
        self.turno_asistencia = turno_asistencia
        self.puesto_del_asistente = puesto_del_asistente
        self.vector_capturado = vector_capturado

    @staticmethod
    def registrar_asistencia(id_empleado: int, vector_biometrico: str):
        """
        Registra una nueva asistencia biométrica con toda la lógica de validación

        Args:
            id_empleado (int): ID del empleado
            vector_biometrico (str): Vector biométrico capturado

        Returns:
            RegistroHorario: Instancia del nuevo registro

        Raises:
            ValueError: Si hay error en los datos o en la operación
        """
        try:
            with db.conn.cursor() as cur:
                # 1. Recuperar información laboral del empleado
                cur.execute(
                    "SELECT puesto, turno, hora_inicio_turno, hora_fin_turno "
                    "FROM informacion_laboral WHERE id_empleado = %s",
                    (id_empleado,)
                )
                resultado = cur.fetchone()

                if not resultado:
                    raise ValueError("No se encontró información laboral para el empleado")

                puesto, turno, hora_inicio_turno, hora_fin_turno = resultado

                # 2. Determinar tipo y estado de la asistencia
                now = datetime.now()
                fecha_actual = now.date()
                hora_actual = now.time()

                # Convertir a datetime para comparaciones
                entrada_dt = datetime.combine(fecha_actual, hora_inicio_turno)
                salida_dt = datetime.combine(fecha_actual, hora_fin_turno)
                actual_dt = datetime.combine(fecha_actual, hora_actual)

                # Tolerancias
                tiempo_permitido_entrada_temprana = timedelta(minutes=60)
                tolerancia_a_tiempo = timedelta(minutes=5)
                retraso_minimo = timedelta(minutes=15)

                # Lógica de determinación
                if entrada_dt - tiempo_permitido_entrada_temprana < actual_dt < entrada_dt:
                    tipo = "Entrada"
                    estado_asistencia = "Temprana"
                elif entrada_dt <= actual_dt <= entrada_dt + tolerancia_a_tiempo:
                    tipo = "Entrada"
                    estado_asistencia = "A tiempo"
                elif entrada_dt + tolerancia_a_tiempo < actual_dt <= entrada_dt + retraso_minimo:
                    tipo = "Entrada"
                    estado_asistencia = "Retraso minimo"
                elif entrada_dt + retraso_minimo < actual_dt < salida_dt - timedelta(hours=3):
                    tipo = "Entrada"
                    estado_asistencia = "Tarde"
                elif salida_dt - timedelta(minutes=30) <= actual_dt <= salida_dt + timedelta(minutes=30):
                    tipo = "Salida"
                    if actual_dt < salida_dt:
                        estado_asistencia = "Temprana"
                    elif actual_dt > salida_dt:
                        estado_asistencia = "Tarde"
                    else:
                        estado_asistencia = "A tiempo"
                else:
                    if actual_dt < salida_dt:
                        tipo = "Entrada"
                        estado_asistencia = "Fuera de rango"
                    else:
                        tipo = "Salida"
                        estado_asistencia = "Fuera de rango"

                # 3. Insertar en la base de datos
                cur.execute(
                    """
                    INSERT INTO asistencia_biometrica (
                        id_empleado,
                        tipo,
                        fecha,
                        hora,
                        estado_asistencia,
                        turno_asistencia,
                        puesto_del_asistente,
                        vector_capturado
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id_asistencia_biometrica, id_empleado, tipo, fecha, hora,
                              estado_asistencia, turno_asistencia, puesto_del_asistente, vector_capturado
                    """,
                    (
                        id_empleado,
                        tipo,
                        fecha_actual,
                        hora_actual,
                        estado_asistencia,
                        turno,
                        puesto,
                        vector_biometrico
                    )
                )

                resultado = cur.fetchone()
                db.conn.commit()

                return RegistroHorario(*resultado)

        except Exception as e:
            db.conn.rollback()
            raise ValueError(f"Error al registrar asistencia biométrica: {e}")

    @staticmethod
    def registrar_asistencia_manual(
            id_empleado: int,
            tipo: str,
            fecha: date,
            hora: time,
            estado_asistencia: str = None,
            turno_asistencia: str = None,
            puesto_del_asistente: str = None,
            vector_biometrico: str = "MANUAL"
    ):
        """
        Registra una asistencia de forma manual (para uso administrativo)

        Args:
            id_empleado: ID del empleado
            tipo: "Entrada" o "Salida"
            fecha: Fecha del registro
            hora: Hora del registro
            estado_asistencia: Opcional - Estado de la asistencia
            turno_asistencia: Opcional - Turno del empleado
            puesto_del_asistente: Opcional - Puesto del empleado
            vector_biometrico: Opcional - Vector biométrico (default "MANUAL")

        Returns:
            RegistroHorario: Instancia del nuevo registro

        Raises:
            ValueError: Si hay error en los datos o en la operación
        """
        try:
            with db.conn.cursor() as cur:
                # 1. Obtener información laboral si no se proporciona
                if not all([estado_asistencia, turno_asistencia, puesto_del_asistente]):
                    cur.execute(
                        "SELECT puesto, turno, hora_inicio_turno, hora_fin_turno "
                        "FROM informacion_laboral WHERE id_empleado = %s",
                        (id_empleado,)
                    )
                    resultado = cur.fetchone()

                    if not resultado:
                        raise ValueError("No se encontró información laboral para el empleado")

                    puesto, turno, hora_inicio_turno, hora_fin_turno = resultado

                    # Usar valores de la DB si no se proporcionaron
                    puesto_del_asistente = puesto_del_asistente or puesto
                    turno_asistencia = turno_asistencia or turno

                    # Calcular estado si no se proporcionó
                    if not estado_asistencia:
                        entrada_dt = datetime.combine(fecha, hora_inicio_turno)
                        salida_dt = datetime.combine(fecha, hora_fin_turno)
                        registro_dt = datetime.combine(fecha, hora)

                        # Lógica de determinación de estado (similar al método automático)
                        if tipo == "Entrada":
                            if registro_dt < entrada_dt - timedelta(minutes=60):
                                estado_asistencia = "Fuera de rango"
                            elif registro_dt < entrada_dt:
                                estado_asistencia = "Temprana"
                            elif registro_dt <= entrada_dt + timedelta(minutes=5):
                                estado_asistencia = "A tiempo"
                            elif registro_dt <= entrada_dt + timedelta(minutes=15):
                                estado_asistencia = "Retraso minimo"
                            else:
                                estado_asistencia = "Tarde"
                        elif tipo == "Salida":
                            if registro_dt < salida_dt - timedelta(minutes=30):
                                estado_asistencia = "Fuera de rango"
                            elif registro_dt < salida_dt:
                                estado_asistencia = "Temprana"
                            elif registro_dt > salida_dt + timedelta(minutes=30):
                                estado_asistencia = "Fuera de rango"
                            else:
                                estado_asistencia = "A tiempo" if registro_dt == salida_dt else "Tarde"

                # Validar tipo
                if tipo not in ["Entrada", "Salida"]:
                    raise ValueError("El tipo debe ser 'Entrada' o 'Salida'")

                # 2. Insertar en la base de datos
                cur.execute(
                    """
                    INSERT INTO asistencia_biometrica (
                        id_empleado,
                        tipo,
                        fecha,
                        hora,
                        estado_asistencia,
                        turno_asistencia,
                        puesto_del_asistente,
                        vector_capturado
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id_asistencia_biometrica, id_empleado, tipo, fecha, hora,
                              estado_asistencia, turno_asistencia, puesto_del_asistente, vector_capturado
                    """,
                    (
                        id_empleado,
                        tipo,
                        fecha,
                        hora,
                        estado_asistencia,
                        turno_asistencia,
                        puesto_del_asistente,
                        vector_biometrico
                    )
                )

                resultado = cur.fetchone()
                db.conn.commit()

                return RegistroHorario(*resultado)

        except Exception as e:
            db.conn.rollback()
            raise ValueError(f"Error al registrar asistencia manual: {e}")

    @staticmethod
    def obtener_por_empleado(id_empleado: int, limite: int = None):
        """
        Obtiene los registros de asistencia de un empleado

        Args:
            id_empleado (int): ID del empleado
            limite (int): Cantidad máxima de registros a devolver

        Returns:
            List[RegistroHorario]: Lista de registros ordenados por fecha y hora descendente
        """
        try:
            with db.conn.cursor() as cur:
                query = """
                    SELECT id_asistencia_biometrica, id_empleado, tipo, fecha, hora,
                           estado_asistencia, turno_asistencia, puesto_del_asistente, vector_capturado
                    FROM asistencia_biometrica
                    WHERE id_empleado = %s
                    ORDER BY fecha DESC, hora DESC
                """

                params = [id_empleado]

                if limite:
                    query += " LIMIT %s"
                    params.append(limite)

                cur.execute(query, params)
                resultados = cur.fetchall()

                return [
                    RegistroHorario(
                        id_asistencia_biometrica=row[0],
                        id_empleado=row[1],
                        tipo=row[2],
                        fecha=row[3],
                        hora=row[4],
                        estado_asistencia=row[5],
                        turno_asistencia=row[6],
                        puesto_del_asistente=row[7],
                        vector_capturado=row[8]
                    ) for row in resultados
                ]
        except Exception as e:
            raise ValueError(f"Error al obtener registros: {e}")

    @staticmethod
    def obtener_ultimo_registro(id_empleado: int):
        """
        Obtiene el último registro de asistencia del empleado para
        verificar si la última acción fue una entrada antes de permitir otra
        """
        registros = RegistroHorario.obtener_por_empleado(id_empleado, limite=1)
        return registros[0] if registros else None

    def __repr__(self):
        return (f"<RegistroHorario {self.id_asistencia_biometrica}: {self.tipo} "
                f"el {self.fecha} a las {self.hora} ({self.estado_asistencia})>")

    @staticmethod
    def calcular_horas_mensuales2(empleado_id, año, mes):
        """Calcula la suma total de horas trabajadas en un mes"""
        inicio = datetime(año, mes, 1).date()
        fin = (inicio + timedelta(days=31)).replace(day=1)

        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT SUM(horas_normales_trabajadas) 
                FROM registro_jornada 
                WHERE id_empleado = %s 
                AND dia >= %s 
                AND dia < %s
                """,
                (empleado_id, inicio, fin)
            )
            resultado = cur.fetchone()
            return resultado[0] if resultado[0] else 0.0  # Si no hay registros, devuelve 0.0
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_todos_los_registros(empleado_id):
        """Obtiene todos los registros de jornada de un empleado"""
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT fecha,  dia, hora_entrada, hora_salida, horas_normales_trabajadas, horas_extras, estado_jornada
                FROM calendario
                WHERE id_empleado = %s
                ORDER BY fecha
                """,
                (empleado_id,)
            )
            return cur.fetchall()  # Devuelve todos los registros del empleado
        finally:
            if conn:
                db.return_connection(conn)


    @staticmethod
    def calcular_horas_mensuales(empleado_id, año, mes):
        """Calcula la suma total de horas trabajadas en un mes"""
        inicio = datetime(año, mes, 1).date()
        fin = (inicio + timedelta(days=31)).replace(day=1)

        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT SUM(horas_normales_trabajadas)
                FROM registro_jornada
                WHERE id_empleado = %s
                AND fecha >= %s
                AND fecha < %s
                """,
                (empleado_id, inicio, fin)
            )
            resultado = cur.fetchone()
            return resultado[0] if resultado[0] else 0.0  # Si no hay registros, devuelve 0.0
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def actualizar_registro(registro_id: int, nuevos_datos: dict):
        """
        Actualiza un registro de asistencia existente

        Args:
            registro_id: ID del registro a actualizar
            nuevos_datos: Diccionario con campos a actualizar

        Returns:
            RegistroHorario: El registro actualizado

        Raises:
            ValueError: Si hay errores en los datos
        """
        try:
            with db.conn.cursor() as cur:
                # 1. Validar campos permitidos
                campos_permitidos = {
                    'tipo', 'fecha', 'hora', 'estado_asistencia',
                    'turno_asistencia', 'puesto_del_asistente', 'vector_capturado'
                }

                updates = []
                params = []

                for campo, valor in nuevos_datos.items():
                    if campo not in campos_permitidos:
                        raise ValueError(f"Campo no permitido para actualización: {campo}")

                    updates.append(f"{campo} = %s")
                    params.append(valor)

                if not updates:
                    raise ValueError("No se proporcionaron datos válidos para actualizar")

                # 2. Obtener registro actual para validaciones
                cur.execute(
                    "SELECT tipo, fecha, hora, id_empleado FROM asistencia_biometrica WHERE id_asistencia_biometrica = %s",
                    (registro_id,)
                )
                registro_actual = cur.fetchone()

                if not registro_actual:
                    raise ValueError("Registro no encontrado")

                tipo_actual, fecha_actual, hora_actual, id_empleado = registro_actual

                # 3. Validaciones específicas
                if 'tipo' in nuevos_datos and nuevos_datos['tipo'] not in ['Entrada', 'Salida']:
                    raise ValueError("El tipo debe ser 'Entrada' o 'Salida'")

                if 'hora' in nuevos_datos:
                    # Validar coherencia con información laboral si se cambia la hora
                    cur.execute(
                        "SELECT hora_inicio_turno, hora_fin_turno FROM informacion_laboral WHERE id_empleado = %s",
                        (id_empleado,)
                    )
                    turno_info = cur.fetchone()

                    if turno_info:
                        hora_inicio, hora_fin = turno_info
                        # Aquí podrías añadir lógica similar a registrar_asistencia
                        # para recalcular estado_asistencia si cambia la hora

                # 4. Ejecutar actualización
                query = f"""
                    UPDATE asistencia_biometrica
                    SET {', '.join(updates)}
                    WHERE id_asistencia_biometrica = %s
                    RETURNING id_asistencia_biometrica, id_empleado, tipo, fecha, hora,
                              estado_asistencia, turno_asistencia, puesto_del_asistente, vector_capturado
                """
                params.append(registro_id)

                cur.execute(query, params)
                resultado = cur.fetchone()

                if not resultado:
                    raise ValueError("No se pudo actualizar el registro")

                db.conn.commit()
                return RegistroHorario(*resultado)

        except Exception as e:
            db.conn.rollback()
            raise ValueError(f"Error al actualizar registro: {str(e)}")








