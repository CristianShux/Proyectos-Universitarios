package algoritmos;

import org.junit.Assert;
import org.junit.Test;

import logica.Provincia;
import logica.grafo.Grafo;

public class BFSTest {
    private Provincia buenosAires = new Provincia("Buenos Aires", 1.00, 1.00);
    private Provincia entreRios = new Provincia("Entre Rios", 1.00, 1.00);
    private Provincia santaFe = new Provincia("Santa Fe", 1.00, 1.00);
    private Provincia cordoba = new Provincia("Córdoba", 1.00, 1.00);
    private Provincia laPampa = new Provincia("La Pampa", 1.00, 1.00);
    private Provincia rioNegro = new Provincia("Río Negro", 1.00, 1.00);

    @Test
    public void esConexoHappyTest() {
        Grafo<Provincia> grafo = inicializarGrafoConexo();
        Assert.assertTrue(BFS.esConexo(grafo));
    }

    public void noEsConexoTest() {
        Grafo<Provincia> grafo = inicializarGrafoNoConexo();
        Assert.assertFalse(BFS.esConexo(grafo));
    }

    @Test
    public void asegurarGrafoNoEsNullHappyTest() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();
        BFS.asegurarGrafoNoEsNull(grafo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarGrafoNoEsNullTest() {
        BFS.asegurarGrafoNoEsNull(null);
    }

    @Test
    public void elGrafoEstaVacioTest() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();
        Assert.assertTrue(BFS.elGrafoEstaVacio(grafo));
    }

    @Test
    public void elGrafoNoEstaVacioTest() {
        Grafo<Provincia> grafo = inicializarGrafoConexo();
        Assert.assertFalse(BFS.elGrafoEstaVacio(grafo));
    }

    private Grafo<Provincia> inicializarGrafoConexo() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();

        // Cantidad de provincias = 6
        grafo.agregarVertice(buenosAires);
        grafo.agregarVertice(entreRios);
        grafo.agregarVertice(santaFe);
        grafo.agregarVertice(cordoba);
        grafo.agregarVertice(laPampa);
        grafo.agregarVertice(rioNegro);

        // Cantidad de aristas = 9
        grafo.agregarArista(buenosAires, entreRios, 0);
        grafo.agregarArista(buenosAires, santaFe, 1);
        grafo.agregarArista(buenosAires, cordoba, 2);
        grafo.agregarArista(buenosAires, laPampa, 3);
        grafo.agregarArista(buenosAires, rioNegro, 4);
        grafo.agregarArista(entreRios, santaFe, 5);
        grafo.agregarArista(santaFe, cordoba, 6);
        grafo.agregarArista(cordoba, laPampa, 7);
        grafo.agregarArista(laPampa, rioNegro, 8);

        return grafo;
    }

    private Grafo<Provincia> inicializarGrafoNoConexo() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();

        // Cantidad de provincias = 6
        grafo.agregarVertice(buenosAires);
        grafo.agregarVertice(entreRios);
        grafo.agregarVertice(santaFe);
        grafo.agregarVertice(cordoba);
        grafo.agregarVertice(laPampa);
        grafo.agregarVertice(rioNegro);

        // Cantidad de aristas = 4
        // Buenos Aires queda aislado
        grafo.agregarArista(entreRios, santaFe, 5);
        grafo.agregarArista(santaFe, cordoba, 6);
        grafo.agregarArista(cordoba, laPampa, 7);
        grafo.agregarArista(laPampa, rioNegro, 8);

        return grafo;
    }

}
