package logica.grafo;

import java.util.Objects;

/**
 * Arista de un grafo no dirigido y con pesos.
 * 
 * @param <T> tipo de elemento contenido en cada vértice
 */
public class Arista<T> {
    private Par<T> vertices;
    private int peso;

    static <T> boolean mismosVertices(Arista<T> arista, Arista<T> otraArista) {
        return arista.vertices.equals(otraArista.vertices);
    }

    Arista(T origen, T destino, int peso) {
        this.vertices = new Par<>(origen, destino);
        this.peso = peso;
    }

    public Par<T> getVertices() {
        return this.vertices;
    }

    public int getPeso() {
        return this.peso;
    }

    void setPeso(int peso) {
        this.peso = peso;
    }

    @Override
    public int hashCode() {
        return Objects.hash(peso, vertices);
    }

    /**
     * Devuelve true si las aristas tienen pares de vértices equivalentes según su
     * método equals y tienen el mismo peso.
     */
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
        Arista<?> other = (Arista<?>) obj;
        return this.peso == other.peso && Objects.equals(this.vertices, other.vertices);
    }
}
