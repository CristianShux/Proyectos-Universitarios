package algoritmos;

import org.junit.Assert;
import org.junit.Test;

import logica.Provincia;
import logica.grafo.Grafo;

public class EliminarAristasMasPesadasTest {
    private Provincia buenosAires = new Provincia("Buenos Aires", 1.00, 1.00);
    private Provincia entreRios = new Provincia("Entre Rios", 1.00, 1.00);
    private Provincia santaFe = new Provincia("Santa Fe", 1.00, 1.00);
    private Provincia cordoba = new Provincia("Córdoba", 1.00, 1.00);
    private Provincia laPampa = new Provincia("La Pampa", 1.00, 1.00);
    private Provincia rioNegro = new Provincia("Río Negro", 1.00, 1.00);

    @Test
    public void eliminarAristasHappyTest() {
        Grafo<Provincia> grafo = inicializarGrafoConAristas();

        EliminarAristasMasPesadas.eliminarAristas(grafo, 2);

        Assert.assertFalse(grafo.existeArista(laPampa, rioNegro));
        Assert.assertFalse(grafo.existeArista(cordoba, laPampa));
        Assert.assertTrue(grafo.existeArista(santaFe, cordoba));
    }

    @Test
    public void eliminarCeroAristasTest() {
        Grafo<Provincia> grafo = inicializarGrafoConAristas();

        EliminarAristasMasPesadas.eliminarAristas(grafo, 0);

        Assert.assertEquals(grafo.getAristas().size(), 9);
    }

    @Test
    public void eliminarTodasLasAristasTest() {
        Grafo<Provincia> grafo = inicializarGrafoConAristas();

        EliminarAristasMasPesadas.eliminarAristas(grafo, 9);

        Assert.assertEquals(grafo.getAristas().size(), 0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void eliminarAristasGrafoVacio() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();

        EliminarAristasMasPesadas.eliminarAristas(grafo, 2);
    }

    @Test(expected = IllegalArgumentException.class)
    public void eliminarAristasGrafoSinAristas() {
        Grafo<Provincia> grafo = inicializarGrafoSinAristas();

        EliminarAristasMasPesadas.eliminarAristas(grafo, 2);
    }

    @Test
    public void asegurarGrafoNoEsNullHappyTest() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();
        EliminarAristasMasPesadas.asegurarGrafoNoEsNull(grafo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarGrafoNoEsNullTest() {
        EliminarAristasMasPesadas.asegurarGrafoNoEsNull(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarCantidadValidaMuyGrandeTest() {
        Grafo<Provincia> grafo = inicializarGrafoConAristas();
        EliminarAristasMasPesadas.verificarCantidadValida(grafo.tamano(), 10);
        ;
    }

    @Test(expected = IllegalArgumentException.class)
    public void verificarCantidadValidaMenorACeroTest() {
        Grafo<Provincia> grafo = inicializarGrafoConAristas();
        EliminarAristasMasPesadas.eliminarAristas(grafo, -1);
    }

    private Grafo<Provincia> inicializarGrafoConAristas() {
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

    private Grafo<Provincia> inicializarGrafoSinAristas() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();

        // Cantidad de provincias = 6
        grafo.agregarVertice(buenosAires);
        grafo.agregarVertice(entreRios);
        grafo.agregarVertice(santaFe);
        grafo.agregarVertice(cordoba);
        grafo.agregarVertice(laPampa);
        grafo.agregarVertice(rioNegro);

        return grafo;
    }
}
