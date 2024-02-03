import pygame
from funcionesVACIAS import *
from pygame.locals import *
from configuracion import *
from principal import *

def dameLetraApretada(key):
    if key == K_a:
        return("a")
    elif key == K_b:
        return("b")
    elif key == K_c:
        return("c")
    elif key == K_d:
        return("d")
    elif key == K_e:
        return("e")
    elif key == K_f:
        return("f")
    elif key == K_g:
        return("g")
    elif key == K_h:
        return("h")
    elif key == K_i:
        return("i")
    elif key == K_j:
        return("j")
    elif key == K_k:
        return("k")
    elif key == K_l:
        return("l")
    elif key == 241: ##agregamos la Ñ (241 es el codigo de la ñ)
        return("ñ") ##aca esta la Ñ
    elif key == K_m:
        return("m")
    elif key == K_n:
        return("n")
    elif key == K_o:
        return("o")
    elif key == K_p:
        return("p")
    elif key == K_q:
        return("q")
    elif key == K_r:
        return("r")
    elif key == K_s:
        return("s")
    elif key == K_t:
        return("t")
    elif key == K_u:
        return("u")
    elif key == K_v:
        return("v")
    elif key == K_w:
        return("w")
    elif key == K_x:
        return("x")
    elif key == K_y:
        return("y")
    elif key == K_z:
        return("z")
    elif key == K_SLASH:
        return("-")
    elif key == K_KP_MINUS:
        return("-")
    elif key == K_SPACE:
       return(" ")
    else:
        return("")


def dibujar(screen, listaDePalabrasUsuario, palabraUsuario, puntos, segundos, gano,
                correctas, incorrectas, casi,intentos ,palabrasAcertadas):
    ##Agregamos tamañanos y formatos de letras
    defaultFontChica = pygame.font.Font( pygame.font.get_default_font(), TAMANNO_LETRA_CHICA)
    defaultFont = pygame.font.Font( pygame.font.get_default_font(), TAMANNO_LETRA)
    defaultFontMediana = pygame.font.Font( pygame.font.get_default_font(), TAMANNO_LETRA_MEDIANA)
    defaultFontUsuario = pygame.font.Font( pygame.font.get_default_font(), TAMANNO_LETRA_USER)
    defaultFontGrande = pygame.font.Font( pygame.font.get_default_font(), TAMANNO_LETRA_GRANDE)

    ##Agregamos un rectangulo que contiene el puntaje y las palabras acertadas(Rectangulo Superior Derecha)
    pygame.draw.rect(screen, COLOR_RECT2 , (ANCHO-205,8,200,70))
    pygame.draw.rect(screen, COLOR_RECT , (ANCHO-200,13,190,60))


    #Linea Horizontal
    pygame.draw.line(screen, (255,255,255), (0, ALTO-70) , (ANCHO, ALTO-70), 5)

    #muestra lo que escribe el jugador
    screen.blit(defaultFontUsuario.render(palabraUsuario.center(50), 1, blanco), (360, 580))

    ##Agregamos una linea abajo de las palabras que ingrese el usuario
    pygame.draw.line(screen, (blanco), (530, 620) , (730, 620), 5)

    #muestra el puntaje
    screen.blit(defaultFont.render("Puntos: " + str(puntos), 1, blanco), (ANCHO-165, 20))

    ##Mostrar Palabras Acertadas
    screen.blit(defaultFont.render("Acertadas: " + str(palabrasAcertadas), 1, blanco), (ANCHO-165, 50))

    ##Agregamos un rectangulo que contiene el tiempo y los intentos(Segundo rectangulo Superior Izquierda
    pygame.draw.rect(screen, COLOR_RECT2 , (5,10,200,70))
    pygame.draw.rect(screen, COLOR_RECT , (10,15,190,60))



    #muestra los segundos y puede cambiar de color con el tiempo
    if(segundos<15):
        ren = defaultFont.render("Tiempo: " + str(int(segundos)), 1, rojo)
    else:
        ren = defaultFont.render("Tiempo: " + str(int(segundos)), 1, blanco)
    screen.blit(ren, (40, 20))

    ##Agregamos un texto que nos muestra cuantos intentos tenemos
    screen.blit(defaultFont.render("Intentos: " + str(intentos), 1, blanco), (40, 50))

    #muestra las palabras anteriores, las que se fueron arriesgando
    pos = 0
    for palabra in listaDePalabrasUsuario:
        screen.blit(defaultFontGrande.render(palabra, 1, blanco), (ANCHO//2-len(palabra)*TAMANNO_LETRA_GRANDE//4,20 + 80*pos))
        pos += 1

    ##Agregamos un rectangulo sobre las letras (Rectangulo sobre las Letras)
    pygame.draw.rect(screen,blanco,(30,497,265,105))
    pygame.draw.rect(screen,negro,(33,499,260,100))

    ##Agregamos un cartel que avisa cuanto caracteres se deben agregar y si se encuentra en el diccionario
    if len(palabraUsuario)<LARGO:
        screen.blit(defaultFont.render("¡Ingrese una palabra de 5 caracteres!",1,blanco),(450,670))
    else:
        if len(palabraUsuario)>LARGO:
            screen.blit(defaultFont.render("¡Esta palabra no se encuentra en el diccionario!",1,rojo),(420,670))

    ##Muestra el ABCDARIO con colores en las letras
    abcdario = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"]
    y=340 ##asignamos a "Y"= 340
    for abc in abcdario:
        x = 60 ## le asignamos a "X"= 60
        for letra in abc:
            color = COLOR_LETRAS
            ## Agregamos esto para darle color a las letras correctas, incorrectas y parcialmente correctas
            if letra in correctas and not gano:
                screen.blit(defaultFont.render(letra, 1, COLOR_LE_CORRECTA), (5 + x, ALTO/4 + y))
            else:
                if letra in incorrectas and not gano:
                    screen.blit(defaultFont.render(letra, 1, COLOR_LE_INCORRECTA), (5 + x, ALTO/4 + y))
                else:
                    if letra in casi and not gano:
                        screen.blit(defaultFont.render(letra, 1, COLOR_LE_CASI), (5 + x, ALTO/4 + y))
                    else:
                        screen.blit(defaultFont.render(letra, 1, color), (5 + x, ALTO/4 + y))
            x += TAMANNO_LETRA
        y += TAMANNO_LETRA








