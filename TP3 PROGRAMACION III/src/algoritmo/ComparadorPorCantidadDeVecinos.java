package algoritmo;

import java.util.Comparator;

import logica.grafo.Vertice;

public class ComparadorPorCantidadDeVecinos<T extends Comparable<T>> implements Comparator<Vertice<T>> {

    @Override
    public int compare(Vertice<T> o1, Vertice<T> o2) {
        return Integer.compare(o1.getVecinos().size(), o2.getVecinos().size());
    }

}
