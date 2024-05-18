package algoritmos;

import java.util.HashSet;
import java.util.Set;

import logica.grafo.Grafo;

public class Prim {
    public static <T extends Comparable<T>> Grafo<T> arbolGeneradorMinimo(Grafo<T> grafo) {
        // Si el grafo no es conexo, no hay chance de que tenga un árbol generador
        // mínimo
        if (!BFS.esConexo(grafo)) {
            throw new IllegalArgumentException("El grafo es inválido porque no es conexo.");
        }

        asegurarGrafoNoEsNull(grafo);

        Grafo<T> arbolMinimo = new Grafo<T>();

        // Conjunto de vértices ya incluidos en el árbol
        Set<T> incluidos = new HashSet<>();

        // Selecciona un vértice arbitrario y lo agrega al árbol
        T primerVertice = grafo.getVertices().iterator().next();
        incluidos.add(primerVertice);
        arbolMinimo.agregarVertice(primerVertice);

        while (incluidos.size() < grafo.tamano()) {
            int pesoMinimo = Integer.MAX_VALUE;

            T origen = null;
            T destino = null;

            // Agrega las aristas conectadas al vértice actual a la cola de prioridad
            for (T incluido : incluidos) {
                for (T vecino : grafo.getVecinos(incluido)) {
                    if (!incluidos.contains(vecino) && grafo.getArista(incluido, vecino).getPeso() < pesoMinimo) {
                        pesoMinimo = grafo.getArista(incluido, vecino).getPeso();
                        origen = incluido;
                        destino = vecino;
                    }
                }
            }

            incluidos.add(destino);
            arbolMinimo.agregarVertice(destino);
            arbolMinimo.agregarArista(origen, destino, pesoMinimo);
        }
        return arbolMinimo;
    }

    @SuppressWarnings("rawtypes")
    static void asegurarGrafoNoEsNull(Grafo grafo) {
        if (grafo == null) {
            throw new IllegalArgumentException("El grafo no puede ser null.");
        }
    }

}
