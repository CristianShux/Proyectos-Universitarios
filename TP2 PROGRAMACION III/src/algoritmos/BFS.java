package algoritmos;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

import logica.grafo.Grafo;

public class BFS {

    public static <T extends Comparable<T>> boolean esConexo(Grafo<T> grafo) {
        asegurarGrafoNoEsNull(grafo);

        if (elGrafoEstaVacio(grafo)) {
            return true;
        }

        Set<T> vertices = grafo.getVertices();
        T primerVertice = vertices.iterator().next();

        // Realizamos BFS desde el primer vértice
        Set<T> visitados = new HashSet<>();
        Queue<T> cola = new LinkedList<>();
        cola.add(primerVertice);
        visitados.add(primerVertice);

        // Recorremos el grafo usando BFS
        while (!cola.isEmpty()) {
            T actual = cola.poll();
            for (T vecino : grafo.getVecinos(actual)) {
                if (!visitados.contains(vecino)) {
                    cola.add(vecino);
                    visitados.add(vecino);
                }
            }
        }

        // Si todos los vértices fueron visitados, el grafo es conexo
        return visitados.size() == grafo.tamano();
    }

    @SuppressWarnings("rawtypes")
    static void asegurarGrafoNoEsNull(Grafo grafo) {
        if (grafo == null) {
            throw new IllegalArgumentException("El grafo no puede ser null.");
        }
    }

    @SuppressWarnings("rawtypes")
    static boolean elGrafoEstaVacio(Grafo grafo) {
        if (grafo.tamano() == 0) {
            return true;
        }
        return false;
    }

}
