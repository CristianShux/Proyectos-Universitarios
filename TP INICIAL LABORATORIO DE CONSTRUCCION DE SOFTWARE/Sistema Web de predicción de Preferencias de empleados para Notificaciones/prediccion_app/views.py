import os
import pandas as pd
from joblib import load
from .forms import EmpleadoForm, EmpleadosForm
from django.shortcuts import render, redirect
from prediccion_preferencias.model.UsoModelo import generar_dato, predecir, generar_prediccion_en_cantidad
# Create your views here.
empleado = {
    'nombre': 'Juan',
    'apellido': 'Pérez',
    'edad': 30,
    'antiguedad': 5,
    'departamento': 'Ventas',
    'preferencia': 'No definida'
}

# Cargar modelo y objetos necesarios

# Obtenemos la ruta base del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Cargamos el modelo previamente entrenado desde un archivo .joblib
clf = load(os.path.join(BASE_DIR, 'modelo_entrenado.joblib'))

# Cargamos el preprocesador para transformar los datos de entrada igual que en entrenamiento
preprocessor = load(os.path.join(BASE_DIR, 'preprocessor.joblib'))
#Cargamos el datasetFicticio preparado
df = load(os.path.join(BASE_DIR, 'data_set_ficticio.joblib'))

# Renderiza la página principal del sitio.
def index(request):
    return render(request, 'index.html')

# Procesa el formulario de un solo empleado, genera el dato y predice su preferencia.
# Si el formulario es válido, redirige a la vista de preferencia con los resultados.
def prediccion(request):
    if request.method == 'POST':
        form = EmpleadoForm(request.POST)
        if form.is_valid():
            empleado['nombre'] = request.POST['nombre']
            empleado['apellido'] = request.POST['apellido']
            empleado['edad'] = request.POST['edad']
            empleado['antiguedad'] = request.POST['antiguedad']
            empleado['departamento'] = request.POST['departamento']
            nuevo_dato = generar_dato(empleado['edad'], empleado['antiguedad'], empleado['departamento'], preprocessor)
    
            #Llamamos a la funcion de prediccion el modelo cargado
            empleado['preferencia'] = predecir(nuevo_dato, clf)    
            return redirect("/preferencia")
        
    return render(request, 'prediccion.html', {
        'form': EmpleadoForm(),
        })

# Carga los datos de entrenamiento desde un archivo Excel.
# Convierte los registros a diccionarios y los pasa al template para visualizarlos.
def datos_entrenamiento(request):
    registros = df.to_dict(orient='records')
    
    return render(request, 'datos_entrenamiento.html', {'registros': registros, 'columnas': df.columns})

# Muestra la preferencia predicha para el empleado cargado.
def preferencia(request):
    return render(request, 'preferencia.html', {
        'empleado': empleado
    })

# Procesa un archivo con múltiples empleados, genera las predicciones y devuelve los resultados.
# Los datos predichos se muestran en una tabla en la plantilla correspondiente.
def prediccion_empleados(request):
    registros = []
    columnas = []
    if request.method == 'POST':
        form2 = EmpleadosForm(request.POST, request.FILES)
        if form2.is_valid():
            empleados = request.FILES.get('empleados')
            tablas_empleados = generar_prediccion_en_cantidad(empleados, preprocessor, generar_dato, predecir, clf)
            registros = tablas_empleados.to_dict(orient='records')
            columnas = tablas_empleados.columns
            print("Registros generados:", registros)
    else:
        form2 = EmpleadosForm()
    print("Registros:", registros)
    print("Columnas:", columnas)
    return render(request, 'prediccion_empleados.html', {
        'form2': form2,
        'registros': registros,
        'columnas': columnas
    })