package algoritmo;

import java.util.Comparator;

import logica.grafo.Vertice;

public class ComparadorPorPeso<T extends Comparable<T>> implements Comparator<Vertice<T>> {

    @Override
    public int compare(Vertice<T> uno, Vertice<T> otro) {
        return Double.compare(uno.getPeso(), otro.getPeso());
    }
}
