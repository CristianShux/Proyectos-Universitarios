#! /usr/bin/env python
import os, random, sys, math

import pygame
from pygame.locals import *
from configuracion import *
from extras import *

from funcionesVACIAS import *

#Funcion principal

def main():

        #Centrar la ventana y despues inicializar pygame
        os.environ["SDL_VIDEO_CENTERED"] = "1"
        pygame.init()
        pygame.mixer.init()

        ##Sonido del juego
        sonido_fondo = pygame.mixer.Sound("SonidoFondo.mp3")
        pygame.mixer.Sound.play(sonido_fondo,-1)

        #Preparar la ventana
        pygame.display.set_caption("La Palabra Escondida...")
        screen = pygame.display.set_mode((ANCHO, ALTO))

        #tiempo total del juego
        gameClock = pygame.time.Clock()
        totaltime = 0
        segundos = TIEMPO_MAX
        fps = FPS_inicial

        puntos = 0
        intentos=7
        palabraUsuario = ""
        listaPalabrasDiccionario=[]
        ListaDePalabrasUsuario = []
        palabrasAcertadas=0
        correctas = []
        incorrectas = []
        casi = []
        gano = False

        ##Agregamos las variables intro y fin para imprimir en la pantalla del juego
        esta_en_fin=True
        esta_en_intro=True

        ##Agregamos Variables para utilizarlos a la hora de poner texto
        texto_fin=pygame.font.SysFont("console",70,True)
        texto_intro=pygame.font.SysFont("console",70,True)

        texto_resultado=pygame.font.SysFont("console",30,True)
        texto_nombres=pygame.font.SysFont("console",25,True)

        texto_salirJuego=pygame.font.SysFont("console",25,True)
        texto_entrarJuego=pygame.font.SysFont("console",25,True)

        ##Agregamos una intro en el juego
        while esta_en_intro:
            gameClock.tick(27)
            for evento in pygame.event.get():
                if evento.type==KEYDOWN:
                    if evento.key == K_ESCAPE:
                        pygame.quit()
                        return()
                if evento.type==pygame.QUIT:
                        quit()

            screen.fill((0,0,0))
            titulo=texto_intro.render("LA PALABRA ESCONDIDA",1,(blanco))
            jugar=texto_entrarJuego.render("Presione ENTER para jugar :)",1,(blanco))
            alumno1=texto_nombres.render("Alumnos: Ulises Ojeda Loggia",1,(blanco))
            alumno2=texto_nombres.render("Jurajuria Cristian",1,(blanco))
            comision=texto_nombres.render("COM-06",1,(blanco))
            fondo=pygame.image.load("FondoPiedras.png")

            tecla=pygame.key.get_pressed()
            screen.blit(fondo,(0,0))
            screen.blit(titulo,(250,250))
            screen.blit(jugar,(450,400))

            screen.blit(alumno1,(10,10))
            screen.blit(alumno2,(146,50))

            screen.blit(comision,(10,670))

            pygame.display.update()

            if tecla[pygame.K_RETURN]:
                esta_en_intro=False
                esta_jugando=True

        ##Hicimos que el programa lea el lemario(a su vez agregamos valores que python no entiende como la letra "ñ" utilizando encoding="utf-8-sig")
        archivo= open("lemario.txt","r", encoding="utf-8-sig")
        #lectura del diccionario
        lectura(archivo,listaPalabrasDiccionario,LARGO)


        #elige una  palabra al azar
        palabraCorrecta=nuevaPalabra(listaPalabrasDiccionario)

        #Imprime la funcion dibujar
        dibujar(screen, ListaDePalabrasUsuario, palabraUsuario, puntos,segundos, gano, correctas, incorrectas, casi, intentos, palabrasAcertadas)
        print(palabraCorrecta)
        intentos = 7

        while segundos > fps/1000 and intentos > 0:
        # 1 frame cada 1/fps segundos
            gameClock.tick(fps)
            totaltime += gameClock.get_time()

            if True:
            	fps = 60

            #Buscar la tecla apretada del modulo de eventos de pygame
            for e in pygame.event.get():

                #QUIT es apretar la X en la ventana
                if e.type == QUIT:
                    pygame.quit()
                    return()

                #Ver si fue apretada alguna tecla
                if e.type == KEYDOWN:
                    letra = dameLetraApretada(e.key)
                    palabraUsuario += letra #es la palabra que escribe el usuario
                    if e.key == K_BACKSPACE:
                        palabraUsuario = palabraUsuario[0:len(palabraUsuario)-1]
                        ##Utilizamos un Largo predefinido para que lo lea, a su vez busca todas las palabras de esa longitud en el diccionario
                    if e.key == K_RETURN and len(palabraUsuario) == LARGO and palabraUsuario in listaPalabrasDiccionario and palabraUsuario not in ListaDePalabrasUsuario:
                            gano = revision(palabraCorrecta, palabraUsuario, correctas, incorrectas, casi)
                            ListaDePalabrasUsuario.append(palabraUsuario)
                            palabraUsuario = ""
                            intentos -= 1
                            ##Agregamos esto para que se genere una nueva palabra cada vez que se adivine una y que se sumen puntos
                            if gano:
                                puntos=puntos+10
                                sonido_correctas = pygame.mixer.Sound("correcta.mp3")
                                pygame.mixer.Sound.play(sonido_correctas,0)
                                intentos=intentos+2
                                correctas = []
                                incorrectas = []
                                casi = []
                                ListaDePalabrasUsuario = []
                                palabrasAcertadas=palabrasAcertadas+1
                                palabraCorrecta=nuevaPalabra(listaPalabrasDiccionario)
                                print(palabraCorrecta)
                            else:
                                if not gano:
                                    sonido_incorrectas = pygame.mixer.Sound("incorrecta1.mp3")
                                    pygame.mixer.Sound.play(sonido_incorrectas,0)



            segundos = TIEMPO_MAX - pygame.time.get_ticks()/1000

            ##Agregamos un fondo para el juego Principal
            fondo=pygame.image.load("FondoPurpura.png")
            screen.blit(fondo,(0,0))

            #Dibujar de nuevo todo (agregamos parametros a la funcion dibujar)
            dibujar(screen, ListaDePalabrasUsuario, palabraUsuario, puntos,segundos, gano, correctas, incorrectas, casi, intentos, palabrasAcertadas)

            pygame.display.flip()


        ##Agregamos una pantalla de fin cuando se termina el juego
        while esta_en_fin:
            gameClock.tick(27)
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    quit()

            screen.fill((0,0,0))
            gameover=texto_fin.render("FIN DEL JUEGO",1,(blanco))
            aciertos=texto_resultado.render("Acertaste: "+str(palabrasAcertadas)+" palabra/s",1,(blanco))
            puntasos=texto_resultado.render("Puntaje total: "+str(puntos),1,(blanco))
            salir_juego=texto_salirJuego.render("Apreta ESC para cerrar el juego ",1,(blanco))
            fondo=pygame.image.load("FondoPiedras.png")

            screen.blit(fondo,(0,0))

            screen.blit(gameover,(400,300))

            screen.blit(puntasos,(50,550))
            screen.blit(aciertos,(50,600))

            screen.blit(salir_juego,(10,15))
            tecla=pygame.key.get_pressed()

            pygame.display.update()

            if tecla[pygame.K_ESCAPE]:
                esta_en_fin=False
                esta_jugando=True
                pygame.quit()
        archivo.close()

#Programa Principal ejecuta Main
if __name__ == "__main__":
    main()
