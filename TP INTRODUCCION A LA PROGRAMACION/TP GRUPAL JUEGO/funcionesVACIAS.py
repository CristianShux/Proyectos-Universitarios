from principal import *
from configuracion import *
import random
from random import choice
import math


#Da una nueva palabra aleatoria de una lista de palabras
def nuevaPalabra(lista):
    aleatorio=choice(lista)
    return aleatorio

#Lee toma una lista de palabras y devuelve otra lista con las palabras del largo deseado
def lectura(archivo, salida, largo):
    lemario=archivo.readlines()
    for elemento in lemario:
        if len(elemento)==largo+1:
            pal=elemento[0:largo] ##hace que tome de 0 hasta largo
            salida.append(pal)


# Revisa por posicion aquellas letras que en PalabraCorrecta que estan o no en la palabra ingresada por el usuario o en otra posicion
def revision(palabraCorrecta, palabra, correctas, incorrectas, casi):
    if palabra!=palabraCorrecta:
        for i in range(len(palabraCorrecta)):
            if palabra[i] in palabraCorrecta:
                if palabra[i]==palabraCorrecta[i]:
                    correctas.append(palabra[i])
                else:
                    casi.append(palabra[i])
            else:
                incorrectas.append(palabra[i])
        print(correctas)
        print(incorrectas)
        print(casi)
        return False
    return True









