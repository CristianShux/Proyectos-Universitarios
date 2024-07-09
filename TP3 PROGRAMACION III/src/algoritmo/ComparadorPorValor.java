package algoritmo;

import java.util.Comparator;

import logica.grafo.Vertice;

public class ComparadorPorValor<T extends Comparable<T>> implements Comparator<Vertice<T>> {

    @Override
    public int compare(Vertice<T> uno, Vertice<T> otro) {
        return uno.getValor().compareTo(otro.getValor());
    }
}
