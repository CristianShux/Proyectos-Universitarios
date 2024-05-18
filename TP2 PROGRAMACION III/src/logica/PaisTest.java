package logica;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.junit.Test;

import logica.grafo.Arista;
import logica.grafo.Grafo;

public class PaisTest {

    @Test(expected = IllegalArgumentException.class)
    public void crearPaisCantidadNoPositiva() {
        new Pais(0);
    }

    @Test
    public void crearPaisCantidadPositiva() {
        new Pais(1);
    }

    @Test(expected = IllegalArgumentException.class)
    public void agregarProvinciaNull() {
        Pais pais = this.generarPais();

        pais.agregarProvincia(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void agregarProvinciaDuplicada() {
        Pais pais = this.generarPais();

        pais.agregarProvincia(new Provincia("Buenos Aires", 10.1, 10.1));
    }

    @Test
    public void agregarProvincia() {
        Pais pais = this.generarPais();
        pais.agregarProvincia(new Provincia("Provincia falsa", 10.1, 10.1));
    }

    @Test
    public void generarRegionesTest() {
        Pais pais = this.generarPais();
        List<Arista<Provincia>> aristas = new ArrayList<>(pais.generarRegiones().getAristas());

        pais.setCantidadRegiones(2);

        Collections.sort(aristas, Collections.reverseOrder(new Comparator<Arista<Provincia>>() {

            @Override
            public int compare(Arista<Provincia> o1, Arista<Provincia> o2) {
                return Integer.compare(o1.getPeso(), o2.getPeso());
            }

        }));

        aristas.remove(0);
        Grafo<Provincia> regiones = pais.generarRegiones();
        List<Arista<Provincia>> listaAristasRegiones = new ArrayList<>(regiones.getAristas());
        assertEquals(aristas, listaAristasRegiones);

    }

    @Test(expected = IllegalArgumentException.class)
    public void setPesoAristaNoPositivoTest() {
        Pais pais = this.generarPais();

        Provincia buenosAires = pais.getProvincia("Buenos Aires");
        Provincia laPampa = pais.getProvincia("La Pampa");
        pais.setPesoArista(buenosAires, laPampa, 0);
    }

    @Test
    public void setPesoAristaPositivoTest() {
        Pais pais = this.generarPais();

        Provincia buenosAires = pais.getProvincia("Buenos Aires");
        Provincia laPampa = pais.getProvincia("La Pampa");
        pais.setPesoArista(buenosAires, laPampa, 1);
    }

    private Pais generarPais() {
        return new Pais(1);
    }
}
