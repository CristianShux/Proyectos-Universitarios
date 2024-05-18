package logica.grafo;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Grafo no dirigido con pesos positivos en sus aristas.
 * 
 * @param <T> tipo de elemento contenido en cada vértice
 */
public class Grafo<T> {
    private final Map<T, Set<T>> verticesVecinos;
    private final Map<Par<T>, Arista<T>> aristas;

    /**
     * Crea una copia superficial del grafo, es decir, que los elementos T tendrán
     * aliasing.
     * 
     * @param grafo grafo a copiar
     */
    public Grafo(Grafo<T> grafo) {
        this();
        for (Map.Entry<T, Set<T>> entry : grafo.verticesVecinos.entrySet()) {
            this.verticesVecinos.put(entry.getKey(), new HashSet<>(entry.getValue()));
        }
        for (Map.Entry<Par<T>, Arista<T>> entry : grafo.aristas.entrySet()) {
            Par<T> vertices = entry.getKey();
            this.agregarArista(vertices.getUno(), vertices.getDos(), entry.getValue().getPeso());
        }
    }

    public Grafo() {
        this.verticesVecinos = new HashMap<>();
        this.aristas = new HashMap<>();
    }

    public int tamano() {
        return this.verticesVecinos.size();
    }

    /**
     * Devuelve una copia del conjunto de vértices del grafo.<br>
     * 
     * @return conjunto de vértices del grafo
     */
    public Set<T> getVertices() {
        return new HashSet<>(this.verticesVecinos.keySet());
    }

    /**
     * Devuelve una copia del conjunto de vecinos del grafo.<br>
     * 
     * @param vertice vértice del cual se quieren saber sus vecinos
     * @return conjunto de vértices vecinos
     */
    public Set<T> getVecinos(T vertice) {
        return new HashSet<>(this.verticesVecinos.get(vertice));
    }

    public boolean existeVertice(T elemento) {
        return this.verticesVecinos.containsKey(elemento);
    }

    public void agregarVertice(T vertice) {
        this.asegurarVerticeNoNull(vertice);
        this.asegurarVerticeNoExiste(vertice);

        this.verticesVecinos.put(vertice, new HashSet<>());
    }

    public void eliminarVertice(T vertice) {
        this.asegurarVerticeNoNull(vertice);
        this.asegurarVerticeExiste(vertice);

        this.verticesVecinos.remove(vertice);

        for (Par<T> par : this.aristas.keySet()) {
            if (par.getUno().equals(vertice) || par.getDos().equals(vertice)) {
                this.aristas.remove(par);
            }
        }
    }

    /**
     * Devuelve una copia del conjunto con todas las aristas del grafo.<br>
     * 
     * @return un conjunto con las aristas del grafo
     */
    public Set<Arista<T>> getAristas() {
        return new HashSet<>(this.aristas.values());
    }

    public boolean existeArista(T origen, T destino) {
        this.asegurarVerticeNoNull(origen);
        this.asegurarVerticeNoNull(destino);
        this.asegurarVerticeExiste(origen);
        this.asegurarVerticeExiste(destino);

        return this.aristas.containsKey(new Par<>(origen, destino));
    }

    public void agregarArista(T origen, T destino, int peso) {
        this.asegurarAristaValida(origen, destino);
        this.asegurarAristaNoExiste(origen, destino);

        this.verticesVecinos.get(origen).add(destino);
        this.verticesVecinos.get(destino).add(origen);

        Arista<T> arista = new Arista<>(origen, destino, peso);
        this.aristas.put(arista.getVertices(), arista);
    }

    public void eliminarArista(T origen, T destino) {
        this.asegurarAristaValida(origen, destino);
        this.asegurarAristaExiste(origen, destino);

        Arista<T> arista = this.getArista(origen, destino);
        this.aristas.remove(arista.getVertices());

        this.verticesVecinos.get(origen).remove(destino);
        this.verticesVecinos.get(destino).remove(origen);
    }

    public void setPesoArista(T origen, T destino, int peso) {
        this.asegurarAristaValida(origen, destino);
        this.asegurarAristaExiste(origen, destino);

        if (peso < 1) {
            throw new IllegalArgumentException("El peso de la arista debe ser positivo.");
        }
        this.getArista(origen, destino).setPeso(peso);
    }

    public Arista<T> getArista(T origen, T destino) {
        this.asegurarAristaValida(origen, destino);
        this.asegurarAristaExiste(origen, destino);

        return this.aristas.get(new Par<>(origen, destino));
    }

    @Override
    public int hashCode() {
        return Objects.hash(aristas, verticesVecinos);
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
        Grafo<?> other = (Grafo<?>) obj;
        return Objects.equals(aristas, other.aristas) && Objects.equals(verticesVecinos, other.verticesVecinos);
    }

    private void asegurarAristaValida(T origen, T destino) {
        this.asegurarVerticeNoNull(origen);
        this.asegurarVerticeNoNull(destino);
        this.asegurarVerticeExiste(origen);
        this.asegurarVerticeExiste(destino);
        this.asegurarVerticesDiferentes(origen, destino);
    }

    void asegurarVerticeNoNull(T vertice) {
        if (vertice == null) {
            throw new NullPointerException("El vértice es null.");
        }
    }

    void asegurarVerticeNoExiste(T vertice) {
        if (this.existeVertice(vertice)) {
            throw new IllegalArgumentException("El vértice " + vertice + " ya existe en el grafo.");
        }
    }

    void asegurarVerticeExiste(T vertice) {
        if (!this.existeVertice(vertice)) {
            throw new IllegalArgumentException("El vértice " + vertice + " no existe en el grafo.");
        }
    }

    void asegurarVerticesDiferentes(T vertice, T otroVertice) {
        if (vertice.equals(otroVertice)) {
            throw new IllegalArgumentException("Los vértices " + vertice + " y " + otroVertice + " son iguales.");
        }
    }

    void asegurarAristaNoExiste(T origen, T destino) {
        if (this.existeArista(origen, destino)) {
            throw new IllegalArgumentException("La arista con vértices " + origen + " y " + destino + " ya existe.");
        }
    }

    void asegurarAristaExiste(T origen, T destino) {
        if (!this.existeArista(origen, destino)) {
            throw new IllegalArgumentException("La arista con vértices " + origen + " y " + destino + " no existe.");
        }
    }
}
