package juego;

import java.awt.Color;
import java.util.Random;

import entorno.Entorno;
import entorno.Herramientas;
import entorno.InterfaceJuego;

public class Juego extends InterfaceJuego {

	// El objeto Entorno que controla el tiempo y otros
	private Entorno entorno;

	private Nave nave;
	private int vidaNave;

	private Enemigo jefe;
	private int vidaJefe;

	private Enemigo[] destructores;
	private Asteroide[] asteroides;

	private Fondo fondo;

	// Contadores
	private int cantidadDePuntos;
	private int cantidadDeEnemigos; 
	private int cantidadDeGolpesDeEnemigos;
	private int ticks; 
	private int cantidadDestructores;
	private int rounds;
	private int cantidadDeKills;

	// Variables de Control
	private int enterFuePresionada;
	private boolean perdió; 
	private boolean ganó;  

	// Balas
	private Bala proyectil;
	private Bala plasma;
	private Bala superPlasma;

	private int tiempoDesdeUltimoDisparo;
	private double distanciaAlBordeInferior;

	private Random r;

	public Juego() {
		// Inicializa el objeto entorno
		this.entorno = new Entorno(this, "Lost Galaxian", 800, 600);

		// Inicializa variable Random
		this.r = new Random();

		// Creación asteroides
		this.asteroides = new Asteroide[6];
		for (int i = 0; i < asteroides.length; i++) {
			this.asteroides[i] = new Asteroide(r.nextInt(1400) - 300, -r.nextInt(500), 10);
		}

		// Creacion destructores
		this.destructores = new Enemigo[4];
		for (int i = 0; i < destructores.length; i++) {
			this.destructores[i] = new Enemigo(r.nextInt(700) + 50, (-r.nextInt(800) - (r.nextInt(500) + 200)), 4,
					true);
		}

		// Creacion Jefe
		this.jefe = new Enemigo(400, -700, 1, false);
		this.vidaJefe = 100;

		// Creacion Nave
		this.nave = new Nave(400, 550, 10);
		this.vidaNave = 100;

		// Creacion Fondo
		this.fondo = new Fondo("FondoEstrella.jpg");
		this.fondo = new Fondo("FondoEstrella.jpg");

		// Creacion Contadores
		this.cantidadDeGolpesDeEnemigos = 0;
		this.tiempoDesdeUltimoDisparo = 0;
		this.cantidadDeEnemigos = 0;
		this.cantidadDePuntos = 0;
		this.ticks = 0;
		this.cantidadDestructores = 0;
		this.rounds = 1;
		this.cantidadDeKills = 0;

		// Creacion de variables de Control
		this.perdió = false;
		this.ganó = false;

		// Inicia el juego!
		this.entorno.iniciar();
		Herramientas.cargarSonido("space.wav").loop(6);
	}

	/**
	 * Durante el juego, el método tick() será ejecutado en cada instante y por lo
	 * tanto es el método más importante de esta clase. Aquí se debe actualizar el
	 * estado interno del juego para simular el paso del tiempo (ver el enunciado
	 * del TP para mayor detalle).
	 */

	public void tick() {

		ticks++;
		// Si se presiona SHIFT se reinicia el juego en caso de haber perdido o ganado.
		if (entorno.sePresiono(entorno.TECLA_SHIFT) && perdió || entorno.sePresiono(entorno.TECLA_SHIFT) && ganó) {
			perdió = false;
			ganó = false;
			rounds = 1;

			cantidadDeEnemigos = 0;
			cantidadDestructores = 0;
			cantidadDePuntos = 0;

			vidaNave = 100;
			vidaJefe = 100;
			asteroides = new Asteroide[6];
			destructores = new Enemigo[4];

			// Creacion Jefe
			jefe = new Enemigo(400, -700, 1, false);

			// Creacion Nave
			nave = new Nave(400, 550, 10);

			// Creación asteroides
			for (int i = 0; i < asteroides.length; i++) {
				asteroides[i] = new Asteroide(r.nextInt(1400) - 300, -r.nextInt(500), 9);
			}
			// Creacion destructores
			for (int i = 0; i < destructores.length; i++) {
				destructores[i] = new Enemigo(r.nextInt(700) + 50, (-r.nextInt(800) - (r.nextInt(500) + 200)), 4, true);
			}
		}
		// CODIGO CUANDO SE GANA
		if (ganó) {
			fondo.dibujarFondo(entorno);
			fondo.mover();
			fondo.dibujarGanado(entorno);
			entorno.cambiarFont("Arial", 30, Color.WHITE);
			entorno.escribirTexto("Enemigos destruidos: " + cantidadDeEnemigos, 60, 300);
			entorno.escribirTexto("Puntaje obtenido: " + cantidadDePuntos, 460, 300);
			entorno.escribirTexto("Ronda maxima: " + rounds, 300, 340);
			nave = null;
			destructores = null;
			asteroides = null;
			if (entorno.sePresiono(entorno.TECLA_DELETE)) {
				System.exit(0);
			}
			return;
		}

		// CODIGO CUANDO SE PIERDE
		if (perdió) {
			destructores = null;
			asteroides = null;
			fondo.dibujarFondo(entorno);
			fondo.mover();
			fondo.dibujarFinal(entorno);
			if (entorno.sePresiono(entorno.TECLA_DELETE)) {
				System.exit(0);
			}
			entorno.cambiarFont("Arial", 30, Color.WHITE);
			entorno.escribirTexto("Enemigos destruidos: " + cantidadDeEnemigos, 60, 260);
			entorno.escribirTexto("Puntaje obtenido: " + cantidadDePuntos, 460, 260);
			entorno.escribirTexto("Ronda maxima: " + rounds, 300, 300);
			return;
		}
		
		if (entorno.sePresiono(entorno.TECLA_ENTER)) {
			enterFuePresionada = 1;
		}

		if (enterFuePresionada == 0) {
			fondo.dibujarInicio(entorno);
		}

		if (enterFuePresionada != 1) {
			return;
		}
		
		// COMIENZO DEL JUEGO
		if (enterFuePresionada == 1) {
			fondo.dibujarFondo(entorno);
			fondo.mover();

			// CODIGO NAVE
			if (nave != null && vidaNave >= 0) {
				nave.dibujarNave(entorno);

				// Movimiento Nave
				if (entorno.estaPresionada(entorno.TECLA_IZQUIERDA) || entorno.estaPresionada('h')) {
					nave.moverIzquierda();
				}
				if (entorno.estaPresionada(entorno.TECLA_DERECHA) || entorno.estaPresionada('l')) {
					nave.moverDerecha();
				}

				// Bala Enemiga mata a la Nave
				if (nave != null && plasma != null && nave.chocasteConBalaEnemiga(plasma)) {
					cantidadDeGolpesDeEnemigos++;
					if (cantidadDeGolpesDeEnemigos >= 1) {
						vidaNave = vidaNave - 10;
						Herramientas.cargarSonido("lowDown.wav").start();
						cantidadDeGolpesDeEnemigos = 0;
					}
					plasma = null;
					if (vidaNave <= 0) {
						nave = null;
						perdió = true;
					}
					plasma = null;

				}

				// Dibujo Proyectil de la Nave
				if (proyectil != null) {
					proyectil.dibujarBala(entorno,"balaNave");
					proyectil.avanzarBala();

					if (proyectil.ProyectilNavePasaElLimite(proyectil)) {
						proyectil = null;
					}
				}
				// Nave dispara el proyectil
				if (entorno.estaPresionada(entorno.TECLA_ESPACIO) && proyectil == null && nave != null) {
					proyectil = nave.disparar(entorno);
					Herramientas.cargarSonido("laser5.wav").start();
				}
			}

			// CODIGO ENEMIGOS
			if (destructores != null) {
				for (int i = 0; i < destructores.length; i++) {

					// Dibujamos a los enemigos y los movemos
					if (destructores[i] != null) {
						destructores[i].moverEnemigos();
						destructores[i].dibujarEnemigos(entorno);

						// cuando se pasa del limite del entorno crea otros en otra posicion arriba
						if (destructores[i].salisteDeLosLimitesDelEntorno(entorno)) {
							destructores[i] = new Enemigo(r.nextInt(700) + 50,
									(-r.nextInt(800) - (r.nextInt(500) + 200)), 4, true);
						}

						// si se van del entorno se eliminan asi ahorramos recursos
						if (destructores[i].salisteDeLosLimitesDelEntorno(entorno)) {
							destructores[i] = null;
						}

						// Los destructores chocan con ellos mismos
						for (int j = i + 1; j < destructores.length; j++) {
							if (destructores[j] != null
									&& destructores[j].destructorChocaConDestructor(destructores[i])) {
								destructores[i].invertirDireccionX();
								destructores[j].invertirDireccionX();
							}
						}
					}
					// Mide la distancia del borde inferior para que desaparezca la bala a cierta
					// cantidad
					if (destructores[i] != null) {
						distanciaAlBordeInferior = destructores[i].distanciaAlBordeInferior(destructores[i]);
					}

					// Intervalo de disparo enemigo
					tiempoDesdeUltimoDisparo++;
					if (tiempoDesdeUltimoDisparo >= 100 && plasma == null && destructores[i] != null
							&& distanciaAlBordeInferior > 100) {
						plasma = destructores[i].disparaDestructor(entorno);
						Herramientas.cargarSonido("Disparo3.wav").start();
						tiempoDesdeUltimoDisparo = 0;
					}

					// Dibuja la bala enemiga
					if (plasma != null && nave != null) {
						plasma.avanzarBala();
						plasma.dibujarBala(entorno, "balaEnemiga");
						if (plasma.plasmasPasaElLimite(plasma)) {
							plasma = null;
						}
					}

					// Bala Nave mata a los enemigos
					if (destructores[i] != null && proyectil != null
							&& proyectil.chocasteConEnemigo(destructores[i], true)) {
						cantidadDeGolpesDeEnemigos++;
						if (cantidadDeGolpesDeEnemigos >= 1) {
							destructores[i] = null;
							cantidadDestructores++;
							Herramientas.cargarSonido("explosion1.wav").start();
							cantidadDeGolpesDeEnemigos = 0;
						}

						// Si la vida llega a 0 Pierdo
						proyectil = null;
						if (vidaNave <= 0) {
							nave = null;
							perdió = true;
						}

						// Contador de enemigos destruidos y puntos
						if (destructores[i] == null) {
							cantidadDeEnemigos++;
							cantidadDePuntos = cantidadDePuntos + 10;
						}
					}

					// Enemigo hace daño a Nave
					if (destructores[i] != null && nave != null && nave.chocasteConEnemigo(destructores[i])) {
						destructores[i] = null;
						cantidadDeEnemigos++;
						cantidadDestructores++;
						vidaNave = vidaNave - 20;
						Herramientas.cargarSonido("lowDown.wav").start();
						// Si la vida llega a 0 Pierde
						if (vidaNave <= 0) {
							nave = null;
							perdió = true;
						}
					}

					// Generacion de Enemigos cuando esten todos muertos
					if (destructores[i] == null && ticks % 400 == 0 && cantidadDestructores % 4 == 0) {
						destructores[i] = new Enemigo(r.nextInt(700) + 50, (-r.nextInt(800) - (r.nextInt(500) + 200)),
								4, true);
						destructores[i].dibujarEnemigos(entorno);
						cantidadDeKills++;

						if (cantidadDeKills % 4 == 0) {
							rounds++;
						}
					}

					// CODIGO JEFE Y ROUNDS
					if (cantidadDestructores == 16) {
						destructores[i] = null;
					}
					// Rondas
					if (rounds == 5) {
						cantidadDeKills = 0;
						if (jefe != null) {
							entorno.cambiarFont("Arial", 18, Color.WHITE);
							entorno.escribirTexto("Jefe: " + vidaJefe, 375, 45);
							jefe.dibujarEnemigos(entorno);
							jefe.moverEnemigos();

							// Jefe dispara
							if (superPlasma == null && jefe != null) {
								superPlasma = jefe.disparaJefe(entorno);
								Herramientas.cargarSonido("sonidoplasma.wav").start();
							}

							if (superPlasma != null && nave != null) {
								superPlasma.avanzarBala();
								superPlasma.dibujarBala(entorno, "balaJefe");
								if (superPlasma.plasmasPasaElLimite(superPlasma)) {
									superPlasma = null;
								}
							}
							// Bala del Jefe choca con la Nave
							if (nave != null && superPlasma != null && nave.chocasteConBalaJefe(superPlasma)) {
								cantidadDeGolpesDeEnemigos++;
								if (cantidadDeGolpesDeEnemigos >= 1) {
									vidaNave = vidaNave - 30;
									Herramientas.cargarSonido("lowDown.wav").start();
									cantidadDeGolpesDeEnemigos = 0;
								}
								superPlasma = null;
								if (vidaNave <= 0) {
									nave = null;
									perdió = true;
								}
								superPlasma = null;

							}

							// Si bala Nave toca al jefe le saca vida
							if (proyectil != null && jefe != null && proyectil.chocasteConEnemigo(jefe, false)) {

								cantidadDeGolpesDeEnemigos++;
								if (cantidadDeGolpesDeEnemigos >= 1) {
									vidaJefe = vidaJefe - 10;
									cantidadDeGolpesDeEnemigos = 0;
								}
								proyectil = null;

								// si el jefe no tiene mas vida muere
								if (jefe != null && vidaJefe <= 0) {
									jefe = null;
									Herramientas.cargarSonido("JefeSonidoMuerte.wav").start();
									cantidadDeEnemigos++;
									cantidadDePuntos += 20;
									ganó = true;
								}
							}
						}
					}
				}
			}

			// CODIGO ASTEROIDES
			if (asteroides != null) {
				for (int i = 0; i < asteroides.length; i++) {

					// Imprime los asteroides
					if (asteroides[i] != null) {
						asteroides[i].dibujarAsteroides(entorno);
						if (asteroides[i] != null && proyectil != null
								&& proyectil.chocasteConAsteroide(asteroides[i])) {
							cantidadDeGolpesDeEnemigos++;
							if (cantidadDeGolpesDeEnemigos >= 2) {
								asteroides[i] = null;
								Herramientas.cargarSonido("zap2.wav").start();
								cantidadDeGolpesDeEnemigos = 0;
							}
							proyectil = null;
						}
					}

					// Movimento de los asteroides
					if (i % 2 != 0 && asteroides[i] != null) {
						asteroides[i].moverAbajoIzquierda();
					} else {
						if (asteroides[i] != null && i % 2 == 0 || asteroides[i] != null && i == 0) {
							asteroides[i].moverAbajoDerecha();
						}
					}

					// Colision nave vs asteroides
					if (nave != null && asteroides[i] != null && nave.chocasteConAsteroide(asteroides[i])) {
						vidaNave = vidaNave - 100;
						nave = null;
						perdió = true;
						asteroides[i] = null;
					}

					// Generacion asteroides (cuando desaparecen los primeros)
					if (ticks % 200 == 0) {
						this.asteroides[i] = new Asteroide(r.nextInt(1400) - 300, -r.nextInt(500), 10);
						if (asteroides != null) {

							// Imprime los asteroides
							if (asteroides[i] != null) {
								asteroides[i].dibujarAsteroides(entorno);
							}

							// Movimento de los asteroides
							if (i % 2 != 0 && asteroides[i] != null) {
								asteroides[i].moverAbajoIzquierda();

							} else {
								if (asteroides[i] != null && i % 2 == 0 || asteroides[i] != null && i == 0)
									asteroides[i].moverAbajoDerecha();

							}
						}
					}
				}
			}

			// Texto por pantalla
			entorno.cambiarFont("Arial", 18, Color.WHITE);
			entorno.escribirTexto("Enemigos destruidos: " + cantidadDeEnemigos, 10, 20);
			entorno.escribirTexto("Puntaje: " + cantidadDePuntos, 690, 20);
			entorno.escribirTexto("Ronda actual: " + rounds, 340, 20);
			if (nave != null && vidaNave >= 0) {
				entorno.escribirTexto("Vida actual: " + vidaNave, 650, 550);
			}
		}
	}

	@SuppressWarnings("unused")
	public static void main(String[] args) {
		Juego juego = new Juego();

	}

}