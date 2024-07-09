package algoritmo;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import logica.grafo.Grafo;
import logica.grafo.Vertice;

public class SolverGoloso<T extends Comparable<T>> {
    private static final int CANTIDAD_MINIMA_VERTICES = 2;
    private Grafo<T> grafo;
    private List<Comparator<Vertice<T>>> comparadores;
    private List<Vertice<T>> verticesParaAgregar;

    /**
     * Crea un GolosoSolver.
     * 
     * @param grafo        grafo a resolver
     * @param comparadores comparadores en orden de prioridad ascendente
     */
    public SolverGoloso(Grafo<T> grafo, List<Comparator<Vertice<T>>> comparadores) {
        this.cargarGrafo(grafo);
        this.setComparadores(comparadores);
    }

    private void setComparadores(List<Comparator<Vertice<T>>> comparadores) {
        Objects.requireNonNull(comparadores, "El comparador no puede ser null");
        verificarComparadoresNoEstaVacio(comparadores);
        this.comparadores = comparadores;
    }

    public void cargarGrafo(Grafo<T> grafo) {
        Objects.requireNonNull(grafo, "El grafo no puede ser null.");
        verificarTamañoMinimoDelGrafo(grafo);
        this.grafo = grafo;
        this.verticesParaAgregar = new ArrayList<>(this.grafo.getVertices());
    }

    public Solucion<T> resolver() {
        long tiempoInicio = System.nanoTime();
        this.ordenarVertices();
        Solucion<T> solucion = new Solucion<>();

        while (!this.verticesParaAgregar.isEmpty()) {
            Vertice<T> seleccionado = this.seleccionarVertice();
            if (this.puedeSerAgregado(solucion, seleccionado)) {
                solucion.agregar(seleccionado);
            }
        }

        long tiempoFinal = System.nanoTime();
        solucion.setTiempoTotalEnNanosegundos(tiempoFinal - tiempoInicio);
        return solucion;
    }

    private void ordenarVertices() {
        this.comparadores.forEach(this.verticesParaAgregar::sort);
    }

    private Vertice<T> seleccionarVertice() {
        return this.verticesParaAgregar.remove(this.verticesParaAgregar.size() - 1);
    }

    private boolean puedeSerAgregado(Solucion<T> solucion, Vertice<T> vertice) {
        for (Vertice<T> v : solucion.getVertices()) {
            if (!this.grafo.existeArista(v.getValor(), vertice.getValor())) {
                return false;
            }
        }
        return true;
    }

    void verificarTamañoMinimoDelGrafo(Grafo<T> grafo) {
        if (grafo.tamano() < CANTIDAD_MINIMA_VERTICES) {
            throw new IllegalArgumentException(
                    "El grafo es muy pequeño, debe tener como mínimo " + CANTIDAD_MINIMA_VERTICES + " vértices.");
        }
    }

    void verificarComparadoresNoEstaVacio(List<Comparator<Vertice<T>>> comparadores) {
        if (comparadores.isEmpty()) {
            throw new IllegalArgumentException("La lista de comparadores no puede estar vacía");
        }
    }
}
