import re
from api.schemas import EmpleadoBase


def validar_nombre(nombre: str):
    patron = r"^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$"  # Permite letras, con acento y espacios
    nombre_valido = bool(re.match(patron, nombre))
    if not nombre_valido:
        raise ValueError(f"Nombre invalido: '{nombre}'. Deberian ser solo letras")
    return


def validar_apellido(apellido: str):
    patron = r"^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$"  # Permite letras, con acento y espacios
    apellido_valido = bool(re.match(patron, apellido))
    if not apellido_valido:
        raise ValueError(f"Apellido invalido: '{apellido}. Deberian ser solo letras")
    return


def validar_correo_electronico(correo_electronico: str):
    patron = r"^[\w\.-]+@[\w\.-]+\.\w+$"  # Solo el formato de mail
    correo_valido = bool(re.match(patron, correo_electronico))
    if not correo_valido:
        raise ValueError(
            f"Correo electronico invalido: '{correo_electronico}'. El formato no es correcto"
        )
    return


def validar_telefono(telefono: str):
    if telefono == "":  # Deja que el telefono este vacio
        return

    patron = r"^\+?[\d\s\-()]+$"  # Puede iniciar con + y se permiten numeros, espacios, guiones y parentesis
    telefono_valido = bool(re.match(patron, telefono))
    if not telefono_valido:
        raise ValueError(f"Telefono invalido: '{telefono}'")
    return


def validar_calle(calle: str):
    patron = r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.'\-]+$"  # Se permiten letras, con acento, numeros, espacios y ciertos caracteres especiales
    calle_valida = bool(re.match(patron, calle))
    if not calle_valida:
        raise ValueError(f"Calle invalida: '{calle}'")
    return


def validar_numero_calle(numero_calle: str):
    if len(numero_calle) > 5 or not numero_calle.isdigit():
        raise ValueError(
            f"Numero de calle invalido: '{numero_calle}'. Solo se permiten caracteres numericos"
        )
    return


def validar_localidad(localidad: str):
    patron = r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.'\-]+$"  # Se permiten letras, con acento, numeros, espacios y ciertos caracteres especiales
    localidad_valida = bool(re.match(patron, localidad))
    if not localidad_valida:
        raise ValueError(f"Localidad invalida: '{localidad}'")
    return


def validar_partido(partido: str):
    patron = r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.]+$"
    partido_valido = bool(re.match(patron, partido))
    if not partido_valido:
        raise ValueError(f"Partido invalido: '{partido}'")
    return


def validar_provincia(provincia: str):
    provincias_validas = [
        "Buenos Aires",
        "Catamarca",
        "Chaco",
        "Chubut",
        "Córdoba",
        "Corrientes",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tierra del Fuego",
        "Tucumán",
        "Ciudad Autónoma de Buenos Aires",
    ]
    if provincia not in provincias_validas:
        raise ValueError(f"Provincia inválida. Opciones válidas: {provincias_validas}")
    return


def validar_genero(genero: str):
    generos_validos = [
        "Masculino",
        "Femenino",
        "No binario",
        "Prefiere no especificar",
        "Otro",
    ]
    if genero not in generos_validos:
        raise ValueError(f"Género inválido. Opciones válidas: {generos_validos}")
    return


def validar_pais_nacimiento(pais_nacimiento: str):
    nacionalidades_validas = [
        "Argentina",
        "Brasil",
        "Chile",
        "Uruguay",
        "Paraguay",
        "Bolivia",
        "Perú",
        "Ecuador",
        "Colombia",
        "Venezuela",
        "México",
    ]
    if pais_nacimiento not in nacionalidades_validas:
        raise ValueError(
            f"Nacionalidad inválida. Opciones válidas: {nacionalidades_validas}"
        )
    return


def validar_tipo_identificacion(tipo_identificacion: str):
    tipos_identificacion_validos = ["DNI", "Pasaporte", "Cédula"]
    if tipo_identificacion not in tipos_identificacion_validos:
        raise ValueError(
            f"Tipo de identificación inválido. Opciones válidas: {tipos_identificacion_validos}"
        )
    return


def validar_numero_identificacion(tipo_identificacion: str, numero_identificacion: str):
    numero_identificacion_valido = False
    if tipo_identificacion == "DNI" or tipo_identificacion == "Cédula":
        numero_identificacion_valido = (
            len(numero_identificacion) >= 7 and numero_identificacion.isdigit()
        )
    elif tipo_identificacion == "Pasaporte":
        numero_identificacion_valido = (
            len(numero_identificacion) >= 6 and numero_identificacion.isalnum()
        )

    if not numero_identificacion_valido:
        raise ValueError(
            f"El formato del numero de identificacion para '{tipo_identificacion}' no es valida"
        )
    return


def validar_estado_civil(estado_civil: str):
    estados_civiles_validos = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"]
    if estado_civil not in estados_civiles_validos:
        raise ValueError(
            f"Estado civil invalido. Opciones validas: {estados_civiles_validos}"
        )


def validar_datos_empleado(empleado: EmpleadoBase):
    validar_nombre(empleado.nombre)
    validar_apellido(empleado.apellido)
    validar_tipo_identificacion(empleado.tipo_identificacion)
    validar_numero_identificacion(
        empleado.tipo_identificacion, empleado.numero_identificacion
    )
    validar_correo_electronico(empleado.correo_electronico)
    validar_telefono(empleado.telefono)
    validar_calle(empleado.calle)
    validar_numero_calle(empleado.numero_calle)
    validar_localidad(empleado.localidad)
    validar_partido(empleado.partido)
    validar_provincia(empleado.provincia)
    validar_pais_nacimiento(empleado.pais_nacimiento)
    validar_genero(empleado.genero)
    validar_estado_civil(empleado.estado_civil)


def validar_actualizar_datos_empleado(
    telefono: str = None,
    correo_electronico: str = None,
    calle: str = None,
    numero_calle: str = None,
    localidad: str = None,
    partido: str = None,
    provincia: str = None,
):
    if telefono:
        validar_telefono(telefono)

    if correo_electronico:
        validar_correo_electronico(correo_electronico)

    if calle:
        validar_calle(calle)

    if numero_calle:
        validar_numero_calle(numero_calle)

    if localidad:
        validar_localidad(localidad)

    if partido:
        validar_partido(partido)

    if provincia:
        validar_provincia(provincia)
