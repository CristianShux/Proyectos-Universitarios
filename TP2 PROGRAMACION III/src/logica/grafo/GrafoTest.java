package logica.grafo;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Set;

import org.junit.Test;

public class GrafoTest {

    private final static String BUENOS_AIRES = "Buenos Aires";
    private final static String LA_PAMPA = "La Pampa";
    private final static String JUJUY = "Jujuy";
    private final static String CORDOBA = "Córdoba";
    private final static String CHACO = "Chaco";

    @Test(expected = NullPointerException.class)
    public void copiarGrafoNull() {
        new Grafo<>(null);
    }

    @Test
    public void copiarGrafoVacioTest() {
        Grafo<String> grafo = new Grafo<>();
        Grafo<String> copia = new Grafo<>(grafo);

        assertEquals(grafo, copia);
    }

    @Test
    public void copiarGrafoCorrectoTest() {
        Grafo<String> grafo = this.inicializarGrafo();
        Grafo<String> copia = new Grafo<>(grafo);

        assertEquals(grafo, copia);
    }

    @Test
    public void grafoVacioTamanoCeroTest() {
        assertEquals(0, new Grafo<String>().tamano());
    }

    @Test(expected = NullPointerException.class)
    public void agregarVerticeNullTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.agregarVertice(null);
    }

    @Test
    public void agregarVerticeTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.agregarVertice(BUENOS_AIRES);

        assertTrue(grafo.existeVertice(BUENOS_AIRES));
        assertEquals(1, grafo.tamano());
    }

    @Test(expected = IllegalArgumentException.class)
    public void agregarVerticeRepetidoTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        grafo.agregarVertice(BUENOS_AIRES);
    }

    @Test
    public void eliminarVerticeTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.agregarVertice(BUENOS_AIRES);
        grafo.agregarVertice(CHACO);
        grafo.agregarArista(BUENOS_AIRES, CHACO, 0);

        grafo.eliminarVertice(BUENOS_AIRES);

        assertFalse(grafo.getVertices().contains(BUENOS_AIRES));
        assertEquals(1, grafo.tamano());
        assertEquals(0, grafo.getAristas().size());
    }

    @Test(expected = IllegalArgumentException.class)
    public void eliminarVerticeInexistenteTest() {
        Grafo<String> grafo = new Grafo<>();

        grafo.eliminarVertice(BUENOS_AIRES);
    }

    @Test
    public void agregarAristaTest() {
        Grafo<String> grafo = this.inicializarGrafo();
        grafo.agregarVertice(JUJUY);

        grafo.agregarArista(JUJUY, BUENOS_AIRES, 0);

        assertTrue(grafo.existeArista(CORDOBA, CHACO));
        assertTrue(grafo.existeArista(CHACO, CORDOBA));
        assertEquals(4, grafo.getAristas().size());
        Arista<String> expected = new Arista<String>(CORDOBA, CHACO, 0);
        assertEquals(expected, grafo.getArista(CORDOBA, CHACO));
    }

    @Test(expected = IllegalArgumentException.class)
    public void agregarAristaRepetidaTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        grafo.agregarArista(CHACO, BUENOS_AIRES, 0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void aristaMismosVerticesTest() {
        Grafo<String> grafo = this.inicializarGrafo();
        grafo.agregarVertice(JUJUY);

        grafo.agregarArista(JUJUY, JUJUY, 0);
    }

    @Test
    public void eliminarAristaTest() {
        Grafo<String> grafo = this.inicializarGrafo();
        grafo.eliminarArista(CHACO, CORDOBA);

        assertFalse(grafo.existeArista(CORDOBA, CHACO));
    }

    @Test(expected = IllegalArgumentException.class)
    public void eliminarAristaInexistenteTest() {
        Grafo<String> grafo = this.inicializarGrafo();
        grafo.agregarVertice(LA_PAMPA);

        grafo.eliminarArista(LA_PAMPA, CORDOBA);
    }

    @Test(expected = IllegalArgumentException.class)
    public void eliminarAristaVerticesInexistentesTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        grafo.eliminarArista(JUJUY, LA_PAMPA);
    }

    @Test
    public void vecinosTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.agregarVertice(BUENOS_AIRES);
        grafo.agregarVertice(LA_PAMPA);
        grafo.agregarVertice(JUJUY);
        grafo.agregarArista(BUENOS_AIRES, LA_PAMPA, 0);

        Set<String> expected = Set.of(LA_PAMPA);
        assertEquals(expected, grafo.getVecinos(BUENOS_AIRES));

    }

    @Test
    public void cambiarPesoUnoAristaTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        grafo.setPesoArista(CHACO, BUENOS_AIRES, 1);

        assertEquals(1, grafo.getArista(CHACO, BUENOS_AIRES).getPeso());
    }

    @Test(expected = IllegalArgumentException.class)
    public void cambiarPesoCeroAristaTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        grafo.setPesoArista(CHACO, BUENOS_AIRES, 0);
    }

    @Test
    public void equalsNullTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        assertFalse(grafo.equals(null));
    }

    @Test
    public void equalsASiMismoTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        assertTrue(grafo.equals(grafo));
    }

    @Test
    public void equalsDiferenteObjetoTest() {
        Grafo<String> grafo = this.inicializarGrafo();

        assertFalse(grafo.equals(new Object()));
    }

    @Test(expected = NullPointerException.class)
    public void asegurarVerticeNoNullTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.asegurarVerticeNoNull(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarVerticeNoExisteTest() {
        Grafo<String> grafo = inicializarGrafo();
        grafo.asegurarVerticeNoExiste(BUENOS_AIRES);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarVerticeExisteTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.asegurarVerticeExiste(BUENOS_AIRES);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarVerticesDiferentesTest() {
        Grafo<String> grafo = inicializarGrafo();
        grafo.asegurarVerticesDiferentes(BUENOS_AIRES, BUENOS_AIRES);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarAristaNoExisteTest() {
        Grafo<String> grafo = inicializarGrafo();
        grafo.asegurarAristaNoExiste(BUENOS_AIRES, CHACO);
    }

    @Test(expected = IllegalArgumentException.class)
    public void asegurarAristaExisteTest() {
        Grafo<String> grafo = new Grafo<>();
        grafo.asegurarAristaExiste(BUENOS_AIRES, CHACO);
    }

    private Grafo<String> inicializarGrafo() {
        Grafo<String> grafo = new Grafo<>();

        grafo.agregarVertice(CHACO);
        grafo.agregarVertice(BUENOS_AIRES);
        grafo.agregarVertice(CORDOBA);

        grafo.agregarArista(CHACO, BUENOS_AIRES, 0);
        grafo.agregarArista(CORDOBA, BUENOS_AIRES, 0);
        grafo.agregarArista(CHACO, CORDOBA, 0);
        return grafo;
    }
}
