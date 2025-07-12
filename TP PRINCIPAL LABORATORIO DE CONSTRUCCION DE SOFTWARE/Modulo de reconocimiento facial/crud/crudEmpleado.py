import uuid
from datetime import datetime, timedelta
from .database import db, Database

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
        with db.conn.cursor() as cur:
            cur.execute(
                """
                SELECT id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion, 
                    fecha_nacimiento, correo_electronico, telefono, calle, numero_calle, 
                    localidad, partido, provincia, genero, pais_nacimiento, estado_civil
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
            return None  # En caso de no encontrar

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

            # Validar provincia si se quiere actualizar
            if provincia:
                provincias_validas = [
                    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
                    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
                    'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
                    'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
                    'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
                    'Ciudad Autónoma de Buenos Aires'
                ]
                if provincia not in provincias_validas:
                    raise ValueError("Provincia inválida.")

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
    def __init__(self, id_empleado, id_periodo, id_puesto, tipo, fecha, hora, estado=None, turno=None):
        self.id_empleado = id_empleado
        self.id_periodo = id_periodo
        self.id_puesto = id_puesto
        self.tipo = tipo
        self.fecha = fecha
        self.hora = hora
        self.estado = estado
        self.turno = turno

    @staticmethod
    def registrar_asistencia(id_empleado: int, fecha_hora: datetime):
        """
        Registra una asistencia biométrica si corresponde, validando condiciones horarias
        y evitando doble fichaje.

        Returns:
            RegistroHorario: registro creado
            None: si está fuera de rango permitido
        Raises:
            ValueError: si ya existe fichaje, o no se puede registrar
        """
        conn = db.get_connection()
        try:
            with conn.cursor() as cur:
                # 🔍 Obtener datos laborales
                cur.execute("""
                    SELECT id_puesto, turno, hora_inicio_turno, hora_fin_turno
                    FROM informacion_laboral
                    WHERE id_empleado = %s
                """, (id_empleado,))
                resultado = cur.fetchone()
                if not resultado:
                    raise ValueError("No se encontró información laboral para el empleado")

                id_puesto, turno, hora_inicio, hora_fin = resultado

                fecha_actual = fecha_hora.date()
                hora_actual = fecha_hora.replace(second=0, microsecond=0).time()
                print(fecha_actual)
                # 🗓 Periodo
                cur.execute("SELECT obtener_o_crear_periodo_empleado(%s, %s);", (id_empleado, fecha_actual))
                id_periodo = cur.fetchone()[0]

                # 🕐 Fechas completas
                entrada_dt = datetime.combine(fecha_actual, hora_inicio)
                salida_dt = datetime.combine(fecha_actual, hora_fin)
                actual_dt = fecha_hora.replace(second=0, microsecond=0)

                #cargamos desde la db
                cur.execute("""
                    SELECT clave, valor
                    FROM configuracion_asistencia
                    WHERE clave IN ('entrada_temprana', 'tolerancia', 'retraso_min', 'salida_valida', 'salida_fuera')
                """)
                config_rows = cur.fetchall()
                config = {clave: valor for clave, valor in config_rows}

                #definimos desde las variables de la db
                entrada_temprana_delta = config.get('entrada_temprana', timedelta(hours=1))
                tolerancia = config.get('tolerancia', timedelta(minutes=5))
                retraso_min = config.get('retraso_min', timedelta(minutes=15))
                salida_valida = config.get('salida_valida', timedelta(minutes=30))
                salida_fuera = config.get('salida_fuera', timedelta(hours=2))

                entrada_temprana = entrada_dt - entrada_temprana_delta

            #configuracion_asistencia

                # 🧠 Lógica de tipo y estado
                if actual_dt < entrada_temprana:
                    return None  # demasiado temprano
                elif entrada_temprana <= actual_dt < entrada_dt:
                    tipo, estado = "Entrada", "Temprana"
                elif entrada_dt <= actual_dt <= entrada_dt + tolerancia:
                    tipo, estado = "Entrada", "A tiempo"
                elif entrada_dt + tolerancia < actual_dt <= entrada_dt + retraso_min:
                    tipo, estado = "Entrada", "Retraso mínimo"
                elif entrada_dt + retraso_min < actual_dt < salida_dt - timedelta(hours=3):
                    tipo, estado = "Entrada", "Tarde"
                elif actual_dt < salida_dt - salida_valida:
                    tipo, estado = "Salida", "Temprana"
                elif salida_dt - salida_valida <= actual_dt <= salida_dt + salida_valida:
                    tipo = "Salida"
                    estado = "A tiempo" if actual_dt == salida_dt else "Temprana" if actual_dt < salida_dt else "Tarde"
                elif salida_dt + salida_valida < actual_dt <= salida_dt + salida_fuera:
                    tipo, estado = "Salida", "Tarde"
                else:
                    tipo, estado = "Salida", "Fuera de rango"

                # ❌ Validar si ya fichó ese tipo hoy
                cur.execute("""
                    SELECT 1 FROM asistencia_biometrica
                    WHERE id_empleado = %s AND tipo = %s AND fecha = %s
                """, (id_empleado, tipo, fecha_actual))
                if cur.fetchone():
                    raise ValueError(f"Ya se registró una {tipo.lower()} hoy para este empleado.")

                if tipo == "Salida":
                    cur.execute("""
                        SELECT 1 FROM asistencia_biometrica
                        WHERE id_empleado = %s AND tipo = 'Entrada' AND fecha = %s
                    """, (id_empleado, fecha_actual))
                    if not cur.fetchone():
                        raise ValueError("No se puede registrar una salida sin haber registrado una entrada.")

                # ✅ Insertar registro
                cur.execute("""
                    INSERT INTO asistencia_biometrica (
                        id_empleado, id_periodo, id_puesto, tipo, fecha, hora,
                        estado_asistencia, turno_asistencia
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id_empleado, id_periodo, id_puesto, tipo, fecha, hora, estado_asistencia, turno_asistencia
                """, (
                    id_empleado, id_periodo, id_puesto, tipo,
                    fecha_actual, hora_actual, estado, turno
                ))
                resultado_insert = cur.fetchone()
                if not resultado_insert or len(resultado_insert) < 6:
                    raise ValueError(f"Error al insertar registro, datos incompletos: {resultado_insert}")
                registro_data = list(resultado_insert)
                registro_data[4] = datetime.strptime(registro_data[4], "%Y-%m-%d").date() if isinstance(registro_data[4], str) else registro_data[4]
                registro_data[5] = datetime.strptime(registro_data[5], "%H:%M:%S").time() if isinstance(registro_data[5], str) else registro_data[5]
                conn.commit()

                return RegistroHorario(*registro_data)

        except Exception as e:
            conn.rollback()
            raise ValueError(f"Error al registrar asistencia biométrica: {e}")

        finally:
            db.return_connection(conn)

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
                SELECT id_registro_jornada, id_empleado, fecha,  dia, hora_entrada, hora_salida, estado_jornada, horas_normales_trabajadas, observaciones
                FROM registro_jornada
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





