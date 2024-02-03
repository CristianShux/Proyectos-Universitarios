package juego;

import java.awt.Image;

import entorno.Entorno;
import entorno.Herramientas;

public class Fondo {

	private Image fondoEstrella;
	private Image fondoEstrellaSegundaParte;
	private Image fondoInicio;
	private Image fondoFinal;
	private Image fondoGanado;

	private double yFondoEstrella;
	private double yFondoEstrellaSegundaParte;
	private double velocidad;
	private double angulo;

	public Fondo(String rutaArchivo) {

		this.fondoEstrella = Herramientas.cargarImagen("FondoEstrella.jpg");
		this.fondoEstrellaSegundaParte = Herramientas.cargarImagen("FondoEstrella.jpg");
		this.fondoInicio = Herramientas.cargarImagen("FondoInicio.png");
		this.fondoFinal = Herramientas.cargarImagen("FondoFinal.png");
		this.fondoGanado = Herramientas.cargarImagen("FondoGanado.png");

		this.yFondoEstrella = 0;
		this.yFondoEstrellaSegundaParte = -fondoEstrella.getHeight(null);
		this.velocidad = 4;
		this.angulo = 0;
	}

	public void dibujarFondo(Entorno entorno) {
		if (yFondoEstrella >= -800) {
			entorno.dibujarImagen(fondoEstrella, 400, yFondoEstrella + 0, angulo, 1);
		}
		if (yFondoEstrellaSegundaParte >= -800) {
			entorno.dibujarImagen(fondoEstrellaSegundaParte, 400, yFondoEstrellaSegundaParte - 5, angulo, 1);
		}
	}

	public void dibujarInicio(Entorno entorno) {
		entorno.dibujarImagen(fondoInicio, 400, 300, angulo);

	}

	public void dibujarFinal(Entorno entorno) {
		entorno.dibujarImagen(fondoFinal, 400, 300, angulo);

	}

	public void dibujarGanado(Entorno entorno) {
		entorno.dibujarImagen(fondoGanado, 400, 300, angulo);

	}

	// Movemos el fondo de atras, cuando llegan a 1644(alto) es el final de la foto,
	// luego imprime el mismo fondo y asi sucesivamente
	public void mover() {
		yFondoEstrella += velocidad;
		yFondoEstrellaSegundaParte += velocidad;

		if (yFondoEstrella >= 1644) {
			yFondoEstrella = yFondoEstrellaSegundaParte - fondoEstrella.getHeight(null);
		}
		if (yFondoEstrellaSegundaParte >= 1644) {
			yFondoEstrellaSegundaParte = yFondoEstrella - fondoEstrellaSegundaParte.getHeight(null);
		}

	}

}
