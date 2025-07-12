import psycopg2
from datetime import datetime, timedelta, date
from typing import Optional, List
from api.schemas import NominaBase, NominaResponse, ReciboResponse
from .database import db
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os

class NominaCRUD:
    def __init__(self):

        self.db = db

    @staticmethod
    def calcular_nomina(id_usuario: int, id_empleado: int, periodo_texto: str, fecha_calculo: str, tipo: str):
        with db.get_connection() as conn:
            try:
                conn = db.get_connection()
                cur = conn.cursor()

                if isinstance(fecha_calculo, str):
                    fecha_calculo_dt = datetime.strptime(fecha_calculo, '%Y-%m-%d').date()
                else:
                    fecha_calculo_dt = fecha_calculo  # ya es date
                fecha_de_pago = fecha_calculo_dt

                # Obtener id_periodo y presentismo
                cur.execute("""
                    SELECT id_periodo, presentismo 
                    FROM periodo_empleado 
                    WHERE id_empleado = %s AND periodo_texto = %s
                """, (id_empleado, periodo_texto))
                row = cur.fetchone()
                if not row:
                    raise ValueError("Período no encontrado")
                id_periodo, tiene_presentismo = row

                # Obtener tipos de nómina ya calculados para ese periodo
                cur.execute("""
                    SELECT tipo FROM nomina 
                    WHERE id_empleado = %s AND id_periodo = %s
                """, (id_empleado, id_periodo))
                tipos_existentes = [row[0].lower() for row in cur.fetchall()]

                tipo_actual = tipo.lower()

                if tipo_actual == "mensual":
                    if "mensual" in tipos_existentes:
                        raise ValueError("Ya existe una nómina mensual para este período.")
                    if "primera quincena" in tipos_existentes or "segunda quincena" in tipos_existentes:
                        raise ValueError(
                            "No se puede calcular una nómina mensual si ya existen quincenas para ese período.")
                elif tipo_actual == "primera quincena":
                    if "mensual" in tipos_existentes:
                        raise ValueError("No se puede calcular la primera quincena si ya existe una nómina mensual.")
                    if "primera quincena" in tipos_existentes:
                        raise ValueError("Ya existe una nómina de primera quincena para este período.")
                elif tipo_actual == "segunda quincena":
                    if "mensual" in tipos_existentes:
                        raise ValueError("No se puede calcular la segunda quincena si ya existe una nómina mensual.")
                    if "primera quincena" not in tipos_existentes:
                        raise ValueError("No se puede calcular la segunda quincena sin haber calculado la primera.")
                    if "segunda quincena" in tipos_existentes:
                        raise ValueError("Ya existe una nómina de segunda quincena para este período.")

                # Obtener salario base
                cur.execute("""
                    SELECT s.valor_por_defecto
                    FROM salario_base s
                    INNER JOIN informacion_laboral i 
                    ON i.id_puesto = s.id_puesto AND i.id_categoria = s.id_categoria AND i.id_departamento = s.id_departamento
                    WHERE i.id_empleado = %s AND %s BETWEEN s.fecha_inicio AND COALESCE(s.fecha_fin, CURRENT_DATE)
                    ORDER BY s.fecha_inicio DESC
                    LIMIT 1
                """, (id_empleado, fecha_calculo_dt))
                salario_base_row = cur.fetchone()
                if not salario_base_row:
                    raise ValueError("Salario base no encontrado")
                salario_base = float(salario_base_row[0])

                if tipo.lower() in ["primera quincena", "segunda quincena"]:
                    salario_base = salario_base / 2
                # Obtener horas normales trabajadas
                cur.execute("""
                    SELECT SUM(horas_normales_trabajadas) 
                    FROM registro_jornada 
                    WHERE id_periodo = %s
                """, (id_periodo,))
                horas_normales = cur.fetchone()[0] or 0
                if horas_normales == 0:
                    raise ValueError("No se registraron horas normales")

                valor_hora = round(salario_base / horas_normales, 2)

                # Actualizar valor hora en periodo_empleado
                cur.execute("""
                    UPDATE periodo_empleado 
                    SET valor_hora = %s 
                    WHERE id_periodo = %s
                """, (valor_hora, id_periodo))

                # Calcular horas extra
                cur.execute("""
                    SELECT rhe.cantidad_horas, rhe.tipo_hora_extra
                    FROM registro_hora_extra rhe
                    JOIN registro_jornada rj ON rj.id_registro_jornada = rhe.id_registro_jornada
                    WHERE rj.id_periodo = %s
                """, (id_periodo,))
                horas_extra_total = 0
                for cantidad, tipo_extra in cur.fetchall():
                    if tipo_extra == "50%":
                        horas_extra_total += cantidad * valor_hora * 1.5
                    elif tipo_extra == "100%":
                        horas_extra_total += cantidad * valor_hora * 2
                horas_extra_total = round(horas_extra_total, 2)

                # Obtener conceptos de deducción
                cur.execute("""
                    SELECT descripcion, valor_por_defecto 
                    FROM concepto 
                    WHERE tipo_concepto = 'Deducción'
                """)
                descuentos = {desc: (float(valor) / 100) * salario_base for desc, valor in cur.fetchall()}

                # Obtener bono presentismo si existe
                cur.execute("""
                    SELECT valor_por_defecto 
                    FROM concepto 
                    WHERE descripcion = 'Bono Presentismo'
                """)
                row = cur.fetchone()
                bono_presentismo = float(row[0]) * salario_base if tiene_presentismo and row else 0.0

                sueldo_bruto = salario_base + bono_presentismo + horas_extra_total
                total_descuentos = sum(descuentos.values())
                sueldo_neto = sueldo_bruto - total_descuentos

                # Armar datos
                nomina_data = {
                    'id_empleado': id_empleado,
                    'id_periodo': id_periodo,
                    'fecha_de_pago': fecha_de_pago,
                    'salario_base': salario_base,
                    'bono_presentismo': bono_presentismo,
                    'bono_antiguedad': 0.0,
                    'horas_extra': horas_extra_total,
                    'descuento_jubilacion': descuentos.get("Jubilación", 0.0),
                    'descuento_obra_social': descuentos.get("Obra Social", 0.0),
                    'descuento_anssal': descuentos.get("ANSSAL", 0.0),
                    'descuento_ley_19032': descuentos.get("Ley 19032", 0.0),
                    'impuesto_ganancias': descuentos.get("Ganancias", 0.0),
                    'descuento_sindical': descuentos.get("Aporte Sindical", 0.0),
                    'sueldo_bruto': sueldo_bruto,
                    'sueldo_neto': sueldo_neto,
                    'estado': 'Pendiente',
                    'tipo': tipo
                }

                columns = ', '.join(nomina_data.keys())
                placeholders = ', '.join(['%s'] * len(nomina_data))
                cur.execute(
                    f"INSERT INTO nomina ({columns}) VALUES ({placeholders}) RETURNING id_nomina",
                    list(nomina_data.values())
                )

                id_nomina = cur.fetchone()[0]

                # Guardamos en logs
                cur.execute(
                    """
                    INSERT INTO log_nomina (id_nomina, id_usuario, accion, detalle)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (id_nomina, id_usuario, 'CREACIÓN',
                     f'Nómina generada para el periodo {periodo_texto} - tipo {tipo}')
                )

                conn.commit()

                # Devolver nomina completa
                cur.execute("SELECT * FROM nomina WHERE id_nomina = %s", (id_nomina,))
                row = cur.fetchone()
                columns = [desc[0] for desc in cur.description]
                nomina_dict = dict(zip(columns, row))



                # Agregar campo periodo
                cur.execute("""
                    SELECT periodo_texto 
                    FROM periodo_empleado 
                    WHERE id_periodo = %s
                """, (id_periodo,))
                periodo_row = cur.fetchone()
                if periodo_row:
                    nomina_dict['periodo'] = periodo_row[0]

                return nomina_dict



            except psycopg2.Error as e:
                if conn:
                    conn.rollback()
                raise ValueError(f"Error de base de datos: {str(e)}")
            except Exception as e:
                if conn:
                    conn.rollback()
                raise ValueError(f"Error general al calcular nómina: {str(e)}")
            finally:
                if conn:
                    db.return_connection(conn)

    @staticmethod
    def obtener_nomina(id_nomina: int) -> Optional[ReciboResponse]:
        """Devuelve una nómina como Pydantic model"""
        conn = None
        try:
            conn = db.get_connection()
            cur = conn.cursor()

            cur.execute("SELECT * FROM recibo_sueldo WHERE id_nomina=%s", (id_nomina,))
            result = cur.fetchone()

            if not result:
                return None

            columns = [desc[0] for desc in cur.description]
            nomina_dict = dict(zip(columns, result))
            return ReciboResponse(**nomina_dict)

        finally:
            if conn:
                db.return_connection(conn)

    @staticmethod
    def obtener_nominas_empleado(id_empleado: int) -> List[ReciboResponse]:
        """Devuelve todas las nóminas del empleado como Pydantic models"""
        conn = None
        try:
            conn = db.get_connection()  # <- asumimos que 'db' está definido globalmente
            cur = conn.cursor()

            cur.execute("""
                    SELECT * FROM recibo_sueldo 
                    WHERE id_empleado=%s
                    ORDER BY fecha_de_pago DESC
                """, (id_empleado,))

            columns = [desc[0] for desc in cur.description]
            return [ReciboResponse(**dict(zip(columns, row))) for row in cur.fetchall()]

        finally:
            if conn:
                db.return_connection(conn)



    def generar_recibo_pdf(
            id_nomina: int,
            nombre_empleado: str,
            periodo: str,
            fecha_de_pago: str,
            salario_base: float,
            bono_presentismo: float,
            horas_extra: float,
            descuento_jubilacion: float,
            descuento_obra_social: float,
            sueldo_neto: float
    ) -> str:
        # Ruta donde se guarda el archivo
        filename = f"./pdfs/recibo_{id_nomina}.pdf"
        os.makedirs(os.path.dirname(filename), exist_ok=True)

        # Crear el canvas
        c = canvas.Canvas(filename, pagesize=A4)
        width, height = A4

        # Escribir el contenido
        c.setFont("Helvetica-Bold", 16)
        c.drawString(200, height - 50, "Recibo de Sueldo")

        c.setFont("Helvetica", 12)
        c.drawString(50, height - 100, f"Empleado: {nombre_empleado}")
        c.drawString(50, height - 120, f"Período: {periodo}")
        c.drawString(50, height - 140, f"Fecha de pago: {fecha_de_pago}")
        c.drawString(50, height - 160, f"Salario base: ${salario_base:.2f}")
        c.drawString(50, height - 180, f"Bono por presentismo: ${bono_presentismo:.2f}")
        c.drawString(50, height - 200, f"Horas extra: ${horas_extra:.2f}")
        c.drawString(50, height - 220, f"Descuento jubilación: ${descuento_jubilacion:.2f}")
        c.drawString(50, height - 240, f"Obra social: ${descuento_obra_social:.2f}")
        c.drawString(50, height - 280, f"SUELDO NETO: ${sueldo_neto:.2f}")

        c.save()
        return filename

