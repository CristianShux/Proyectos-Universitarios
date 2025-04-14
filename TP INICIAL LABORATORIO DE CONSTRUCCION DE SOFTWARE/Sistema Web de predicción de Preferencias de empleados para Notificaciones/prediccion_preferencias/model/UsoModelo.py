import pandas as pd
import os
import numpy as np
from sklearn import tree #Contiene las funciones necesarias para construir el arbol de decision
import matplotlib.pyplot as plt #Para visualizar graficos(como la estructura de arbol)
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

#Importaciones para la preparacion de datos
from sklearn.preprocessing import LabelEncoder, OneHotEncoder #Para convertir datos categoricos en valores numericos.
from sklearn.compose import ColumnTransformer #Para aplicar transformaciones a columnas especificas.
from sklearn.model_selection import train_test_split #Para dividir los datos en entrenamiento y prueba
from sklearn.tree import plot_tree #Para visualizar graficamente el arbol de decision
from joblib import dump
from joblib import load


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))

# Cargamos el modelo previamente entrenado desde un archivo .joblib
df = load(os.path.join(BASE_DIR, 'data_set_ficticio.joblib'))

# Codificar la variable Preferencia a números
# LabelEnconder: Asigna un número único a cada categoría
label_encoder = LabelEncoder()

#Comienzo del Preprocesamiento de los datos(X)
# Definir qué columnas son numéricas y cuáles categóricas para el preprocesamiento
numerical_features = ['Edad', 'Antigüedad'] #Son numericas por lo tanto no necesitan cambios
categorical_features = ['Departamento'] #Es categorica hay que convertirla a numeros

# Crear el preprocesador con ColumnTransformer
# OneHotEncoder: convierte Departamento en variables categóricas (formato numérico que usan los algoritmos de machine learning)
# passthrough: mantiene a las numéricas como están (Edad, Antigüedad)
# handle_unknown='ignore: si en el futuro aparecen departamentos no vistos en el entrenamiento
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features) #Convierte Departamento en columnas binarias(una por cada posible valor)
    ],
    remainder='passthrough' # Mantiene otras columnas si las hubiera (ninguna en este caso)
    )

def entrenamiento_del_modelo():
    # Seleccionar características (X) y variable objetivo (y)
    # Excluimos Nombre y Apellido ya que no deberían influir en la preferencia
    features = ['Edad', 'Antigüedad', 'Departamento'] 
    target = 'Preferencia'

    X = df[features]
    y = df[target]

    # # Codificar la variable Preferencia a números
    y_encoded = label_encoder.fit_transform(y) #Aprende las categorias de Y y las convierte en numero: 0,1,2
    clases_codificadas = label_encoder.classes_ #Recibo una lista de las categorias originales antes de codificarla
    X_processed = preprocessor.fit_transform(X)

    # Dividir los datos procesados en entrenamiento y prueba
    #Entrenamiento (train): El modelo aprende patrones de X_train y y_train. 70% de los datos (por test_size=0.3) para entrenar el modelo
    #Prueba (test): Permite evaluar si el modelo generaliza bien con datos nuevos (X_test vs y_test). 30% restante para evaluar el modelo
    X_train, X_test, y_train, y_test = train_test_split(
        X_processed, y_encoded, test_size=0.3, random_state=42, stratify=y_encoded #el random es para que la division siempre sea la misma al ejecutar el codigo.
    )                                                                              #stratify mantiene la proporcion de clase en y, para que esten bien representas en train y test.

    #Entrenar el arbol de decision
    clf = tree.DecisionTreeClassifier()
    clf = clf.fit(X_train, y_train) #Entrena con x_train(las caracteristicas) y y_train(las preferencias de los empleados codificadas)
    
    # --- Seccion de Evaluación del Modelo ---
    # Realizar predicciones sobre el conjunto de prueba
    # X_test contiene datos de empleados y predice sus preferencias de notificación
    # y_pred: array que contiene el conjunto de las nuevas predicciones
    y_pred = clf.predict(X_test)

    # Calcular la precisión (accuracy): Calcula la precisión global del modelo
    # Compara el total de predicciones (y_pred) con las predicciones correctas (y_test) y nos devuelve un porcentaje de aciertos
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Precisión del modelo en el conjunto de prueba: {accuracy:.4f}")

    # Mostrar el reporte de clasificación (precision, recall, f1-score por clase)
    # Precision: % de predicciones correctas para cada clase
    # Recall: % de casos reales detectados correctamente por el modelo.
    # F1-score: Combinación de precisión y recall (media armónica
    # Support: Número de muestras por clase.
    print("\nReporte de Clasificación:")
    # Usamos target_names para mostrar los nombres originales de las clases
    print(classification_report(y_test, y_pred, target_names=clases_codificadas, zero_division=0))

    # Mostrar la matriz de confusión: Muestra una matriz comparando predicciones vs. valores reales.
    # Nos sirve para visualizar la precisión global del modelo que fue calculada anteriormente
    print("\nMatriz de Confusión:")
    conf_matrix = confusion_matrix(y_test, y_pred)
    print(pd.DataFrame(conf_matrix, index=clases_codificadas, columns=clases_codificadas))
    
    print(f"Profundidad del árbol: {clf.get_depth()}") #Metodo que me permite ver la profundidad actual del arbol
    print(f"Número de nodos en el árbol: {clf.tree_.node_count}") #Metodo que me permite ver la cantida de nodos del arbol

    return clf

#Graficar el arbol de decision
def graficar_modelo():
    plt.figure(figsize=(20, 6))
    plot_tree(entrenamiento_del_modelo(), filled=True, fontsize=6,class_names=preprocessor.get_feature_names_out(), feature_names= preprocessor.get_feature_names_out())
    plt.tight_layout()
    plt.show()


#Crear una funcion de prediccion que usa el modelo y te dice cuál es la preferencia
def predecir(nuevoDato, clf):
    prediccion = clf.predict(nuevoDato)[0] #Recibo un nuevo dato preprocesado y usa el modelo para hacer una prediccion
    return label_encoder.inverse_transform([prediccion])[0] #Convierto la prediccion de numero a texto

#Generacion de nuevo dato para predecir, se le entregan los datos crudos y esta funcion lo convierte para usarlo en la funcion predecir
def generar_dato(edad, antiguedad, departamento,preprocessor):
    # Obtener los nombres de las columnas procesadas por OneHotEncoder
    departamentos_unicos = preprocessor.named_transformers_['cat'].categories_[0]

    # Crear el vector de entrada con 0s en todas las posiciones de los departamentos
    departamento_vector = [1 if dep == departamento else 0 for dep in departamentos_unicos]

    # Construir el vector de entrada completo
    nuevo_dato = [edad, antiguedad] + departamento_vector 
    return [nuevo_dato]  # Lo devolvemos dentro de una lista porque sklearn espera una matriz 2D

#Lo que hacemos es tomar un excel con datos de empleados y devolver el mismo pero con las preferencias predichas de los empleados.
def generar_prediccion_en_cantidad(excel, preprocessor,  funcionGenerarDato,funcionPredecir, clf):
    df=pd.read_excel(excel)
    resultados=[]

    for index, fila in df.iterrows():
        nombre=fila["Nombre"]
        apellido=fila['Apellido']
        edad=fila["Edad"]
        antiguedad=fila["Antigüedad"]
        departamento=fila["Departamento"]

        dato_generado=funcionGenerarDato(edad,antiguedad, departamento, preprocessor)
        prediccionPreferencia=funcionPredecir(dato_generado, clf)

        resultados.append({
            "Nombre": nombre,
            "Apellido": apellido,
            "Edad": edad,
            "Antigüedad": antiguedad,
            "Departamento": departamento,
            "PreferenciaPredicha": prediccionPreferencia
        })

    df_resultados=pd.DataFrame(resultados)
    df_resultados.to_excel("ConjuntoPredecido.xlsx",index=False)
    return df_resultados

# Entrenamos el modelo y guardamos el resultado para usarlo posteriormente en predicciones
dump(entrenamiento_del_modelo(), 'modelo_entrenado.joblib')

# Guardamos el preprocesador de datos para transformar nuevas instancias de entrada con el mismo pipeline usado en entrenamiento
dump(preprocessor, 'preprocessor.joblib')