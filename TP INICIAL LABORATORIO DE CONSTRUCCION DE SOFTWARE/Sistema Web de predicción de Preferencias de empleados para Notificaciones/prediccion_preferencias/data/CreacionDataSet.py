import pandas as pd
import numpy as np
import random
from joblib import dump

#Cantidad de empleados a generar
cant_empleados=50

#Funcion para poder generar nombres randoms
silabas = ['ma', 'ri', 'el', 'so', 'li', 'an', 'na', 'to', 'la', 'mi', 'lu', 'ga', 'no', 'pe', 'ro', 'sa', 'te', 'vi']
def generar_nombre_silabas(min_silabas=2, max_silabas=3):
    nombre = ''.join(random.choice(silabas) for _ in range(random.randint(min_silabas, max_silabas)))
    return nombre.capitalize()

# Asignamos una preferencia según ciertas reglas
def asignar_preferencia(edad, antiguedad, departamento):
    if edad < 30 and (departamento == "IT" or departamento == "Marketing"):
        return np.random.choice(["Slack", "Notificacion Push"], p=[0.8, 0.2] if antiguedad < 3 else [0.6, 0.4])
    elif edad > 45 and (departamento == "Recursos Humanos" or departamento == "Atencion al cliente"):
        return np.random.choice(["Correo", "Slack"], p=[0.9, 0.1] if antiguedad > 10 else [0.7, 0.3])
    elif 30 < edad < 45 and (departamento == "Ventas" or departamento == "Logistica"):
        return np.random.choice(["Notificacion Push", "Correo"], p=[0.8, 0.2] if antiguedad < 5 else [0.6, 0.4])
    else:
        return np.random.choice(["Correo", "Slack", "Notificacion Push"], p=[0.5, 0.3, 0.2] if antiguedad > 10 else [0.3, 0.4, 0.3])

def creacion_data_set():
# Fijamos la semilla para reproducibilidad(esto permite que siempre nos den lo mismos numeros y por lo tanto el mismo dataset)
    np.random.seed(42)

    # Lista de nombres
    nombres=[]
    for i in range(cant_empleados):
        nombres.append(generar_nombre_silabas())
    # Lista de apellidos
    # Lista de apellidos
    apellidos = []
    for i in range(cant_empleados):
        apellidos.append(generar_nombre_silabas())
    # Generamos 50 empleados con edad entre 18 y 61 años
    edades = np.random.randint(18, 61, cant_empleados) 

    # Generamos la antigüedad en la empresa entre 0 y 20 años
    antiguedades=[]
    for edad in edades:
        antiguedades.append(np.random.randint(0, edad - 18 + 1)) #Esto lo hacemos para que me de un numero coherente teniendo en cuenta que una persona legalmente comienza a trabajar desde los 18 años

    # Generacion de 50 departamentos aleatorios
    listadoDepartamentos=["IT", "Recursos Humanos", "Ventas", "Marketing", "Atención al cliente", "Finanzas", "Logistica"]
    departamentos=[]
    for i in range(cant_empleados):
        departamentos.append(np.random.choice(listadoDepartamentos))

    preferencias = [] #Inicializo una lista
    for a, b, c in zip(edades, antiguedades, departamentos): #Zip lo que hace es combinar los valores de edades y antiguedades en pares, de tal forma en cada interacion agarro un valor de edad y otro de antiguedad
        preferencias.append(asignar_preferencia(a,b,c))

    # Crear DataFrame
    df = pd.DataFrame({"Nombre": nombres, "Apellido": apellidos, "Edad": edades, "Antigüedad": antiguedades,"Departamento": departamentos, "Preferencia": preferencias})

    df.to_excel("data_set_ficticio.xlsx", index=False)

    # Mostrar el dataframe
    return df

dump(creacion_data_set(), 'data_set_ficticio.joblib')