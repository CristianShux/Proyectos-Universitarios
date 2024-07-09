package logica.grafo;

import org.junit.Test;

public class VerticeTest {

    @Test(expected = IllegalArgumentException.class)
    public void verificarPesoEsValidoTest() {
        Vertice.verificarPesoEsValido(0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarVecinoExisteTest() {
        Vertice<Integer> vertice = new Vertice<Integer>(1, 10);
        Vertice<Integer> vecino = new Vertice<Integer>(2, 5);
        vertice.verificarVecinoExiste(vecino);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarVecinoNoExisteTest() {
        Vertice<Integer> vertice = new Vertice<Integer>(1, 10);
        Vertice<Integer> vecino = new Vertice<Integer>(2, 5);
        vertice.agregarVecino(vecino);
        vertice.verificarVecinoNoExiste(vecino);
    }

}
