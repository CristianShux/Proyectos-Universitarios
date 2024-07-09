package logica.grafo;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import logica.Auxiliares;

/**
 * Grafo no dirigido con pesos positivos.
 * 
 * @param <T> identificador de cada vértice
 */
public class Grafo<T extends Comparable<T>> {

    private final Map<T, Vertice<T>> vertices;
    private final Set<Tupla<Vertice<T>>> aristas;

    /**
     * Crea un grafo vacío.
     */
    public Grafo() {
        this.vertices = new HashMap<>();
        this.aristas = new HashSet<>();
    }

    /**
     * 
     * @return la cantidad de vértices que contiene el grafo
     */
    public int tamano() {
        return this.vertices.size();
    }

    /**
     * 
     * @return un conjunto con todos los vértices del grafo que no se actualiza
     */
    public Set<Vertice<T>> getVertices() {
        return new HashSet<>(this.vertices.values());
    }

    /**
     * Obtiene un vértice del grafo.
     * 
     * @param valor el identificador del vértice a buscar
     * @return la instancia del vértice o null si no existe
     */
    public Vertice<T> getVertice(T valor) {
        Auxiliares.verificarNoEsNull(valor);
        verificarVerticeExiste(valor);

        return this.vertices.get(valor);
    }

    /**
     * 
     * @return un conjunto inmodificable con todas las tuplas de vértices que
     *         conforman las aristas
     */
    public Set<Tupla<Vertice<T>>> getAristas() {
        return Collections.unmodifiableSet(this.aristas);
    }

    public Set<Vertice<T>> vecinos(T valor) {
        Auxiliares.verificarNoEsNull(valor);
        verificarVerticeExiste(valor);

        return vertices.get(valor).getVecinos();
    }

    public void agregarVertice(Vertice<T> vertice) {
        Auxiliares.verificarNoEsNull(vertice);

        this.vertices.put(vertice.getValor(), vertice);
    }

    public void agregarVertice(T valor, double peso) {
        Auxiliares.verificarNoEsNull(valor);
        Auxiliares.verificarNoEsNull(peso);

        Vertice<T> vertice = new Vertice<>(valor, peso);
        this.vertices.put(valor, vertice);
    }

    public void agregarArista(T origen, T destino) {
        this.agregarArista(this.getVertice(origen), this.getVertice(destino));
    }

    private void agregarArista(Vertice<T> origen, Vertice<T> destino) {
        verificarAristaEsValida(origen, destino);
        verificarAristaNoExiste(origen, destino);

        origen.agregarVecino(destino);
        destino.agregarVecino(origen);

        aristas.add(new Tupla<>(origen, destino));
    }

    public void eliminarArista(T origen, T destino) {
        this.eliminarArista(this.getVertice(origen), this.getVertice(destino));
    }

    private void eliminarArista(Vertice<T> origen, Vertice<T> destino) {
        verificarAristaEsValida(origen, destino);
        verificarAristaExiste(origen, destino);

        origen.eliminarVecino(destino);
        destino.eliminarVecino(origen);

        Tupla<Vertice<T>> v1 = new Tupla<>(origen, destino);
        Tupla<Vertice<T>> v2 = new Tupla<>(destino, origen);

        if (aristas.contains(v1)) {
            aristas.remove(v1);
        } else {
            aristas.remove(v2);
        }
    }

    public boolean existeVertice(T valor) {
        Auxiliares.verificarNoEsNull(valor);
        return this.vertices.containsKey(valor);
    }

    public boolean existeVertice(Vertice<T> vertice) {
        Auxiliares.verificarNoEsNull(vertice);
        return this.vertices.containsKey(vertice.getValor());
    }

    public boolean existeArista(T origen, T destino) {
        return this.existeArista(this.getVertice(origen), this.getVertice(destino));
    }

    private boolean existeArista(Vertice<T> origen, Vertice<T> destino) {
        Auxiliares.verificarNoEsNull(origen, destino);
        this.verificarAristaEsValida(origen, destino);

        return origen.vecinoExiste(destino);
    }

    @Override
    public String toString() {
        return this.vertices.values().stream().map(Vertice::toString)
                .reduce((str1, str2) -> str1.concat("\n").concat(str2)).orElse("Grafo vacío");
    }

    /* MÉTODOS DE VERIFICACIÓN DE VERTICES */

    void verificarVerticeExiste(T valor) {
        if (!vertices.containsKey(valor)) {
            throw new NullPointerException("El vertice no existe en el grafo : " + valor);
        }
    }

    private void verificarVerticeExiste(Vertice<T> vertice) {
        if (!existeVertice(vertice)) {
            throw new IllegalArgumentException("El vertice no existe en el grafo : " + vertice);
        }
    }

    void verificarVerticeNoExiste(T valor) {
        this.verificarVerticeNoExiste(this.getVertice(valor));
    }

    private void verificarVerticeNoExiste(Vertice<T> vertice) {
        if (existeVertice(vertice)) {
            throw new IllegalArgumentException("El vertice ya existe en el grafo : " + vertice);
        }
    }

    /* MÉTODOS DE VERIFICACIÓN DE ARISTAS */

    private void verificarAristaEsValida(Vertice<T> origen, Vertice<T> destino) {
        Auxiliares.verificarNoEsNull(origen);
        Auxiliares.verificarNoEsNull(destino);
        verificarVerticeExiste(origen);
        verificarVerticeExiste(destino);
        verificarVerticesSonDistintos(origen, destino);
    }

    void verificarVerticesSonDistintos(T origen, T destino) {
        this.verificarVerticesSonDistintos(this.getVertice(origen), this.getVertice(destino));
    }

    private void verificarVerticesSonDistintos(Vertice<T> origen, Vertice<T> destino) {
        Auxiliares.verificarNoEsNull(origen, destino);
        if (origen.equals(destino)) {
            throw new IllegalArgumentException("No se permiten loops : " + origen);
        }
    }

    void verificarAristaExiste(T origen, T destino) {
        this.verificarAristaExiste(this.getVertice(origen), this.getVertice(destino));
    }

    private void verificarAristaExiste(Vertice<T> origen, Vertice<T> destino) {
        Auxiliares.verificarNoEsNull(origen, destino);
        if (!existeArista(origen, destino)) {
            throw new IllegalArgumentException("La arista no existe en el grafo : (" + origen + ", " + destino);
        }
    }

    void verificarAristaNoExiste(T origen, T destino) {
        this.verificarAristaNoExiste(this.getVertice(origen), this.getVertice(destino));
    }

    private void verificarAristaNoExiste(Vertice<T> origen, Vertice<T> destino) {
        Auxiliares.verificarNoEsNull(origen, destino);
        if (existeArista(origen, destino)) {
            throw new IllegalArgumentException("La arista ya existe en el grafo : (" + origen + ", " + destino);
        }
    }
}
