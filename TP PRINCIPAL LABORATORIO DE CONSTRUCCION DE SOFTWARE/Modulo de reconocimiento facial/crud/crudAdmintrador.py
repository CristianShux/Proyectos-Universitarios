from datetime import date, time
import psycopg2
from .database import db
from .crudEmpleado import Empleado
from typing import Optional
from typing import Tuple, List
from api.schemas import EmpleadoResponse


class AdminCRUD:

    @staticmethod
    def crear_empleado(nuevo_empleado):
        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            numero_calle = str(nuevo_empleado.numero_calle) if hasattr(nuevo_empleado, 'numero_calle') else None

            cur.execute(
                """
                INSERT INTO empleado (
                    nombre, apellido, tipo_identificacion, numero_identificacion,
                    fecha_nacimiento, correo_electronico, telefono, calle,
                    numero_calle, localidad, partido, provincia, genero, 
                    pais_nacimiento, estado_civil
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_empleado, nombre, apellido, numero_identificacion, 
                          numero_calle, telefono, correo_electronico
                """,
                (
                    nuevo_empleado.nombre, nuevo_empleado.apellido, nuevo_empleado.tipo_identificacion,
                    nuevo_empleado.numero_identificacion, nuevo_empleado.fecha_nacimiento,
                    nuevo_empleado.correo_electronico, nuevo_empleado.telefono, nuevo_empleado.calle,
                    numero_calle, nuevo_empleado.localidad, nuevo_empleado.partido,
                    nuevo_empleado.provincia, nuevo_empleado.genero, nuevo_empleado.pais_nacimiento,
                    nuevo_empleado.estado_civil
                )
            )

            resultado = cur.fetchone()
            conn.commit()

            return {
                "id_empleado": resultado[0],
                "nombre": resultado[1],
                "apellido": resultado[2],
                "tipo_identificacion": nuevo_empleado.tipo_identificacion,
                "numero_identificacion": resultado[3],
                "fecha_nacimiento": nuevo_empleado.fecha_nacimiento,
                "correo_electronico": resultado[6],
                "telefono": resultado[5],
                "calle": nuevo_empleado.calle,
                "numero_calle": resultado[4],
                "localidad": nuevo_empleado.localidad,
                "partido": nuevo_empleado.partido,
                "provincia": nuevo_empleado.provincia,
                "genero": nuevo_empleado.genero,
                "pais_nacimiento": nuevo_empleado.pais_nacimiento,  # Ajustar nombre del campo si hace falta
                "estado_civil": nuevo_empleado.estado_civil
            }

        except Exception as e:
            if conn:
                conn.rollback()
            print(f"[ERROR] Error al crear empleado: {e}")
            raise



        except Exception as e:
            db.conn.rollback()
            raise ValueError(f"Error al crear empleado: {str(e)}")




    @staticmethod
    def crear_empleado2(nuevo_empleado):
        """Registra un nuevo empleado usando el pool de conexiones"""
        print("[DEBUG] Iniciando creación de empleado")

        # Log de campos importantes
        print(f"[DEBUG] Nombre: {nuevo_empleado.nombre}")
        print(f"[DEBUG] Apellido: {nuevo_empleado.apellido}")
        print(f"[DEBUG] Número identificación: {nuevo_empleado.numero_identificacion}")

        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            # Conversión de campos
            numero_calle = str(nuevo_empleado.numero_calle) if hasattr(nuevo_empleado,
                                                                       'numero_calle') and nuevo_empleado.numero_calle is not None else None

            # Query SQL
            cur.execute(
                """
                INSERT INTO empleado (
                    nombre, apellido, tipo_identificacion, numero_identificacion,
                    fecha_nacimiento, correo_electronico, telefono, calle,
                    numero_calle, localidad, partido, provincia, genero, 
                    pais_nacimiento, estado_civil
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_empleado, nombre, apellido, numero_identificacion, 
                          numero_calle, telefono, correo_electronico
                """,
                (
                    nuevo_empleado.nombre, nuevo_empleado.apellido, nuevo_empleado.tipo_identificacion,
                    nuevo_empleado.numero_identificacion, nuevo_empleado.fecha_nacimiento,
                    nuevo_empleado.correo_electronico, nuevo_empleado.telefono, nuevo_empleado.calle,
                    numero_calle, nuevo_empleado.localidad, nuevo_empleado.partido,
                    nuevo_empleado.provincia, nuevo_empleado.genero, nuevo_empleado.pais_nacimiento,
                    nuevo_empleado.estado_civil
                )
            )

            resultado = cur.fetchone()
            conn.commit()

            return {
                "id_empleado": resultado[0],
                "nombre": resultado[1],
                "apellido": resultado[2],
                "numero_identificacion": resultado[3],
                "numero_calle": resultado[4],
                "telefono": resultado[5],
                "correo_electronico": resultado[6]
            }

        except psycopg2.IntegrityError as e:
            if conn:
                conn.rollback()
            if "numero_identificacion" in str(e):
                raise ValueError("El número de identificación ya existe")
            raise ValueError(f"Error de integridad: {str(e)}")

        except Exception as e:
            if conn:
                conn.rollback()
            raise ValueError(f"Error al crear empleado: {str(e)}")

        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_empleado():
        """Lista todos los empleados con información básica"""
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id_empleado, numero_identificacion, nombre, apellido, correo_electronico, telefono
                FROM empleado
                ORDER BY apellido, nombre
                """
            )
            return [
                {
                    "id_empleado": row[0],
                    "numero_identificacion": row[1],
                    "nombre": row[2],
                    "apellido": row[3],
                    "correo": row[4],
                    "telefono": row[5]
                }
                for row in cur.fetchall()
            ]
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_detalle_empleado(numero_identificacion: str):
        """Obtiene todos los datos de un empleado"""
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion,
                       fecha_nacimiento, correo_electronico, telefono, calle,
                       numero_calle, localidad, partido, provincia, genero, pais_nacimiento, estado_civil
                FROM empleado
                WHERE numero_identificacion = %s
                """,
                (numero_identificacion,)
            )
            result = cur.fetchone()
            if result:
                return {
                    "id_empleado": result[0],
                    "nombre": result[1],
                    "apellido": result[2],
                    "tipo_identificacion": result[3],
                    "numero_identificacion": result[4],
                    "fecha_nacimiento": result[5],
                    "correo_electronico": result[6],
                    "telefono": result[7],
                    "calle": result[8],
                    "numero_calle": result[9],
                    "localidad": result[10],
                    "partido": result[11],
                    "provincia": result[12],
                    "genero": result[13],
                    "pais_nacimiento": result[14],
                    "estado_civil": result[15],
                }
            return None
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def registrar_jornada_calendario(id_empleado: int, fecha: date, estado_jornada: str,
                                     hora_entrada: time = None, hora_salida: time = None,
                                     horas_trabajadas: int = None, horas_extras: int = None,
                                     descripcion: str = None):
        """Registra o actualiza una jornada en el calendario"""
        try:
                conn = db.get_connection()
                cur = conn.cursor()
                # Verificar si ya existe registro para esa fecha
                cur.execute(
                    "SELECT 1 FROM calendario WHERE id_empleado = %s AND fecha = %s",
                    (id_empleado, fecha)
                )
                existe = cur.fetchone()

                if existe:
                    # Actualizar registro existente
                    cur.execute(
                        """
                        UPDATE calendario SET
                            estado_jornada = %s,
                            hora_entrada = %s,
                            hora_salida = %s,
                            horas_trabajadas = %s,
                            horas_extras = %s,
                            descripcion = %s
                        WHERE id_empleado = %s AND fecha = %s
                        RETURNING id_asistencia
                        """,
                        (
                            estado_jornada, hora_entrada, hora_salida,
                            horas_trabajadas, horas_extras, descripcion,
                            id_empleado, fecha
                        )
                    )
                else:
                    # Insertar nuevo registro
                    cur.execute(
                        """
                        INSERT INTO calendario (
                            id_empleado, fecha, dia, estado_jornada,
                            hora_entrada, hora_salida, horas_trabajadas,
                            horas_extras, descripcion
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id_asistencia
                        """,
                        (
                            id_empleado, fecha, fecha.strftime("%A"),
                            estado_jornada, hora_entrada, hora_salida,
                            horas_trabajadas, horas_extras, descripcion
                        )
                    )

                db.conn.commit()
                return cur.fetchone()[0]
        except Exception as e:
            db.conn.rollback()
            raise Exception(f"Error al registrar jornada: {e}")
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_calendario_empleado(id_empleado: int, mes: int = None, año: int = None):
        """Obtiene el calendario laboral de un empleado"""
        query = """
            SELECT id_asistencia, fecha, dia, estado_jornada,
                   hora_entrada, hora_salida, horas_trabajadas,
                   horas_extras, descripcion
            FROM calendario
            WHERE id_empleado = %s
        """
        params = [id_empleado]

        if mes and año:
            query += " AND EXTRACT(MONTH FROM fecha) = %s AND EXTRACT(YEAR FROM fecha) = %s"
            params.extend([mes, año])

        query += " ORDER BY fecha DESC"

        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(query, params)
            return [
                {
                    "id_asistencia": row[0],
                    "fecha": row[1],
                    "dia": row[2],
                    "estado_jornada": row[3],
                    "hora_entrada": row[4].strftime("%H:%M") if row[4] else None,
                    "hora_salida": row[5].strftime("%H:%M") if row[5] else None,
                    "horas_trabajadas": row[6],
                    "horas_extras": row[7],
                    "descripcion": row[8]
                }
                for row in cur.fetchall()
            ]
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def buscar_empleado_por_numero_identificacion(numero_identificacion: str):
        """Busca un empleado por número de identificación"""
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id_empleado, numero_identificacion, nombre, apellido, correo_electronico, telefono
                FROM empleado
                WHERE numero_identificacion = %s
                """,
                (numero_identificacion,)
            )
            result = cur.fetchone()
            if result:
                return {
                    "id_empleado": result[0],
                    "numero_identificacion": result[1],
                    "nombre": result[2],
                    "apellido": result[3],
                    "correo": result[4],
                    "telefono": result[5]
                }
            return None
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def buscar_avanzado(
            # Filtra por nombre o apellido los empleados que coincidan. Tambien se puede usar DNI.
            nombre: Optional[str] = None,
            apellido: Optional[str] = None,
            dni: Optional[str] = None,
            pagina: int = 1,
            por_pagina: int = 10
    ) -> Tuple[List[EmpleadoResponse], int]:
        """Versión con paginación"""
        # Query principal
        base_query = """
               SELECT id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion, 
                   fecha_nacimiento, correo_electronico, telefono, calle, numero_calle, 
                   localidad, partido, provincia, genero, pais_nacimiento, estado_civil
               FROM empleado
               WHERE 1=1
           """

        # Query para contar el total  ( número total de registros que coinciden con los filtros de búsqueda)
        count_query = "SELECT COUNT(*) FROM empleado WHERE 1=1"

        params = []

        # Filtros
        # Insensitive: no distingue mayúsculas/minúsculas
        filters = []
        if nombre:
            filters.append("nombre ILIKE %s")
            params.append(f"%{nombre}%")

        if apellido:
            filters.append("apellido ILIKE %s")
            params.append(f"%{apellido}%")

        if dni:
            filters.append("numero_identificacion LIKE %s")
            params.append(f"%{dni}%")

        if filters:
            where_clause = " AND " + " AND ".join(filters)
            base_query += where_clause
            count_query += where_clause

        # Paginación: subconjunto de empleados a mostrar por página
        base_query += " LIMIT %s OFFSET %s"
        params.extend([por_pagina, (pagina - 1) * por_pagina])

        with db.conn.cursor() as cur:
            # Obtener resultados
            cur.execute(base_query, tuple(params))
            results = cur.fetchall()

            # Obtener conteo total
            cur.execute(count_query, tuple(params[:-2]))  # Excluye LIMIT/OFFSET
            total = cur.fetchone()[0]

            # Cada fila de la base de datos (result) se convierte en un objeto Empleado, psycopg2 devuelve filas como tuplas
            empleados = [
                EmpleadoResponse(
                    id_empleado=row[0],
                    nombre=row[1],
                    apellido=row[2],
                    tipo_identificacion=row[3],
                    numero_identificacion=row[4],
                    fecha_nacimiento=row[5],
                    correo_electronico=row[6],
                    telefono=row[7],
                    calle=row[8],
                    numero_calle=row[9],
                    localidad=row[10],
                    partido=row[11],
                    provincia=row[12],
                    genero=row[13],
                    pais_nacimiento=row[14],
                    estado_civil=row[15]
                )
                for row in results
            ]

        return empleados, total

    @staticmethod
    def buscar_informacion_laboral_por_id_empleado(id_empleado: int):
        """
        Busca la información laboral de un empleado por su ID.

        Args:
            id_empleado: ID del empleado a buscar

        Returns:
            Tupla con los campos: (departamento, puesto, turno, horario_entrada,
            horario_salida, fecha_ingreso, tipo_contrato) o None si no se encuentra.
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                SELECT 
                    d.nombre,
                    p.nombre,
                    il.turno,
                    il.hora_inicio_turno,
                    il.hora_fin_turno,
                    il.fecha_ingreso,
                    il.tipo_contrato
                FROM informacion_laboral il
                JOIN departamento d ON il.id_departamento = d.id_departamento
                JOIN puesto p ON il.id_puesto = p.id_puesto
                WHERE il.id_empleado = %s
                ORDER BY il.fecha_ingreso DESC
                LIMIT 1
            """
            cur.execute(query, (id_empleado,))
            return cur.fetchone()  # Retorna directamente la tupla de resultados

        except Exception as e:
            print(f"Error al buscar información laboral: {str(e)}")
            raise ValueError(f"No se pudo obtener la información laboral: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)


    @staticmethod
    def obtener_puesto_por_id_empleado(id_empleado: int) -> Optional[str]:
        """
        Obtiene el puesto de un empleado por su ID.

        Args:
            id_empleado: ID del empleado a buscar

        Returns:
            Nombre del puesto o None si no se encuentra.
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                    SELECT p.nombre
                    FROM informacion_laboral il
                    JOIN puesto p ON il.id_puesto = p.id_puesto
                    WHERE il.id_empleado = %s
                    ORDER BY il.fecha_ingreso DESC
                    LIMIT 1
                """
            cur.execute(query, (id_empleado,))
            result = cur.fetchone()
            return result[0] if result else None

        except Exception as e:
            print(f"Error al buscar puesto del empleado: {str(e)}")
            raise ValueError(f"No se pudo obtener el puesto: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_categoria_por_id_empleado(id_empleado: int) -> Optional[str]:
        """
        Obtiene la categoría de un empleado por su ID.

        Args:
            id_empleado: ID del empleado a buscar

        Returns:
            Nombre de la categoría o None si no se encuentra.
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                    SELECT c.nombre_categoria
                    FROM informacion_laboral il
                    JOIN categoria c ON il.id_categoria = c.id_categoria
                    WHERE il.id_empleado = %s
                    ORDER BY il.fecha_ingreso DESC
                    LIMIT 1
                """
            cur.execute(query, (id_empleado,))
            result = cur.fetchone()
            return result[0] if result else None

        except Exception as e:
            print(f"Error al buscar categoría del empleado: {str(e)}")
            raise ValueError(f"No se pudo obtener la categoría: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_departamento_por_id_empleado(id_empleado: int) -> Optional[Tuple[str, str]]:
        """
        Obtiene el departamento de un empleado por su ID.

        Args:
            id_empleado: ID del empleado a buscar

        Returns:
            Tupla con (nombre_departamento, descripcion) o None si no se encuentra.
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                    SELECT d.nombre, d.descripcion
                    FROM informacion_laboral il
                    JOIN departamento d ON il.id_departamento = d.id_departamento
                    WHERE il.id_empleado = %s
                    ORDER BY il.fecha_ingreso DESC
                    LIMIT 1
                """
            cur.execute(query, (id_empleado,))
            return cur.fetchone()  # Retorna directamente la tupla de resultados

        except Exception as e:
            print(f"Error al buscar departamento del empleado: {str(e)}")
            raise ValueError(f"No se pudo obtener el departamento: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)



    @staticmethod
    def actualizar_datos_personales2(id_empleado: int, telefono: str = None,
                                    correo_electronico: str = None, calle: str = None,
                                    numero_calle: str = None, localidad: str = None,
                                    partido: str = None, provincia: str = None):
        """
        Permite a un empleado actualizar sus datos personales.
        Solo actualiza los campos que recibe (los demás permanecen igual).

        Args:
            id_empleado: ID del empleado que realiza la actualización
            telefono: Nuevo número de teléfono (opcional)
            correo_electronico: Nuevo correo electrónico (opcional)
            calle: Nueva calle (opcional)
            numero_calle: Nuevo número de calle (opcional)
            localidad: Nueva localidad (opcional)
            partido: Nuevo partido (opcional)
            provincia: Nueva provincia (opcional)

        Returns:
            El objeto Empleado actualizado

        Raises:
            ValueError: Si hay error en los datos o en la operación
        """
        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            # Construir la consulta dinámicamente basada en los parámetros proporcionados
            updates = []
            params = []

            if telefono is not None:
                updates.append("telefono = %s")
                params.append(telefono)

            if correo_electronico is not None:
                # Verificar si el correo ya existe (excepto para este empleado)
                cur.execute(
                    "SELECT 1 FROM empleado WHERE correo_electronico = %s AND id_empleado != %s",
                    (correo_electronico, id_empleado)
                )
                if cur.fetchone():
                    raise ValueError("El correo electrónico ya está en uso por otro empleado")
                updates.append("correo_electronico = %s")
                params.append(correo_electronico)

            if calle is not None:
                updates.append("calle = %s")
                params.append(calle)

            if numero_calle is not None:
                updates.append("numero_calle = %s")
                params.append(numero_calle)

            if localidad is not None:
                updates.append("localidad = %s")
                params.append(localidad)

            if partido is not None:
                updates.append("partido = %s")
                params.append(partido)

            if provincia is not None:
                # Validar provincia
                provincias_validas = ['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
                                      'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
                                      'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
                                      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
                                      'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
                                      'Ciudad Autónoma de Buenos Aires']
                if provincia not in provincias_validas:
                    raise ValueError(f"Provincia inválida. Opciones válidas: {provincias_validas}")
                updates.append("provincia = %s")
                params.append(provincia)

            if not updates:
                raise ValueError("No se proporcionaron datos para actualizar")

            # Construir la consulta final
            query = f"""
                UPDATE empleado 
                SET {', '.join(updates)}
                WHERE id_empleado = %s
                RETURNING id_empleado
            """
            params.append(id_empleado)

            cur.execute(query, params)
            if cur.rowcount == 0:
                raise ValueError("No se encontró el empleado con el ID proporcionado")

            conn.commit()
            return Empleado.obtener_por_id(id_empleado)

        except ValueError as e:
            if conn:
                conn.rollback()
            raise e

        except Exception as e:
            if conn:
                conn.rollback()
            raise ValueError(f"Error al actualizar datos: {str(e)}")

        finally:
            if conn:
                db.return_connection(conn)