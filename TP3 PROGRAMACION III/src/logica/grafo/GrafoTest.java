package logica.grafo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Assert;
import org.junit.Test;

public class GrafoTest {

    @Test(expected = NullPointerException.class)
    public void verticeNullNoExisteTest() {
        Grafo<Integer> grafo = new Grafo<>();

        assertFalse(grafo.existeVertice((Vertice<Integer>) null));
    }

    @Test
    public void grafoVacioTamanoCeroTest() {
        Grafo<Integer> grafo = new Grafo<>();

        assertEquals(0, grafo.tamano());
    }

    @Test
    public void agregarVerticeCambiaTamanoTest() {
        Grafo<Integer> grafo = new Grafo<>();

        grafo.agregarVertice(0, 0.1);
        assertEquals(1, grafo.tamano());
    }

    @Test
    public void agregarVerticeObjetoHappyTest() {
        Grafo<Integer> grafo = new Grafo<>();

        Vertice<Integer> vertice = new Vertice<Integer>(0, 0.1);
        grafo.agregarVertice(vertice);

        assertTrue(grafo.existeVertice(vertice.getValor()));
        assertTrue(grafo.existeVertice(vertice));
    }

    @Test
    public void agregarVerticeHappyTest() {
        Grafo<Integer> grafo = new Grafo<>();
        grafo.agregarVertice(2, 0.1);
        Assert.assertTrue(grafo.existeVertice(2));
    }

    @Test(expected = NullPointerException.class)
    public void verificarVerticeExisteTest() {
        Grafo<Integer> grafo = new Grafo<>();
        grafo.verificarVerticeExiste(2);
    }

    @Test
    public void verificarVerticeExisteHappyTest() {
        Grafo<Integer> grafo = this.inicializarGrafo();
        grafo.agregarVertice(0, 1);

        grafo.verificarVerticeExiste(0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarVerticeNoExisteTest() {
        Grafo<Integer> grafo = inicializarGrafo();
        grafo.verificarVerticeNoExiste(2);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarVerticesSonDistintosTest() {
        Grafo<Integer> grafo = new Grafo<>();
        grafo.agregarVertice(2, 1);
        grafo.agregarVertice(2, 1);
        grafo.verificarVerticesSonDistintos(2, 2);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarAristaExiste() {
        Grafo<Integer> grafo = inicializarGrafo();
        grafo.verificarAristaExiste(1, 3);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarAristaNoExiste() {
        Grafo<Integer> grafo = inicializarGrafo();
        grafo.verificarAristaNoExiste(1, 2);
    }

    @Test
    public void verificarAristaNoExisteHappyTest() {
        Grafo<Integer> grafo = this.inicializarGrafo();
        grafo.verificarAristaNoExiste(1, 3);
    }

    private Grafo<Integer> inicializarGrafo() {
        Grafo<Integer> grafo = new Grafo<>();
        grafo.agregarVertice(1, 1);
        grafo.agregarVertice(2, 1);
        grafo.agregarVertice(3, 1);

        grafo.agregarArista(1, 2);
        grafo.agregarArista(2, 3);
        return grafo;
    }

}
