package juego;

import java.awt.Image;

import entorno.Entorno;
import entorno.Herramientas;

public class Enemigo {
	
	private double x;
	private double y;
	
	private double xJefe;
	private double yJefe;
	
	private double angulo;
	private double direccion;
	private double alto;
	
	private double velocidadDestructor;
	private double velocidadJefe;
	private double tamañoDestructor;
	private double tamañoJefe;

	private boolean tipo;

	private Image destructorEstelar;
	private Image jefe;

	public Enemigo(double x, double y, double velocidad, boolean tipo) {

		// Destructores
		this.x = x;
		this.y = y;
		this.tipo = tipo;

		// Jefe
		this.xJefe = x;
		this.yJefe = y;

		// Otros
		this.destructorEstelar = Herramientas.cargarImagen("DestructorEstelar.png");
		this.jefe = Herramientas.cargarImagen("Jefe.png");
		this.tamañoDestructor = 0.060;
		this.tamañoJefe = 0.35;
		this.angulo = Math.PI * 2;
		this.direccion = 3;
		this.velocidadDestructor = velocidad;
		this.velocidadJefe = velocidad;
	}

	public void dibujarEnemigos(Entorno entorno) {
		if (tipo) {
			entorno.dibujarImagen(destructorEstelar, x, y, angulo, tamañoDestructor);
		} else {
			entorno.dibujarImagen(jefe, xJefe, yJefe, angulo, tamañoJefe);

		}
	}

	// Metodos mover
	public void moverEnemigos() {
		if (tipo) {
			aumentarVelocidad();
			moverNormal();
		} else {
			moverJefe();
		}
	}

	private void moverJefe() {
		if (xJefe < 100 || xJefe > 700) {
			direccion = -direccion;
		}

		if (yJefe != 160) {
			yJefe += velocidadJefe;
		} else {
			xJefe += velocidadJefe * direccion;
		}
	}

	private void moverNormal() {
		// Cambiar la dirección horizontal del enemigo si se llega al borde izquierdo o
		// derecho de la pantalla
		if (x < 50 || x > 750) {
			direccion = -direccion;
		}
		// Mover el enemigo hacia abajo y lo mueve
		y += velocidadDestructor;
		if (y > 0) {
			x += direccion;
		}
		if (y > 200) {
			x -= direccion;
		}
		if (y > 400) {
			x += direccion;
		}
		if (y > 550) {
			x -= direccion;
		}
	}

	private void aumentarVelocidad() {
		if (y > -50) {
			y += velocidadDestructor;
		}
	}

	public void invertirDireccionX() {
		direccion *= -1;
	}

	public boolean destructorChocaConDestructor(Enemigo otroDestructor) {
		int distanciaDeLaNave = 50;
		return (x - otroDestructor.getX()) * (x - otroDestructor.getX()) + (y - otroDestructor.getY()) * (y - otroDestructor.getY()) < distanciaDeLaNave * distanciaDeLaNave;
	}

	// Metodos disparar
	public Bala disparaDestructor(Entorno entorno) {
		Bala plasma = new Bala(x, y, -5, "balaEnemigo");
		return plasma;
	}

	public Bala disparaJefe(Entorno entorno) {
		Bala superPlasma = new Bala(xJefe, yJefe, -4, "balaJefe");
		return superPlasma;
	}

	// Metodos Limites Entorno
	public boolean salisteDeLosLimitesDelEntorno(Entorno entorno) {
		return y > entorno.alto() + 50;
	}

	public double distanciaAlBordeInferior(Enemigo enemigo) {
		double distancia = 600 - (enemigo.getY() + enemigo.getAlto());
		return distancia;
	}

	// Este Getter lo necesitamos para la funcion distanciaAlBordeInferior
	public double getAlto() {
		return alto;
	}

	// Estos Getters los necesitamos para que la bala detecte la posicion de los
	// enemigos y estos puedan disparar.
	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}

	// Estos Getters los necesitamos para la clase bala.
	public double getXJefe() {
		return xJefe;
	}

	public double getYJefe() {
		return yJefe;
	}

}