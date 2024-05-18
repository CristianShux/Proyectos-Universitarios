package algoritmos;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import logica.grafo.Arista;
import logica.grafo.Grafo;

public class EliminarAristasMasPesadas {

    public static <T extends Comparable<T>> Grafo<T> eliminarAristas(Grafo<T> grafo, int cantidadEliminar)
            throws IllegalArgumentException {

        List<Arista<T>> listaAristas = new ArrayList<>(grafo.getAristas());
        Collections.sort(listaAristas, Collections.reverseOrder(new Comparator<>() {

            @Override
            public int compare(Arista<T> uno, Arista<T> dos) {
                return Integer.compare(uno.getPeso(), dos.getPeso());
            }

        }));

        verificarCantidadValida(listaAristas.size(), cantidadEliminar);

        // Eliminar las últimas k aristas de la lista
        int cantidadEliminados = 0;
        while (cantidadEliminados < cantidadEliminar) {
            Arista<T> arista = listaAristas.get(0);

            // Actualizamos ambas cosas
            grafo.eliminarArista(arista.getVertices().getUno(), arista.getVertices().getDos());
            listaAristas.remove(arista);

            cantidadEliminados++;
        }

        return grafo;
    }

    @SuppressWarnings("rawtypes")
    static void asegurarGrafoNoEsNull(Grafo grafo) {
        if (grafo == null) {
            throw new IllegalArgumentException("El grafo no puede ser null.");
        }
    }

    static void verificarCantidadValida(int cantidadAristas, int cantidadEliminar) throws IllegalArgumentException {
        if (cantidadEliminar > cantidadAristas) {
            throw new IllegalArgumentException("La cantidad de aristas a eliminar (" + cantidadEliminar
                    + ") supera la cantidad de aristas en el grafo (" + cantidadAristas + ")");
        }
        if (cantidadEliminar < 0) {
            throw new IllegalArgumentException(
                    "La cantidad de aristas a eliminar (" + cantidadEliminar + ") no puede ser menor a 0");
        }
    }
}
