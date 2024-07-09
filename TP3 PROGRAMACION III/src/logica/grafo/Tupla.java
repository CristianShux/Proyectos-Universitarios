package logica.grafo;

import java.util.Objects;

import logica.Auxiliares;

public class Tupla<T> {
    private T x;
    private T y;

    public Tupla(T x, T y) {
        Auxiliares.verificarNoEsNull(x);
        Auxiliares.verificarNoEsNull(y);

        this.x = x;
        this.y = y;
    }

    public T getX() {
        return this.x;
    }

    public T getY() {
        return this.y;
    }

    @Override
    public int hashCode() {
        int hashX = this.x.hashCode();
        int hashY = this.y.hashCode();

        int maximo = Math.max(hashX, hashY);
        int minimo = Math.min(hashX, hashY);

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
        Tupla<?> other = (Tupla<?>) obj;
        return (Objects.equals(this.y, other.y) && Objects.equals(this.x, other.x))
                || (Objects.equals(this.x, other.y) && Objects.equals(this.y, other.x));
    }

    @Override
    public String toString() {
        return "(" + this.getX() + ", " + this.getY() + ")";
    }
}
