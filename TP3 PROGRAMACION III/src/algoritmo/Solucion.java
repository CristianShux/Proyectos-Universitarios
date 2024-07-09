package algoritmo;

import java.util.Set;

import logica.grafo.Grafo;
import logica.grafo.Tupla;
import logica.grafo.Vertice;

public class Solucion<T extends Comparable<T>> {
    private Grafo<T> clique;
    private long tiempoTotalEnNanosegundos;

    public Solucion() {
        this.clique = new Grafo<>();
    }

    public Grafo<T> getClique() {
        return this.clique;
    }

    public Set<Vertice<T>> getVertices() {
        return Set.copyOf(this.clique.getVertices());
    }

    public Set<Tupla<Vertice<T>>> aristas() {
        return this.clique.getAristas();
    }

    public void agregar(Vertice<T> vertice) {
        this.clique.agregarVertice(vertice.getValor(), vertice.getPeso());
        this.cargarAristas(vertice);
    }

    private void cargarAristas(Vertice<T> origen) {
        for (Vertice<T> destino : this.getVertices()) {
            if (!destino.equals(origen)) {
                this.clique.agregarArista(origen.getValor(), destino.getValor());
            }
        }
    }

    public int cardinal() {
        return this.clique.tamano();
    }

    public double peso() {
        return this.getVertices().stream().map(Vertice::getPeso).reduce((x, y) -> x + y).get();
    }

    public long getTiempoTotalEnNanosegundos() {
        return this.tiempoTotalEnNanosegundos;
    }

    void setTiempoTotalEnNanosegundos(long tiempoTotalEnNanosegundos) {
        this.tiempoTotalEnNanosegundos = tiempoTotalEnNanosegundos;
    }
}
