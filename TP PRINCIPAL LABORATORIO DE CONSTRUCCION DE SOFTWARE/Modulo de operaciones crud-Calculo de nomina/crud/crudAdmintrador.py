from datetime import datetime, date, time
import psycopg2
from psycopg2 import sql
from .database import db
from .crudEmpleado import Empleado
from typing import Optional
from typing import Tuple, List
from api.schemas import EmpleadoResponse, ConceptoUpdate
import cloudinary
import cloudinary.uploader
from cloudinary.uploader import upload as cloudinary_upload
import io
from crud import validacion_entrada
from auth.utils import registrar_evento_sistema

class AdminCRUD:

    @staticmethod
    def crear_empleado(id_usuario: int,nuevo_empleado):
        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            numero_calle = str(nuevo_empleado.numero_calle) if hasattr(nuevo_empleado, 'numero_calle') else None

            validacion_entrada.validar_datos_empleado(nuevo_empleado)

            # Calcular manualmente el próximo id_empleado
            cur.execute("SELECT MAX(id_empleado) FROM empleado")
            max_id = cur.fetchone()[0]
            nuevo_id = (max_id or 0) + 1

            cur.execute(
                """
                INSERT INTO empleado (
                    id_empleado, nombre, apellido, tipo_identificacion, numero_identificacion,
                    fecha_nacimiento, correo_electronico, telefono, calle,
                    numero_calle, localidad, partido, provincia, genero, 
                    pais_nacimiento, estado_civil
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_empleado, nombre, apellido, numero_identificacion, 
                          numero_calle, telefono, correo_electronico
                """,
                (
                    nuevo_id, nuevo_empleado.nombre, nuevo_empleado.apellido, nuevo_empleado.tipo_identificacion,
                    nuevo_empleado.numero_identificacion, nuevo_empleado.fecha_nacimiento,
                    nuevo_empleado.correo_electronico, nuevo_empleado.telefono, nuevo_empleado.calle,
                    numero_calle, nuevo_empleado.localidad, nuevo_empleado.partido,
                    nuevo_empleado.provincia, nuevo_empleado.genero, nuevo_empleado.pais_nacimiento,
                    nuevo_empleado.estado_civil
                )
            )

            resultado = cur.fetchone()

            # Registrar evento en evento_sistema
            cur.execute(
                """
                INSERT INTO evento_sistema (id_usuario, tipo_evento, descripcion)
                VALUES (%s, %s, %s)
                """,
                (id_usuario, 'Otro', f'Se creó el empleado {resultado[1]} {resultado[2]} (ID: {resultado[0]})')
            )
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
                try:
                    registrar_evento_sistema(
                        conn,
                        id_usuario=id_usuario,
                        tipo_evento="Otro",
                        descripcion=f"Error al crear empleado: {str(e)}"
                    )
                    conn.commit()
                except Exception as log_error:
                    print(f"[ERROR] Fallo al registrar log: {log_error}")
            print(f"[ERROR] Error al crear empleado: {e}")
            raise

        finally:
            if conn:
                conn.close()




    @staticmethod
    def crear_empleado3(nuevo_empleado):
        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            # 👇 Corregir la secuencia por si quedó desfasada
            cur.execute("SELECT MAX(id_empleado) FROM empleado")
            max_id = cur.fetchone()[0] or 0

            cur.execute("SELECT pg_get_serial_sequence('empleado', 'id_empleado')")
            seq_name = cur.fetchone()[0]

            cur.execute("SELECT setval(%s, %s, true)", (seq_name, max_id))
            # ☝️ Esto asegura que el próximo id_empleado sea válido

            numero_calle = str(nuevo_empleado.numero_calle) if hasattr(nuevo_empleado, 'numero_calle') else None

            validacion_entrada.validar_datos_empleado(nuevo_empleado)

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
                "pais_nacimiento": nuevo_empleado.pais_nacimiento,
                "estado_civil": nuevo_empleado.estado_civil
            }

        except Exception as e:
            if conn:
                conn.rollback()
            print(f"[ERROR] Error al crear empleado: {e}")
            raise

        finally:
            if conn:
                conn.close()

    @staticmethod
    def habilitar_cuenta(id_empleado: int):
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                UPDATE usuario
                SET esta_activo = TRUE,
                    fecha_activacion = %s
                WHERE id_empleado = %s
                """,
                (date.today(), id_empleado)
            )
            if cur.rowcount == 0:
                raise ValueError("No se encontró el usuario con ese ID de empleado")
            conn.commit()
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
                SELECT id_empleado, numero_identificacion, nombre, apellido, correo_electronico, telefono, imagen_perfil_url
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
                    "telefono": row[5],
                    "imagen_perfil_url": row[6]
                }
                for row in cur.fetchall()
            ]
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_empleado_por_id(id_empleado):
        """Obtiene la información básica de un empleado por su ID"""
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id_empleado, numero_identificacion, nombre, apellido,
                       correo_electronico, telefono, imagen_perfil_url
                FROM empleado
                WHERE id_empleado = %s
                """,
                (id_empleado,)
            )
            row = cur.fetchone()
            if row:
                return {
                    "id_empleado": row[0],
                    "numero_identificacion": row[1],
                    "nombre": row[2],
                    "apellido": row[3],
                    "correo": row[4],
                    "telefono": row[5],
                    "imagen_perfil_url": row[6]
                }
            return None
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
                       numero_calle, localidad, partido, provincia, genero, pais_nacimiento, estado_civil, imagen_perfil_url
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
                    "imagen_perfil_url": result[16]
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
    def obtener_rol_por_id_empleado(id_empleado: int) -> Optional[str]:
        """
        Obtiene el rol de un empleado por su ID.

        Args:
            id_empleado: ID del empleado a buscar

        Returns:
            Nombre del rol o None si no se encuentra.
        """
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                    SELECT p.nombre
                    FROM informacion_laboral il
                    JOIN rol p ON p.id_rol = p.id_rol
                    WHERE il.id_empleado = %s
                    ORDER BY il.fecha_ingreso DESC
                    LIMIT 1
                """
            cur.execute(query, (id_empleado,))
            result = cur.fetchone()
            return result[0] if result else None

        except Exception as e:
            print(f"Error al buscar rol del empleado: {str(e)}")
            raise ValueError(f"No se pudo obtener el rol: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_id_rol_por_id_empleado(id_empleado: int):
        conn = db.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id_rol FROM usuario WHERE id_empleado = %s", (id_empleado,))
        result = cur.fetchone()
        return result[0] if result else None


    @staticmethod
    def actualizar_datos_personales2(id_usuario:int, id_empleado: int, telefono: str = None,
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

            validacion_entrada.validar_actualizar_datos_empleado(
                telefono,
                correo_electronico,
                calle,
                numero_calle,
                localidad,
                partido,
                provincia
            )

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
            print(f"[DEBUG] Tipo de conn: {type(conn)}")

            # Registrar evento en la tabla evento_sistema
            cur.execute("""
                INSERT INTO evento_sistema (id_usuario, tipo_evento, descripcion)
                VALUES (%s, %s, %s)
            """, (
                id_usuario,
                'Otro',
                f'Datos personales actualizados para empleado ID {id_empleado}'
            ))
            conn.commit()
            return Empleado.obtener_por_id(id_empleado)
        finally:
            if conn:
                conn.close()



    @staticmethod
    def actualizar_imagen_perfil(image_bytes: bytes, usuario_id: int):
        """
        Sube una imagen a Cloudinary y actualiza la URL en la base de datos para el usuario indicado.

        Args:
            image_bytes: El contenido de la imagen en bytes
            usuario_id: ID del empleado a actualizar

        Returns:
            URL segura de la imagen subida
        """
        conn = None
        try:
            # Subir a Cloudinary
            result = cloudinary.uploader.upload(io.BytesIO(image_bytes), folder="perfiles")
            image_url = result["secure_url"]

            # Guardar en base de datos
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute(
                "UPDATE empleado SET imagen_perfil_url = %s WHERE id_empleado = %s",
                (image_url, usuario_id)
            )
            conn.commit()
            return image_url

        except Exception as e:
            raise Exception(f"Error al subir imagen: {e}")

        finally:
            if conn:
                conn.close()

    @staticmethod
    def eliminar_imagen_perfil(id_empleado: int):
        with db.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
                   UPDATE empleado
                   SET imagen_perfil_url = NULL
                   WHERE id_empleado = %s
               """, (id_empleado,))
            conn.commit()
            return cur.rowcount

    @staticmethod
    def obtener_numero_identificacion(id_empleado: int):
        conn = db.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT numero_identificacion FROM empleado WHERE id_empleado = %s", (id_empleado,))
                result = cur.fetchone()
                return result[0] if result else None
        finally:
            conn.close()

#CUENTA BANCARIA-----------------------------------------------------------------------------------------------------
    @staticmethod
    def obtener_cuenta_bancaria(id_empleado: int):
        with db.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
                 SELECT cb.numero_cuenta, cb.tipo_cuenta, b.nombre
                 FROM cuenta_bancaria cb
                 JOIN banco b ON cb.codigo_banco = b.codigo_banco
                 WHERE cb.id_empleado = %s
             """, (id_empleado,))
            result = cur.fetchone()
            if not result:
                return None
            return {
                'numero_cuenta': result[0],
                'tipo_cuenta': result[1],
                'nombre': result[2]
            }

    @staticmethod
    def crear_cuenta_bancaria(id_empleado: int, codigo_banco: str, numero_cuenta: str, tipo_cuenta: str):
        with db.get_connection() as conn:
            cur = conn.cursor()

            # Buscar el mayor ID actual
            cur.execute("SELECT MAX(id_cuenta) FROM cuenta_bancaria")
            max_id = cur.fetchone()[0]
            nuevo_id = (max_id or 0) + 1

            # Insertar con el nuevo ID
            cur.execute("""
                INSERT INTO cuenta_bancaria (id_cuenta, id_empleado, codigo_banco, numero_cuenta, tipo_cuenta)
                VALUES (%s, %s, %s, %s, %s)
            """, (nuevo_id, id_empleado, codigo_banco, numero_cuenta, tipo_cuenta))

            conn.commit()
            return nuevo_id

    @staticmethod
    def actualizar_cuenta_bancaria(id_empleado: int, nombre_banco: str, numero_cuenta: str, tipo_cuenta: str):
        with db.get_connection() as conn:
            cur = conn.cursor()

            cur.execute("SELECT codigo_banco FROM banco WHERE nombre = %s", (nombre_banco,))
            result = cur.fetchone()

            if not result:
                raise ValueError(f"No se encontró un banco con el nombre: {nombre_banco}")

            codigo_banco = result[0]

            cur.execute("""
                UPDATE cuenta_bancaria
                SET codigo_banco = %s,
                    numero_cuenta = %s,
                    tipo_cuenta = %s
                WHERE id_empleado = %s
            """, (codigo_banco, numero_cuenta, tipo_cuenta, id_empleado))

            conn.commit()
            return cur.rowcount

##SALARIO
    @staticmethod
    def obtener_historial_salarios(puesto_id: int, departamento_id: int, categoria_id: int):
        with db.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT valor_por_defecto, fecha_inicio, fecha_fin
                FROM salario_base
                WHERE id_puesto = %s AND id_departamento = %s AND id_categoria = %s
                ORDER BY fecha_inicio DESC
            """, (puesto_id, departamento_id, categoria_id))
            resultados = cur.fetchall()
            return [
                {
                    "valor": float(row[0]),
                    "fecha_inicio": row[1].isoformat(),
                    "fecha_fin": row[2].isoformat() if row[2] else None,
                }
                for row in resultados
            ]
    @staticmethod
    def actualizar_salario(puesto_id: int, departamento_id: int, categoria_id: int, valor_por_defecto: float, fecha_inicio: str):
        with db.get_connection() as conn:
            cur = conn.cursor()

            # Validaciones (opcional si ya validaste en la API)
            cur.execute("SELECT 1 FROM puesto WHERE id_puesto = %s", (puesto_id,))
            if not cur.fetchone():
                raise ValueError(f"No existe el puesto con ID {puesto_id}")

            cur.execute("SELECT 1 FROM departamento WHERE id_departamento = %s", (departamento_id,))
            if not cur.fetchone():
                raise ValueError(f"No existe el departamento con ID {departamento_id}")

            cur.execute("SELECT 1 FROM categoria WHERE id_categoria = %s", (categoria_id,))
            if not cur.fetchone():
                raise ValueError(f"No existe la categoría con ID {categoria_id}")

            # Insertar nuevo salario
            cur.execute("""
                INSERT INTO salario_base (id_puesto, id_departamento, id_categoria, valor_por_defecto, fecha_inicio)
                VALUES (%s, %s, %s, %s, %s)
            """, (puesto_id, departamento_id, categoria_id, valor_por_defecto, fecha_inicio))

            conn.commit()

    @staticmethod
    def agregar_concepto(descripcion: str, tipo_concepto: str, valor_por_defecto: float, es_porcentaje: bool):
        conceptos_validos = [
            'Remunerativo', 'No remunerativo', 'Deducción', 'Retención',
            'Percepción', 'Indemnización', 'Reintegro', 'Premio',
            'Multa', 'Ajuste', 'Anticipo', 'Vacaciones'
        ]

        if tipo_concepto not in conceptos_validos:
            raise ValueError(f"Tipo de concepto inválido: {tipo_concepto}")

        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            # Corrobar si ya existe el concepto con ese nombre
            cur.execute("SELECT 1 FROM concepto WHERE descripcion = %s", (descripcion,))
            if cur.fetchone():
                raise ValueError("Ya existe un concepto agregado con dicho nombre.")

            # Obtener último código insertado
            cur.execute("SELECT codigo FROM concepto WHERE codigo LIKE 'C%' ORDER BY codigo DESC LIMIT 1")
            ultimo = cur.fetchone()
            if ultimo:
                ultimo_num = int(ultimo[0][1:])  # Quita la "C" y convierte a int
                nuevo_codigo = f"C{ultimo_num + 1:03d}"
            else:
                nuevo_codigo = "C001"

            # Insertar nuevo concepto
            cur.execute(
                "INSERT INTO concepto (codigo, descripcion, tipo_concepto, valor_por_defecto, es_porcentaje) VALUES (%s, %s, %s, %s, %s)",
                (nuevo_codigo, descripcion, tipo_concepto, valor_por_defecto, es_porcentaje)
            )
            conn.commit()

        except Exception as e:
            if conn:
                conn.rollback()
            raise e

        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_conceptos():
        with db.get_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "SELECT codigo, descripcion, tipo_concepto, valor_por_defecto, es_porcentaje FROM concepto ORDER BY codigo")
            conceptos = cur.fetchall()

        return [
            {
                "codigo": c[0],
                "descripcion": c[1],
                "tipo_concepto": c[2],
                "valor_por_defecto": float(c[3]) if c[3] is not None else None,
                "es_porcentaje": c[4]
            }
            for c in conceptos
        ]

    @staticmethod
    def eliminar_concepto(codigo: str):
        with db.get_connection() as conn:
            cur = conn.cursor()

            # Verificar existencia
            cur.execute("SELECT 1 FROM concepto WHERE codigo = %s", (codigo,))
            if not cur.fetchone():
                raise ValueError(f"No existe el concepto con código {codigo}")

            # Eliminar
            cur.execute("DELETE FROM concepto WHERE codigo = %s", (codigo,))
            conn.commit()

    @staticmethod
    def modificar_concepto(codigo: str, datos: ConceptoUpdate):
        conceptos_validos = [
            'Remunerativo', 'No remunerativo', 'Deducción', 'Retención',
            'Percepción', 'Indemnización', 'Reintegro', 'Premio',
            'Multa', 'Ajuste', 'Anticipo', 'Vacaciones'
        ]

        with db.get_connection() as conn:
            cur = conn.cursor()

            # Verificar que el concepto exista
            cur.execute("SELECT 1 FROM concepto WHERE codigo = %s", (codigo,))
            if not cur.fetchone():
                raise ValueError(f"No existe el concepto con código {codigo}")

            # Armar la consulta dinámica según los campos enviados
            campos = []
            valores = []

            if datos.descripcion is not None:
                campos.append("descripcion = %s")
                valores.append(datos.descripcion)

            if datos.tipo_concepto is not None:
                if datos.tipo_concepto not in conceptos_validos:
                    raise ValueError(f"Tipo de concepto inválido: {datos.tipo_concepto}")
                campos.append("tipo_concepto = %s")
                valores.append(datos.tipo_concepto)

            if datos.valor_por_defecto is not None:
                campos.append("valor_por_defecto = %s")
                valores.append(datos.valor_por_defecto)

            if datos.es_porcentaje is not None:
                campos.append("es_porcentaje = %s")
                valores.append(datos.es_porcentaje)

            if not campos:
                raise ValueError("No se enviaron campos para actualizar")

            valores.append(codigo)  # Para el WHERE

            query = f"UPDATE concepto SET {', '.join(campos)} WHERE codigo = %s"
            cur.execute(query, tuple(valores))
            conn.commit()

    @staticmethod
    def guardar_documento_tipo(empleado_id: int, contenido: bytes, tipo: str, descripcion: str = None):
        tipos_validos = [
            'DNI', 'CUIL', 'Partida de nacimiento', 'CV', 'Título', 'Domicilio',
            'AFIP', 'Foto', 'CBU', 'Certificado médico', 'Licencia de conducir', 'Contrato', 'Otros'
        ]

        if tipo not in tipos_validos:
            raise ValueError(f"Tipo de documento inválido: {tipo}")

        conn = None
        try:
            # Verificar existencia de empleado
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM empleado WHERE id_empleado = %s", (empleado_id,))
            if not cur.fetchone():
                raise ValueError(f"No existe el empleado con ID {empleado_id}")

            # Subir a Cloudinary
            result = cloudinary.uploader.upload(
                io.BytesIO(contenido),
                resource_type="raw",
                folder=f"documentos_{tipo.lower()}",
                public_id=f"{empleado_id}_{tipo.lower()}_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                use_filename=True,
                overwrite=False
            )
            url_archivo = result["secure_url"]

            # Insertar en tabla
            cur.execute("""
                INSERT INTO documento (id_empleado, tipo, archivo_asociado, descripcion)
                VALUES (%s, %s, %s, %s)
            """, (empleado_id, tipo, url_archivo, descripcion))
            conn.commit()

            return url_archivo

        except Exception as e:
            raise Exception(f"Error al guardar documento tipo {tipo}: {e}")
        finally:
            if conn:
                conn.close()

    @staticmethod
    def obtener_documento_tipo(empleado_id: int, tipo: str):
        with db.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT id_documento, tipo, archivo_asociado, descripcion, fecha_subida
                FROM documento
                WHERE id_empleado = %s AND tipo = %s
                ORDER BY fecha_subida DESC
                LIMIT 1
            """, (empleado_id, tipo))
            row = cur.fetchone()

            if not row:
                raise ValueError(f"No se encontró documento tipo '{tipo}' para el empleado {empleado_id}")

            return {
                "id_documento": row[0],
                "tipo": row[1],
                "url": row[2],
                "descripcion": row[3],
                "fecha_subida": row[4].isoformat()
            }

    @staticmethod
    def tiene_vectores_faciales(id_empleado: int) -> bool:
        with db.get_connection() as conn:
            cur = conn.cursor()

            cur.execute("""
                SELECT tipo_vector
                FROM dato_biometrico_facial
                WHERE id_empleado = %s
            """, (id_empleado,))

            vectores = {row[0] for row in cur.fetchall()}

        return {'Neutro', 'Sonrisa', 'Giro'}.issubset(vectores)

#Jornada---------------------------------------------------------------------------------------

    @staticmethod
    def registrar_jornada(
            id_empleado: int,
            fecha: date,
            dia: str,
            hora_entrada: time,
            hora_salida: time,
            estado_jornada: str,
            horas_normales_trabajadas: float,
            horas_extra: float,
            motivo: str
    ):
        try:
            # 1. Abrir conexión
            with db.get_connection() as conn:

                cur = conn.cursor()
            #corrobar si ya existe o no 
            cur.execute("""
            SELECT 1 FROM registro_jornada 
            WHERE id_empleado = %s AND fecha = %s
            """, (id_empleado, fecha))

            if cur.fetchone():
                raise ValueError("Ya existe una jornada registrada para ese empleado en esa fecha.")
            # 2. Obtener o crear el periodo
            cur.execute("SELECT obtener_o_crear_periodo_empleado(%s, %s);", (id_empleado, fecha))
            id_periodo = cur.fetchone()[0]

            # 3. Insertar en registro_jornada
            cur.execute("""
                INSERT INTO registro_jornada (
                    id_empleado,
                    id_periodo,
                    fecha,
                    dia,
                    hora_entrada,
                    hora_salida,
                    estado_jornada,
                    horas_normales_trabajadas,
                    observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_registro_jornada;
            """, (
                id_empleado,
                id_periodo,
                fecha,
                dia,
                hora_entrada,
                hora_salida,
                estado_jornada,
                horas_normales_trabajadas,
                motivo
            ))

            id_jornada_insertada = cur.fetchone()[0]

            # 4. Verificar si es feriado
            cur.execute("SELECT EXISTS (SELECT 1 FROM feriado WHERE fecha = %s);", (fecha,))
            es_feriado = cur.fetchone()[0]

            # 5. Si hay horas extra, insertar en registro_hora_extra
            if horas_extra > 0:
                tipo = None
                observacion = None

                if es_feriado or dia.lower() == 'domingo':
                    tipo = '100%'
                    observacion = 'Horas extra con recargo total (feriado o domingo)'
                elif dia.lower() == 'sábado':
                    if hora_salida > time(13, 0):
                        tipo = '100%'
                        observacion = 'Horas extra con recargo total (sábado después de las 13:00)'
                    else:
                        tipo = '50%'
                        observacion = 'Horas extra con recargo del 50% (sábado antes de las 13:00)'
                else:
                    tipo = '50%'
                    observacion = 'Horas extra con recargo del 50% (día de semana)'

                cur.execute("""
                    INSERT INTO registro_hora_extra (
                        id_registro_jornada,
                        cantidad_horas,
                        tipo_hora_extra,
                        observaciones
                    ) VALUES (%s, %s, %s, %s);
                """, (
                    id_jornada_insertada,
                    horas_extra,
                    tipo,
                    observacion
                ))

            # 6. Confirmar y cerrar
            conn.commit()
            print("✅ Jornada y horas extra registradas correctamente.")

        except Exception as e:
            if 'conn' in locals():
                conn.rollback()
            print("❌ Error al registrar jornada:", e)
            raise e

        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()

    @staticmethod
    def registrar_jornada_parcial(id_empleado: int, fecha: date, hora_entrada: time = None, hora_salida: time = None,
                                  motivo: str = ""):
        if not hora_entrada and not hora_salida:
            raise ValueError("Debe especificar al menos hora_entrada o hora_salida")

        with db.get_connection() as conn:
            cur = conn.cursor()

            # Obtener o crear el período
            cur.execute("SELECT obtener_o_crear_periodo_empleado(%s, %s);", (id_empleado, fecha))
            id_periodo = cur.fetchone()[0]

            # Verificar si ya existe un registro para esa fecha
            cur.execute("""
                SELECT id_registro_jornada, hora_entrada, hora_salida
                FROM registro_jornada
                WHERE id_empleado = %s AND fecha = %s
            """, (id_empleado, fecha))

            row = cur.fetchone()

            if row:
                id_registro, entrada_actual, salida_actual = row

                nueva_entrada = hora_entrada or entrada_actual
                nueva_salida = hora_salida or salida_actual

                cur.execute("""
                    UPDATE registro_jornada
                    SET hora_entrada = %s,
                        hora_salida = %s,
                        observaciones = %s
                    WHERE id_registro_jornada = %s
                """, (nueva_entrada, nueva_salida, motivo, id_registro))
            else:
                dia = fecha.strftime('%A')  # obtener el nombre del día
                cur.execute("""
                    INSERT INTO registro_jornada (
                        id_empleado,
                        id_periodo,
                        fecha,
                        dia,
                        hora_entrada,
                        hora_salida,
                        estado_jornada,
                        horas_normales_trabajadas,
                        observaciones
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_empleado,
                    id_periodo,
                    fecha,
                    dia,
                    hora_entrada,
                    hora_salida,
                    'Incompleta',
                    0,
                    motivo
                ))

            conn.commit()

    @staticmethod
    def registrar_incidencia_asistencia(
            id_empleado,
            fecha,
            dia,
            tipo,
            descripcion
    ):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            #corrobar si ya existe o no 
            cur.execute("""
            SELECT 1 FROM incidencia_asistencia
            WHERE id_empleado = %s AND fecha = %s
            """, (id_empleado, fecha))

            if cur.fetchone():
                raise ValueError("Ya existe una incidencia registrada para ese empleado en esa fecha.")

            # 2. Obtener o crear el periodo
            cur.execute("SELECT obtener_o_crear_periodo_empleado(%s, %s);", (id_empleado, fecha))
            id_periodo = cur.fetchone()[0]

            # 3. Insertar en incidencia_asistencia
            cur.execute("""
                INSERT INTO incidencia_asistencia (
                    id_empleado,
                    id_periodo,
                    fecha,
                    dia,
                    tipo,
                    descripcion
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                id_empleado,
                id_periodo,
                fecha,
                dia,
                tipo,
                descripcion
            ))

            conn.commit()
            print("✅ Incidencia en asistencia registrada correctamente")

        except Exception as e:
            if conn:
                conn.rollback()
            print("❌ Error al registrar incidencia:", e)
            raise e

        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
    
    @staticmethod
    def registrar_asistencia_biometrica(
        id_empleado,
        fecha,
        tipo,
        hora,
        estado_asistencia,
        turno_asistencia  
    ):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            
            #corrobar si ya existe o no 
            cur.execute("""
            SELECT 1 FROM asistencia_biometrica
            WHERE id_empleado = %s AND fecha = %s AND tipo = %s
            """, (id_empleado, fecha,tipo))

            if cur.fetchone():
                raise ValueError(f"Ya existe una asistencia registrada de tipo {tipo} para ese empleado en esa fecha.")

            # 2. Obtener o crear el periodo
            cur.execute("SELECT obtener_o_crear_periodo_empleado(%s, %s);", (id_empleado, fecha))
            id_periodo = cur.fetchone()[0]
            
            #obtenemos el puesto
            cur.execute("SELECT id_puesto FROM informacion_laboral WHERE id_empleado= %s;", (id_empleado,))
            puesto_resultado = cur.fetchone()
            if not puesto_resultado:
                raise ValueError("El empleado no tiene información laboral registrada.")
            id_puesto = puesto_resultado[0]


            # 3. Insertar en incidencia_asistencia
            cur.execute("""
            INSERT INTO asistencia_biometrica (
            id_empleado,
            id_periodo,
            id_puesto,
            fecha,
            tipo,
            hora,
            estado_asistencia,
            turno_asistencia
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            id_empleado,
            id_periodo,
            id_puesto,
            fecha,
            tipo,
            hora,
            estado_asistencia,
            turno_asistencia
        ))

            conn.commit()
            print("✅ asistencia biometrica registrada correctamente")

        except Exception as e:
            if 'conn' in locals():
                conn.rollback()
            print("❌ Error al registrar asistencia biometrica:", e)
            raise e

        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()

#METODOS para listar, obtener y eliminar categorias, puestos, departamentos
  # ----------- PUESTO -----------

    @staticmethod
    def agregar_puesto(nombre: str):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM puesto WHERE nombre = %s", (nombre,))
            if cur.fetchone():
                raise ValueError("Ya existe un puesto con ese nombre.")
            cur.execute("INSERT INTO puesto (nombre) VALUES (%s)", (nombre,))
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_puestos():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT id_puesto, nombre FROM puesto ORDER BY id_puesto ASC")
            rows = cur.fetchall()
            return [{"id_puesto": row[0], "nombre": row[1]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def eliminar_puesto(id_puesto: int):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM puesto WHERE id_puesto = %s", (id_puesto,))
            if not cur.fetchone():
                raise ValueError("El puesto no existe.")
            cur.execute("DELETE FROM puesto WHERE id_puesto = %s", (id_puesto,))
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

 # ----------- DEPARTAMENTO -----------

    @staticmethod
    def agregar_departamento(nombre: str, descripcion: str):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            cur.execute("SELECT 1 FROM departamento WHERE nombre = %s", (nombre,))
            if cur.fetchone():
                raise ValueError("Ya existe un departamento con ese nombre.")

            cur.execute(
                "INSERT INTO departamento (nombre, descripcion) VALUES (%s, %s)",
                (nombre, descripcion)
            )
            conn.commit()

        except Exception as e:
            if conn:
                conn.rollback()
            raise e

        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_departamentos():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT id_departamento, nombre, descripcion FROM departamento ORDER BY id_departamento ASC")
            rows = cur.fetchall()
            return [{"id_departamento": row[0], "nombre": row[1], "descripcion": row[2]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def eliminar_departamento(id_departamento: int):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM departamento WHERE id_departamento = %s", (id_departamento,))
            if not cur.fetchone():
                raise ValueError("El departamento no existe.")
            cur.execute("DELETE FROM departamento WHERE id_departamento = %s", (id_departamento,))
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

   # ----------- CATEGORIA -----------

    @staticmethod
    def agregar_categoria(nombre_categoria: str):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM categoria WHERE nombre_categoria = %s", (nombre_categoria,))
            if cur.fetchone():
                raise ValueError("Ya existe una categoría con ese nombre.")
            cur.execute("INSERT INTO categoria (nombre_categoria) VALUES (%s)", (nombre_categoria,))
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_categorias():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT id_categoria, nombre_categoria FROM categoria ORDER BY id_categoria ASC")
            rows = cur.fetchall()
            return [{"id_categoria": row[0], "nombre_categoria": row[1]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def eliminar_categoria(id_categoria: int):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM categoria WHERE id_categoria = %s", (id_categoria,))
            if not cur.fetchone():
                raise ValueError("La categoría no existe.")
            cur.execute("DELETE FROM categoria WHERE id_categoria = %s", (id_categoria,))
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
#configuracion de asistencias
    @staticmethod
    def listar_configuraciones_asistencia():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT clave, valor, descripcion FROM configuracion_asistencia ORDER BY clave ASC")
            rows = cur.fetchall()
            return [{"clave": row[0], "valor": str(row[1]), "descripcion": row[2]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
                
    @staticmethod
    def actualizar_configuracion_asistencia(clave: str, nuevo_valor: str):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            cur.execute("SELECT 1 FROM configuracion_asistencia WHERE clave = %s", (clave,))
            if not cur.fetchone():
                raise ValueError("Configuración no encontrada")

            cur.execute("UPDATE configuracion_asistencia SET valor = %s WHERE clave = %s", (nuevo_valor, clave))
            conn.commit()
            return {"mensaje": "Configuración actualizada"}
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

#Localidades, partidos, paises y provincias
    @staticmethod
    def listar_paises():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT codigo_pais, nombre FROM pais ORDER BY nombre ASC")
            rows = cur.fetchall()
            return [{"codigo_pais": row[0], "nombre": row[1]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_provincias():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT codigo_provincia, nombre FROM provincia ORDER BY nombre ASC")
            rows = cur.fetchall()
            return [{"codigo_provincia": row[0], "nombre": row[1]} for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_localidades():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT codigo_localidad, codigo_provincia, nombre FROM localidad ORDER BY nombre ASC")
            rows = cur.fetchall()
            return [
                {"codigo_localidad": row[0], "codigo_provincia": row[1], "nombre": row[2]}
                for row in rows
            ]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
                
    @staticmethod
    def listar_partidos():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT codigo_partido, codigo_provincia, nombre FROM partido ORDER BY nombre ASC")
            rows = cur.fetchall()
            return [
                {"codigo_partido": row[0], "codigo_provincia": row[1], "nombre": row[2]}
                for row in rows
            ]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_partidos_por_provincia(codigo_provincia: int = None):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            if codigo_provincia is None:
                cur.execute("SELECT codigo_partido, codigo_provincia, nombre FROM partido ORDER BY nombre")
            else:
                cur.execute(
                    "SELECT codigo_partido, codigo_provincia, nombre FROM partido WHERE codigo_provincia = %s ORDER BY nombre",
                    (codigo_provincia,)
                )
            filas = cur.fetchall()
            return [
                {
                    "codigo_partido": fila[0],
                    "codigo_provincia": fila[1],
                    "nombre": fila[2],
                }
                for fila in filas
            ]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    @staticmethod
    def listar_localidades_por_provincia(codigo_provincia: int = None):
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            if codigo_provincia is None:
                cur.execute(
                    "SELECT codigo_localidad, codigo_provincia, nombre FROM localidad ORDER BY nombre"
                )
            else:
                cur.execute(
                    "SELECT codigo_localidad, codigo_provincia, nombre FROM localidad WHERE codigo_provincia = %s ORDER BY nombre",
                    (codigo_provincia,),
                )
            filas = cur.fetchall()
            return [
                {
                    "codigo_localidad": fila[0],
                    "codigo_provincia": fila[1],
                    "nombre": fila[2],
                }
                for fila in filas
            ]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
##Agregar informacion laboral
    @staticmethod
    def agregar_informacion_laboral(
        id_empleado: int,
        id_departamento: int,
        id_puesto: int,
        id_categoria: int,
        fecha_ingreso: str,
        turno: str,
        hora_inicio_turno: str,
        hora_fin_turno: str,
        cantidad_horas_trabajo: int,
        tipo_contrato: str,
        estado: str,
        tipo_semana_laboral: str
    ):
        try:
            with db.get_connection() as conn:
                cur = conn.cursor()

                # Verificar si el empleado ya tiene información laboral registrada
                cur.execute("SELECT 1 FROM informacion_laboral WHERE id_empleado = %s", (id_empleado,))
                if cur.fetchone():
                    raise ValueError("El empleado ya tiene información laboral registrada.")

                # Insertar la nueva información
                cur.execute("""
                    INSERT INTO informacion_laboral (
                        id_empleado,
                        id_departamento,
                        id_puesto,
                        id_categoria,
                        fecha_ingreso,
                        turno,
                        hora_inicio_turno,
                        hora_fin_turno,
                        cantidad_horas_trabajo,
                        tipo_contrato,
                        estado,
                        tipo_semana_laboral
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_empleado,
                    id_departamento,
                    id_puesto,
                    id_categoria,
                    fecha_ingreso,
                    turno,
                    hora_inicio_turno,
                    hora_fin_turno,
                    cantidad_horas_trabajo,
                    tipo_contrato,
                    estado,
                    tipo_semana_laboral
                ))

                conn.commit()
                return {"mensaje": "Información laboral registrada correctamente"}

        except Exception as e:
            if 'conn' in locals():
                conn.rollback()
            print("❌ Error al agregar informaicon laboral:", e)
            raise e

        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()

    @staticmethod
    def buscar_informacion_laboral_completa_por_id_empleado(id_empleado: int):
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            query = """
                SELECT 
                    il.id_departamento,
                    il.id_puesto,
                    il.id_categoria,
                    il.fecha_ingreso,
                    il.turno,
                    il.hora_inicio_turno,
                    il.hora_fin_turno,
                    il.cantidad_horas_trabajo,
                    il.tipo_contrato,
                    il.estado,
                    il.tipo_semana_laboral
                FROM informacion_laboral il
                WHERE il.id_empleado = %s
                ORDER BY il.fecha_ingreso DESC
                LIMIT 1
            """
            cur.execute(query, (id_empleado,))
            return cur.fetchone()

        except Exception as e:
            print(f"Error al buscar información laboral completa: {str(e)}")
            raise ValueError(f"No se pudo obtener la información laboral completa: {str(e)}")
        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def modificar_informacion_laboral(
        id_empleado: int,
        id_departamento: int,
        id_puesto: int,
        id_categoria: int,
        fecha_ingreso: date,
        turno: str,
        hora_inicio_turno: time,
        hora_fin_turno: time,
        cantidad_horas_trabajo: int,
        tipo_contrato: str,
        estado: str,
        tipo_semana_laboral: str
    ):
        try:
            with db.get_connection() as conn:
                cur = conn.cursor()

                # Verificar que exista información laboral para este empleado
                cur.execute("SELECT 1 FROM informacion_laboral WHERE id_empleado = %s", (id_empleado,))
                if not cur.fetchone():
                    raise ValueError("No se encontró información laboral registrada para este empleado.")

                # Actualizar la información laboral
                cur.execute("""
                    UPDATE informacion_laboral
                    SET
                        id_departamento = %s,
                        id_puesto = %s,
                        id_categoria = %s,
                        fecha_ingreso = %s,
                        turno = %s,
                        hora_inicio_turno = %s,
                        hora_fin_turno = %s,
                        cantidad_horas_trabajo = %s,
                        tipo_contrato = %s,
                        estado = %s,
                        tipo_semana_laboral = %s
                    WHERE id_empleado = %s
                """, (
                    id_departamento,
                    id_puesto,
                    id_categoria,
                    fecha_ingreso,
                    turno,
                    hora_inicio_turno,
                    hora_fin_turno,
                    cantidad_horas_trabajo,
                    tipo_contrato,
                    estado,
                    tipo_semana_laboral,
                    id_empleado
                ))

                conn.commit()
                return {"mensaje": "Información laboral actualizada correctamente"}

        except Exception as e:
            if 'conn' in locals():
                conn.rollback()
            print("❌ Error al modificar información laboral:", e)
            raise e

        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()

    @staticmethod
    def obtener_periodos_unicos():
        conn = None
        cur = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()
            cur.execute("""
                SELECT DISTINCT periodo_texto
                FROM periodo_empleado
                ORDER BY periodo_texto
            """)
            rows = cur.fetchall()
            return [row[0] for row in rows]
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()