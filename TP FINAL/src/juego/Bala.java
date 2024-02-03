package juego;

import java.awt.Image;

import entorno.Entorno;
import entorno.Herramientas;

public class Bala {

	private double x;
	private double y;

	private double velocidad;
	private double tamañoBalaNave;
	private double tamañoBalaEnemiga;
	private double angulo;
	private double tamañoBalaJefe;
	private double distanciaDeLaBala;

	private Image balaNave;
	private Image balaEnemiga;
	private Image balaJefe;
	
	public Bala(double x, double y, double velocidad, String tipo) {

		this.x = x;
		this.y = y;
		this.velocidad = velocidad;

		this.balaNave = Herramientas.cargarImagen("disparoLaser.png");
		this.balaEnemiga = Herramientas.cargarImagen("plasma2.png");
		this.balaJefe = Herramientas.cargarImagen("plasmaJefe.png");

		this.tamañoBalaNave = 0.05;
		this.tamañoBalaEnemiga = 0.20;
		this.tamañoBalaJefe = 0.30;

		this.angulo = 600;
		this.distanciaDeLaBala = 50; // actua como una "hitbox"
	}

	// Metodos de colision
	public boolean chocasteConEnemigo(Enemigo Enemigo, boolean tipo) {
		// chocaConDestructorYJefe
		if (tipo) {
			return (x - Enemigo.getX()) * (x - Enemigo.getX())
					+ (y - Enemigo.getY()) * (y - Enemigo.getY()) < distanciaDeLaBala * distanciaDeLaBala;
		} else {
			return (x - Enemigo.getXJefe()) * (x - Enemigo.getXJefe())
					+ (y - Enemigo.getYJefe()) * (y - Enemigo.getYJefe()) < distanciaDeLaBala * distanciaDeLaBala;
		}

	}

	public boolean chocasteConAsteroide(Asteroide Asteroides) {
		// chocaConAsteroide
		return (x - Asteroides.getX()) * (x - Asteroides.getX())
				+ (y - Asteroides.getY()) * (y - Asteroides.getY()) < distanciaDeLaBala * distanciaDeLaBala;
	}

	// Metodos dibujar-avanzar
	public void dibujarBala(Entorno entorno, String tipo) { // dibujar
		if (tipo.equals("balaNave")) {
			entorno.dibujarImagen(balaNave, x, y, angulo, tamañoBalaNave);

		} else if (tipo.equals("balaEnemiga")) {
			entorno.dibujarImagen(balaEnemiga, x, y, angulo, tamañoBalaEnemiga);
		} else if (tipo.equals("balaJefe")) {
			entorno.dibujarImagen(balaJefe, x, y, angulo, tamañoBalaJefe);

		}

	}

	public void avanzarBala() {
		y -= velocidad;
	}

	// Metodos Limite Entorno
	public boolean plasmasPasaElLimite(Bala bala) {
		return bala.getY() > 1000;
	}

	public boolean ProyectilNavePasaElLimite(Bala bala) {
		if (bala.getY() < -50) {
			return true;
		}
		return false;
	}

	// Estos Getters los necesitamos en la clase Nave
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}

}