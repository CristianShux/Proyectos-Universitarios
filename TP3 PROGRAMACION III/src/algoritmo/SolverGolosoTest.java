package algoritmo;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;

import logica.grafo.Grafo;

public class SolverGolosoTest {

    @Test
    public void resolverPorPesoTest() {
        Grafo<Integer> grafo = inicializarGrafo();
        ComparadorPorPeso<Integer> comparador = new ComparadorPorPeso<>();
        SolverGoloso<Integer> solver = new SolverGoloso<>(grafo, List.of(comparador));
        Solucion<Integer> solucion = solver.resolver();

        assertEquals(23.5, solucion.peso(), 0.001);
    }

    @Test
    public void resolverPorValorTest() {
        Grafo<Integer> grafo = inicializarGrafo();
        ComparadorPorValor<Integer> comparador = new ComparadorPorValor<>();
        SolverGoloso<Integer> solver = new SolverGoloso<>(grafo, List.of(comparador));
        Solucion<Integer> solucion = solver.resolver();

        assertEquals(9.6, solucion.peso(), 0.001);
    }

    @Test
    public void resolverPorPorCantidadDeVecinosTest() {
        Grafo<Integer> grafo = inicializarGrafo();
        ComparadorPorCantidadDeVecinos<Integer> comparador = new ComparadorPorCantidadDeVecinos<>();
        SolverGoloso<Integer> solver = new SolverGoloso<>(grafo, List.of(comparador));
        Solucion<Integer> solucion = solver.resolver();

        assertEquals(23.5, solucion.peso(), 0.001);
    }

    private Grafo<Integer> inicializarGrafo() {
        Grafo<Integer> grafo = new Grafo<>();

        grafo.agregarVertice(1, 11.0);
        grafo.agregarVertice(2, 5.5);
        grafo.agregarVertice(3, 1.1);
        grafo.agregarVertice(4, 7.0);
        grafo.agregarVertice(5, 2.6);

        grafo.agregarArista(1, 2);
        grafo.agregarArista(1, 4);
        grafo.agregarArista(2, 3);
        grafo.agregarArista(2, 4);
        grafo.agregarArista(5, 3);
        grafo.agregarArista(5, 4);

        return grafo;
    }

}
