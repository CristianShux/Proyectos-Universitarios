package algoritmos;

import org.junit.Assert;
import org.junit.Test;

import logica.Provincia;
import logica.grafo.Grafo;

public class PrimTest {
    private Provincia buenosAires = new Provincia("Buenos Aires", 1.00, 1.00);
    private Provincia entreRios = new Provincia("Entre Rios", 1.00, 1.00);
    private Provincia santaFe = new Provincia("Santa Fe", 1.00, 1.00);
    private Provincia cordoba = new Provincia("Córdoba", 1.00, 1.00);
    private Provincia laPampa = new Provincia("La Pampa", 1.00, 1.00);
    private Provincia rioNegro = new Provincia("Río Negro", 1.00, 1.00);

    @Test
    public void primHappyTest() {
        Grafo<Provincia> grafo = inicializarGrafoConexo();
        Grafo<Provincia> grafoMinimo = Prim.arbolGeneradorMinimo(grafo);

        Assert.assertTrue(grafoMinimo.existeArista(buenosAires, entreRios));
        Assert.assertTrue(grafoMinimo.existeArista(buenosAires, santaFe));
        Assert.assertTrue(grafoMinimo.existeArista(buenosAires, cordoba));
        Assert.assertTrue(grafoMinimo.existeArista(buenosAires, laPampa));
        Assert.assertTrue(grafoMinimo.existeArista(buenosAires, rioNegro));
        Assert.assertFalse(grafoMinimo.existeArista(laPampa, cordoba));
    }

    @Test(expected = IllegalArgumentException.class)
    public void primGrafoNoEsConexoTest() {
        Grafo<Provincia> grafo = inicializarGrafoNoConexo();

        Prim.arbolGeneradorMinimo(grafo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void primGrafoNullTest() {
        Prim.arbolGeneradorMinimo(null);
    }

    @Test
    public void asegurarGrafoNoEsNullHappyTest() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();
        Prim.asegurarGrafoNoEsNull(grafo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarGrafoNoEsNullTest() {
        Prim.asegurarGrafoNoEsNull(null);
    }

    @Test
    public void primGrafoPesosIgualTest() {
        Grafo<Provincia> grafo = inicializarGrafoPesosIguales();
        Grafo<Provincia> grafoMinimo = Prim.arbolGeneradorMinimo(grafo);

        // Aristas generador minimo : cantidad de vertices - 1
        Assert.assertEquals(grafoMinimo.tamano() - 1, 5);
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

    private Grafo<Provincia> inicializarGrafoPesosIguales() {
        Grafo<Provincia> grafo = new Grafo<Provincia>();

        // Cantidad de provincias = 6
        grafo.agregarVertice(buenosAires);
        grafo.agregarVertice(entreRios);
        grafo.agregarVertice(santaFe);
        grafo.agregarVertice(cordoba);
        grafo.agregarVertice(laPampa);
        grafo.agregarVertice(rioNegro);

        // Cantidad de aristas = 9
        grafo.agregarArista(buenosAires, entreRios, 1);
        grafo.agregarArista(buenosAires, santaFe, 1);
        grafo.agregarArista(buenosAires, cordoba, 1);
        grafo.agregarArista(buenosAires, laPampa, 1);
        grafo.agregarArista(buenosAires, rioNegro, 1);
        grafo.agregarArista(entreRios, santaFe, 1);
        grafo.agregarArista(santaFe, cordoba, 1);
        grafo.agregarArista(cordoba, laPampa, 1);
        grafo.agregarArista(laPampa, rioNegro, 1);

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

        grafo.agregarArista(buenosAires, cordoba, 2);
        grafo.agregarArista(buenosAires, laPampa, 3);
        grafo.agregarArista(buenosAires, rioNegro, 4);
        grafo.agregarArista(cordoba, laPampa, 7);
        grafo.agregarArista(laPampa, rioNegro, 8);

        grafo.agregarArista(entreRios, santaFe, 5);

        return grafo;
    }
}
