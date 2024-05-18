package logica;

import java.util.Objects;

public class Posicion {
    private int fila, columna;

    /**
     * Crea una nueva instancia del objeto posición con los valores especificados.
     * 
     * @param fila    número de fila
     * @param columna número de columna
     */
    public Posicion(int fila, int columna) {
        this.fila = fila;
        this.columna = columna;
    }

    public int obtenerFila() {
        return this.fila;
    }

    public int obtenerColumna() {
        return this.columna;
    }

    // Métodos de paquete

    void aumentarFila() {
        this.fila++;
    }

    void disminuirFila() {
        this.fila--;
    }

    void aumentarColumna() {
        this.columna++;
    }

    void disminuirColumna() {
        this.columna--;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.columna, this.fila);
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
        Posicion other = (Posicion) obj;
        return this.columna == other.columna && this.fila == other.fila;
    }
}
