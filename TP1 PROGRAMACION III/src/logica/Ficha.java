package logica;

import java.util.Random;

/**
 * Esta clase representa una ficha del juego. Una ficha consiste de un valor
 * entero y su posición en el tablero del juego.
 */
public class Ficha {
    private int valor;
    private Posicion posicion;
    private static Random RANDOM = new Random();

    /**
     * Crea una nueva ficha con un valor inicial aleatorio, elegido entre el
     * conjunto de valores posibles.
     * 
     * @param posicion posición inicial de la ficha
     */
    public Ficha(int fila, int columna) {
        this.posicion = new Posicion(fila, columna);
        this.valor = this.generarValorInicial();
    }

    // Métodos de paquete

    /**
     * Devuelve el valor de la ficha
     * 
     * @return el valor de la ficha
     */
    public int obtenerValor() {
        return this.valor;
    }

    /**
     * Devuelve la posición actual de la ficha. No se puede mutar por fuera del
     * código de lógica. La instancia actualiza su estado cuando la ficha es movida.
     * 
     * @return la posición actual
     */
    Posicion obtenerPosicion() {
        return this.posicion;
    }

    /**
     * Devuelve el número de fila de la ficha
     * 
     * @return el número de fila de la ficha
     */
    public int obtenerFila() {
        return this.posicion.obtenerFila();
    }

    /**
     * Devuelve el número de columna de la ficha
     * 
     * @return el número de columna de la ficha
     */
    public int obtenerColumna() {
        return this.posicion.obtenerColumna();
    }

    /**
     * Mueve la ficha en la dirección especificada.
     * 
     * @param direccion dirección en la que mover la ficha
     */
    public void mover(Direccion direccion) {
        switch (direccion) {
        case ARRIBA:
            this.posicion.disminuirFila();
            break;
        case ABAJO:
            this.posicion.aumentarFila();
            break;
        case IZQUIERDA:
            this.posicion.disminuirColumna();
            break;
        case DERECHA:
            this.posicion.aumentarColumna();
            break;
        }
    }

    /**
     * Si la ficha especificada es igual a la actual, se suman los valores de ambas
     * y se establece como valor de la ficha actual.
     * 
     * @param ficha la ficha a fusionar con la actual
     * @return si las fichas pudieron fusionarse
     */
    public boolean fusionar(Ficha ficha) {
        if (this.equals(ficha)) {
            this.duplicarValor();
            return true;
        }
        return false;
    }

    /**
     * Elige un valor inicial para la ficha, elegido aleatoriamente entre el
     * conjunto de valores posibles.
     * 
     * @return el nuevo valor para la ficha
     */
    private int generarValorInicial() {
        int num = Ficha.RANDOM.nextInt(2);

        if (num == 0) {
            return 2;
        }
        return 4;
    }

    /**
     * Duplica el valor de la ficha
     */
    private void duplicarValor() {
        this.valor += this.valor;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (this.getClass() != obj.getClass()) {
            return false;
        }
        Ficha other = (Ficha) obj;
        return this.valor == other.valor;
    }
}
