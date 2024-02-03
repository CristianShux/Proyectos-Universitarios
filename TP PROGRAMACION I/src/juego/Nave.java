package juego;

import java.awt.Image;
import entorno.Entorno;
import entorno.Herramientas;

public class Nave {

	private double x;
	private double y;
	
	private double velocidad;
	private double angulo;
	private double escala; 
	private double distanciaDeLaNave;

	private Image nave;

	public Nave(double x, double y, double velocidad) {
		this.x = x;
		this.y = y;

		this.nave = Herramientas.cargarImagen("NaveBuena.png");

		this.velocidad = velocidad;
		this.angulo = 2 * -Math.PI;
		this.escala = 0.055;

		this.distanciaDeLaNave = 50; //actua como una "hitbox"

	}

	// Metodos Movimientos-Dibujar
	public void dibujarNave(Entorno entorno) {
		entorno.dibujarImagen(nave, x, y, angulo, escala);
	}

	public void moverDerecha() {
		if (x - angulo / 2 < 750) {
			x += velocidad;
		}
	}

	public void moverIzquierda() {
		if (x - angulo / 2 > 60) {
			x -= velocidad;
		}

	}

	// Metodos Colision

	public boolean chocasteConAsteroide(Asteroide Asteroides) {
		return (x - Asteroides.getX()) * (x - Asteroides.getX())
				+ (y - Asteroides.getY()) * (y - Asteroides.getY()) < distanciaDeLaNave * distanciaDeLaNave;
	}

	public boolean chocasteConEnemigo(Enemigo Enemigo) {
		return (x - Enemigo.getX()) * (x - Enemigo.getX())
				+ (y - Enemigo.getY()) * (y - Enemigo.getY()) < distanciaDeLaNave * distanciaDeLaNave;
	}

	public boolean chocasteConBalaEnemiga(Bala Bala) {
		return (x - Bala.getX()) * (x - Bala.getX()) + (y - Bala.getY()) * (y - Bala.getY()) < distanciaDeLaNave
				* distanciaDeLaNave;
	}

	public boolean chocasteConBalaJefe(Bala Jefe) {
		return (x - Jefe.getX()) * (x - Jefe.getX()) + (y - Jefe.getY()) * (y - Jefe.getY()) < distanciaDeLaNave
				* distanciaDeLaNave;

	}

	// Metodo Disparo
	public Bala disparar(Entorno entorno) {
		return new Bala(x, y, 20, "balaNave");
	}

}
