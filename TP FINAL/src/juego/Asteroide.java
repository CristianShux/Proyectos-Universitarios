package juego;

import java.awt.Image;

import entorno.Entorno;
import entorno.Herramientas;

public class Asteroide {

	private double x;
	private double y;
	
	private double angulo;
	private double velocidad;
	private double escala; 
	// faltaría un tamaño real

	private Image asteroides; // img

	public Asteroide(double x, double y, double velocidad) {
		this.x = x;
		this.y = y;
		this.velocidad = velocidad;
		this.angulo = Math.PI / 2;
		this.asteroides = Herramientas.cargarImagen("Asteroides.png");
		this.escala = 0.08; // scale
	}

	public void dibujarAsteroides(Entorno entorno) {
		entorno.dibujarImagen(asteroides, x, y, angulo, escala);
	}

	// mover izquierda o derecha
	public void moverAbajoDerecha() {
		y += velocidad;
		x += velocidad;
	}

	public void moverAbajoIzquierda() {
		y += velocidad;
		x -= velocidad;
	}

	// Getters

	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}

}

