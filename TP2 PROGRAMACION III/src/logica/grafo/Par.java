package logica.grafo;

import java.util.Objects;

/**
 * Par no ordenado de dos valores del mismo tipo.
 * 
 * @param <T> tipo de elemento que guarda el par
 */
public class Par<T> {
    private T uno;
    private T dos;

    public Par(T uno, T dos) {
        if (uno == null) {
            throw new IllegalArgumentException("El primer valor es null.");
        }
        if (dos == null) {
            throw new IllegalArgumentException("El segundo valor es null");
        }

        this.uno = uno;
        this.dos = dos;
    }

    public T getUno() {
        return this.uno;
    }

    public T getDos() {
        return this.dos;
    }

    @Override
    public int hashCode() {
        int hashUno = this.uno.hashCode();
        int hashDos = this.dos.hashCode();

        int maximo = Math.max(hashUno, hashDos);
        int minimo = Math.min(hashUno, hashDos);

        return Objects.hash(minimo, maximo);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Par<?> other = (Par<?>) obj;
        return (Objects.equals(this.dos, other.dos) && Objects.equals(this.uno, other.uno))
                || (Objects.equals(this.uno, other.dos) && Objects.equals(this.dos, other.uno));
    }

    @Override
    public String toString() {
        return this.getUno() + ", " + this.getDos();
    }
}
